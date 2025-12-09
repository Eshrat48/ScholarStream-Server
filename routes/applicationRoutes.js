// routes/applicationRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/v1/applications
 * @desc    Create application
 * @access  Private (verifyToken)
 * 
 * @route   GET /api/v1/applications/user/:email
 * @desc    Get user applications
 * @access  Private (verifyToken)
 * 
 * @route   GET /api/v1/applications
 * @desc    Get all applications
 * @access  Private - Moderator/Admin (verifyToken, verifyModerator)
 * 
 * @route   PATCH /api/v1/applications/:id/status
 * @desc    Update application status
 * @access  Private - Moderator/Admin (verifyToken, verifyModerator)
 * 
 * @route   PATCH /api/v1/applications/:id/feedback
 * @desc    Add feedback to application
 * @access  Private - Moderator/Admin (verifyToken, verifyModerator)
 * 
 * @route   PATCH /api/v1/applications/:id/payment
 * @desc    Update payment status
 * @access  Private (verifyToken)
 * 
 * @route   PATCH /api/v1/applications/:id
 * @desc    Update application
 * @access  Private (verifyToken)
 * 
 * @route   DELETE /api/v1/applications/:id
 * @desc    Delete application
 * @access  Private (verifyToken)
 */
// Routes configured in index.js with applicationController methods

module.exports = router;
