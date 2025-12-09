// routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/analytics/stats
 * @desc    Get dashboard statistics
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   GET /api/v1/analytics/applications-by-university
 * @desc    Get application stats by university
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   GET /api/v1/analytics/applications-by-category
 * @desc    Get application stats by category
 * @access  Private - Admin (verifyToken, verifyAdmin)
 */
// Routes configured in index.js with analyticsController methods

module.exports = router;
