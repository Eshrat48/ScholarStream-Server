// routes/userRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/v1/users
 * @desc    Create new user
 * @access  Public
 * 
 * @route   GET /api/v1/users/:email
 * @desc    Get user by email
 * @access  Private (verifyToken)
 * 
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Update user role
 * @access  Private - Admin (verifyToken, verifyAdmin)
 * 
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private - Admin (verifyToken, verifyAdmin)
 */
// Routes configured in index.js with userController methods

module.exports = router;
