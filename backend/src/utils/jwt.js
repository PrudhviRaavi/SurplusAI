/**
 * FoodShareAI - JWT Utility
 * Generates and verifies JSON Web Tokens for stateless authenticated sessions.
 */
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in environment variables');
    }
    // Safe dev fallback if not set
    return 'foodshareai_default_dev_secret_key_change_in_production';
  }
  return secret;
};

/**
 * Generate a signed JWT access token containing only minimal identity claims
 * @param {object} user User object containing _id or id, and role
 * @returns {string} Signed JWT
 */
const generateAccessToken = (user) => {
  const payload = {
    userId: (user._id || user.id || user.userId).toString(),
    role: user.role,
  };

  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a JWT access token
 * @param {string} token Encoded JWT string
 * @returns {object} Decoded payload
 */
const verifyAccessToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
