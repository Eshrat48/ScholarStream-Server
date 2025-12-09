// routes/authRoutes.js

const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/v1/auth/jwt
 * @desc    Generate JWT token for user
 * @access  Public
 */
// Endpoint configured in index.js with authController.generateToken

module.exports = router;
