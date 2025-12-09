/**
 * Input validation utility functions
 * Provides common validation checks for API requests
 */

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidAmount = (amount) => {
  return typeof amount === 'number' && amount > 0;
};

const isEmpty = (value) => {
  return !value || (typeof value === 'string' && value.trim() === '');
};

module.exports = {
  isValidEmail,
  isValidObjectId,
  isValidPhoneNumber,
  isValidURL,
  isValidAmount,
  isEmpty,
};
