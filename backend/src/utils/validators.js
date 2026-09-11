/**
 * FoodShareAI - Authentication Input Validators
 */
const { PUBLIC_ROLES } = require('./constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

/**
 * Validate public user registration payload
 * @param {object} data Request body
 * @returns {{ isValid: boolean, errors: string[], isAdminAttempt: boolean }}
 */
const validateRegisterInput = (data = {}) => {
  const errors = [];
  const { fullName, email, phone, password, role } = data;

  // 1. Check for forbidden ADMIN role attempt
  const normalizedRole = typeof role === 'string' ? role.trim().toUpperCase() : '';
  const isAdminAttempt = normalizedRole === 'ADMIN';

  if (isAdminAttempt) {
    return {
      isValid: false,
      errors: ['Admin accounts cannot be created through public registration'],
      isAdminAttempt: true,
    };
  }

  // 2. Validate role
  if (!normalizedRole || !PUBLIC_ROLES.includes(normalizedRole)) {
    errors.push(`Role must be one of: ${PUBLIC_ROLES.join(', ')}`);
  }

  // 3. Validate full name
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  // 4. Validate email
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  // 5. Validate phone (if provided)
  if (phone && (typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim()))) {
    errors.push('Please enter a valid mobile/phone number');
  }

  // 6. Validate password length (min 8 chars)
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    isAdminAttempt: false,
  };
};

/**
 * Validate login credentials
 * @param {object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateLoginInput = (data = {}) => {
  const errors = [];
  const { email, password } = data;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate reset password request
 * @param {object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateResetPasswordInput = (data = {}) => {
  const errors = [];
  const { token, newPassword } = data;

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    errors.push('Reset token is required');
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    errors.push('New password must be at least 8 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput,
};
