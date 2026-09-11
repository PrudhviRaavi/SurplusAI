/**
 * FoodShareAI - Standardized API Response Utilities
 */

/**
 * Send a standardized success response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object|array|null} data
 * @param {number} statusCode
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized failure/error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} error
 * @param {number} statusCode
 */
const sendError = (res, message = 'An error occurred', error = null, statusCode = 500) => {
  const response = {
    success: false,
    message,
  };

  if (error !== null && error !== undefined) {
    response.error = typeof error === 'string' ? error : error.message || error;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
