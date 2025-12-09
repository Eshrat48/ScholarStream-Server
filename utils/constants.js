/**
 * Application constants
 * Centralized configuration for roles, statuses, and other constants
 */

const USER_ROLES = {
  STUDENT: 'Student',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
};

const APPLICATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

const SCHOLARSHIP_CATEGORY = {
  MERIT_BASED: 'Merit-based',
  NEED_BASED: 'Need-based',
  SPORTS: 'Sports',
  ARTS: 'Arts',
  RESEARCH: 'Research',
  INTERNATIONAL: 'International',
};

const API_ROUTES = {
  AUTH: '/api/v1/auth',
  USERS: '/api/v1/users',
  SCHOLARSHIPS: '/api/v1/scholarships',
  APPLICATIONS: '/api/v1/applications',
  REVIEWS: '/api/v1/reviews',
  PAYMENTS: '/api/v1/payments',
  ANALYTICS: '/api/v1/analytics',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  DATABASE_ERROR: 'Database error occurred',
  SERVER_ERROR: 'Internal server error',
};

module.exports = {
  USER_ROLES,
  APPLICATION_STATUS,
  SCHOLARSHIP_CATEGORY,
  API_ROUTES,
  HTTP_STATUS,
  ERROR_MESSAGES,
};
