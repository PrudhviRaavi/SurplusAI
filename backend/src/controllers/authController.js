/**
 * FoodShareAI - Authentication Controller
 * Handles HTTP requests and maps responses using standardized API response format.
 */
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Public User Registration
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, 'Account created successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Standard User Login (Donor, NGO, Volunteer)
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Dedicated Admin Portal Login
 * POST /api/auth/admin/login
 */
const adminLogin = async (req, res, next) => {
  try {
    const result = await authService.loginAdmin(req.body);
    return sendSuccess(res, 'Admin authentication successful', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Authenticated User
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, 'User profile retrieved', user, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * User Logout (Stateless JWT cleanup)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  // Clear any auth cookies if present
  res.clearCookie('token');
  return sendSuccess(res, 'Logged out successfully', null, 200);
};

/**
 * Forgot Password Request
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return sendSuccess(res, result.message, result.devResetToken ? { devResetToken: result.devResetToken } : null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password with Token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
