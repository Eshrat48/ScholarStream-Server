// routes/scholarshipRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/scholarships/top
 * @desc    Get top 6 scholarships by lowest fees
 * @access  Public
 * 
 * @route   GET /api/v1/scholarships/category/:category
 * @desc    Get scholarships by category
 * @access  Public
 * 
 * @route   GET /api/v1/scholarships
 * @desc    Get all scholarships with pagination, search, filter, sort
 * @access  Public
 * 
 * @route   GET /api/v1/scholarships/:id
 * @desc    Get scholarship by ID
 * @access  Public
 * 
 * @route   POST /api/v1/scholarships
 * @desc    Create new scholarship
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   PATCH /api/v1/scholarships/:id
 * @desc    Update scholarship
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   DELETE /api/v1/scholarships/:id
 * @desc    Delete scholarship
 * @access  Private - Admin (verifyToken, verifyAdmin)
 */
// Routes configured in index.js with scholarshipController methods

module.exports = router;
