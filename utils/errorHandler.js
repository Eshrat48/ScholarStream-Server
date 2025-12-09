/**
 * Centralized error handling utility
 * Provides consistent error response formatting across the API
 */

const sendError = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
    statusCode,
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  sendError,
  asyncHandler,
};
