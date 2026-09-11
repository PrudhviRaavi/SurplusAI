/**
 * FoodShareAI - Centralized Error Handling Middleware
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Only expose detailed error/stack traces in non-production environments
  if (!isProduction) {
    response.error = err.name || 'Error';
    if (err.stack) {
      response.stack = err.stack;
    }
  } else {
    // In production, keep generic or sanitized message for 500 errors
    if (statusCode === 500) {
      response.message = 'An unexpected server error occurred';
    }
  }

  // Log error internally
  console.error(`[Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - ${err.message}`);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
