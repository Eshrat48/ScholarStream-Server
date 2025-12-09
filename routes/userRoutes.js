// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// POST /api/v1/users - Create user (Public)
// GET /api/v1/users/:email - Get user (Protected)
// GET /api/v1/users - Get all users (Admin only)
// PATCH /api/v1/users/:id/role - Update role (Admin only)
// DELETE /api/v1/users/:id - Delete user (Admin only)
// Configured in index.js

module.exports = router;
