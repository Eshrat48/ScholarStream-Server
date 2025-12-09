// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/reviews/scholarship/:scholarshipId
 * @desc    Get reviews for a scholarship
 * @access  Public
 * 
 * @route   GET /api/v1/reviews/user/:email
 * @desc    Get user reviews
 * @access  Private (verifyToken)
 * 
 * @route   GET /api/v1/reviews
 * @desc    Get all reviews
 * @access  Private - Moderator/Admin (verifyToken, verifyModerator)
 * 
 * @route   POST /api/v1/reviews
 * @desc    Add review
 * @access  Private (verifyToken)
 * 
 * @route   PATCH /api/v1/reviews/:id
 * @desc    Update review
 * @access  Private (verifyToken)
 * 
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Delete review
 * @access  Private (verifyToken)
 */
// Routes configured in index.js with reviewController methods

module.exports = router;
