// routes/scholarshipRoutes.js

const express = require('express');
const router = express.Router();

// GET /api/v1/scholarships - Get all (Public)
// GET /api/v1/scholarships/top - Get top 6 (Public)
// GET /api/v1/scholarships/category/:category - Get by category (Public)
// GET /api/v1/scholarships/:id - Get by ID (Public)
// POST /api/v1/scholarships - Add (Admin only)
// PATCH /api/v1/scholarships/:id - Update (Admin only)
// DELETE /api/v1/scholarships/:id - Delete (Admin only)
// Configured in index.js

module.exports = router;
