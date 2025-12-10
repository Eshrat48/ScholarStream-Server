/**
 * Database helper utilities
 * Common database operations and query builders
 */

const { ObjectId } = require('mongodb');

const isValidId = (id) => {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

const toObjectId = (id) => {
  return new ObjectId(id);
};

const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  const searchRegex = { $regex: searchTerm, $options: 'i' };
  return {
    $or: fields.map(field => ({ [field]: searchRegex })),
  };
};

const buildPaginationOptions = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};

const buildSortOptions = (sortBy = 'createdAt', order = 'desc') => {
  return { [sortBy]: order === 'asc' ? 1 : -1 };
};

module.exports = {
  isValidId,
  toObjectId,
  buildSearchQuery,
  buildPaginationOptions,
  buildSortOptions,
};
