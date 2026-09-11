/**
 * FoodShareAI - Password Hashing Utility
 * Powered by bcryptjs for secure cryptographic one-way password hashing.
 */
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password
 * @param {string} password Plaintext password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password string is required for hashing');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password with a hashed password
 * @param {string} password Plaintext password
 * @param {string} hashedPassword Hashed password from database
 * @returns {Promise<boolean>} True if match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
