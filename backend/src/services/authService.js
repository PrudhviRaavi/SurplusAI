/**
 * FoodShareAI - Authentication Service
 * Business logic layer for registration, authentication, RBAC checks, and password lifecycle.
 */
const crypto = require('crypto');
const {
  User,
  DonorProfile,
  NgoProfile,
  VolunteerProfile,
  Impact,
} = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken } = require('../utils/jwt');
const {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput,
} = require('../utils/validators');
const { ROLES } = require('../utils/constants');

/**
 * Register a new public user (DONOR, NGO, or VOLUNTEER only)
 * Rejects ADMIN role creation with HTTP 403.
 */
const registerUser = async (data) => {
  // 1. Input validation
  const validation = validateRegisterInput(data);
  if (validation.isAdminAttempt) {
    const error = new Error('Admin accounts cannot be created through public registration');
    error.statusCode = 403;
    throw error;
  }

  if (!validation.isValid) {
    const error = new Error(validation.errors.join('. '));
    error.statusCode = 400;
    throw error;
  }

  const { fullName, email, phone, password, role } = data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedRole = role.trim().toUpperCase();

  // 2. Check for duplicate email
  const existingUserByEmail = await User.findOne({ email: normalizedEmail });
  if (existingUserByEmail) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409;
    throw error;
  }

  // 3. Check for duplicate phone (if provided)
  if (phone && phone.trim()) {
    const existingUserByPhone = await User.findOne({ phone: phone.trim() });
    if (existingUserByPhone) {
      const error = new Error('An account with this phone number already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  // 4. Hash password
  const hashedPassword = await hashPassword(password);

  // 5. Create user
  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : undefined,
    passwordHash: hashedPassword,
    role: normalizedRole,
    isActive: true,
    profileCompleted: false,
  });

  // 6. Create corresponding role profile with default location
  // Default coordinates fallback: Hyderabad [78.38, 17.44]
  const defaultPoint = { type: 'Point', coordinates: [78.3826, 17.4474] };

  if (normalizedRole === ROLES.DONOR) {
    await DonorProfile.create({
      userId: user._id,
      donorType: 'OTHER',
      organizationName: fullName.trim(),
      location: defaultPoint,
    });
  } else if (normalizedRole === ROLES.NGO) {
    await NgoProfile.create({
      userId: user._id,
      organizationName: fullName.trim(),
      organizationType: 'NGO',
      location: defaultPoint,
    });
  } else if (normalizedRole === ROLES.VOLUNTEER) {
    await VolunteerProfile.create({
      userId: user._id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      location: defaultPoint,
    });
  }

  // 7. Initialize Impact profile
  await Impact.create({
    userId: user._id,
    role: normalizedRole,
    mealsRescued: 0,
    foodSavedKg: 0,
    deliveriesCompleted: 0,
    donationsCompleted: 0,
    impactPoints: 0,
    co2SavedKg: 0,
  });

  // 8. Generate JWT
  const token = generateAccessToken(user);

  return {
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
    token,
  };
};

/**
 * Authenticate standard user (DONOR, NGO, VOLUNTEER)
 */
const loginUser = async (data) => {
  const validation = validateLoginInput(data);
  if (!validation.isValid) {
    const error = new Error(validation.errors.join('. '));
    error.statusCode = 400;
    throw error;
  }

  const { email, password } = data;
  const normalizedEmail = email.toLowerCase().trim();

  // Find user and explicitly select passwordHash
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Check if account is active
  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  // Compare passwords
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate JWT
  const token = generateAccessToken(user);

  return {
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
    token,
  };
};

/**
 * Authenticate Administrator (Strict role === ADMIN check)
 */
const loginAdmin = async (data) => {
  const validation = validateLoginInput(data);
  if (!validation.isValid) {
    const error = new Error(validation.errors.join('. '));
    error.statusCode = 400;
    throw error;
  }

  const { email, password } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Admin account is deactivated.');
    error.statusCode = 403;
    throw error;
  }

  // Strict role verification: Non-admins cannot login via admin endpoint
  if (user.role !== ROLES.ADMIN) {
    const error = new Error('Admin access denied');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateAccessToken(user);

  return {
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
    token,
  };
};

/**
 * Retrieve current authenticated user profile
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    const error = new Error('User not found or account is deactivated');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    profileCompleted: user.profileCompleted,
    createdAt: user.createdAt,
  };
};

/**
 * Initiate password reset flow (Safe generic response to prevent account enumeration)
 */
const forgotPassword = async (email) => {
  if (!email || typeof email !== 'string') {
    return {
      message: 'If the account exists, password reset instructions will be sent.',
    };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  let devResetToken = null;

  if (user && user.isActive) {
    // Generate secure random reset token
    const rawToken = crypto.randomBytes(32).toString('hex');
    // Hash token using SHA-256 for secure storage
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
    await user.save();

    // In development mode, expose token for testing/inspection
    if (process.env.NODE_ENV !== 'production') {
      devResetToken = rawToken;
    }
  }

  const result = {
    message: 'If the account exists, password reset instructions will be sent.',
  };

  if (devResetToken) {
    result.devResetToken = devResetToken;
  }

  return result;
};

/**
 * Reset user password using token
 */
const resetPassword = async ({ token, newPassword }) => {
  const validation = validateResetPasswordInput({ token, newPassword });
  if (!validation.isValid) {
    const error = new Error(validation.errors.join('. '));
    error.statusCode = 400;
    throw error;
  }

  // Hash incoming raw token to compare against stored hash
  const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires +passwordHash');

  if (!user) {
    const error = new Error('Invalid or expired password reset token');
    error.statusCode = 400;
    throw error;
  }

  // Hash and save new password
  const newHashedPassword = await hashPassword(newPassword);
  user.passwordHash = newHashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return {
    message: 'Password has been reset successfully. You may now login.',
  };
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
