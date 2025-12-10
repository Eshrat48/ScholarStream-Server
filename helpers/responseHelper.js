/**
 * Response helper utilities
 * Provides consistent response formatting for API endpoints
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendCreated = (res, data, message = 'Resource created successfully') => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const sendDeleted = (res, message = 'Resource deleted successfully') => {
  return res.status(200).json({
    success: true,
    message,
  });
};

const sendPaginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendDeleted,
  sendPaginatedResponse,
};
