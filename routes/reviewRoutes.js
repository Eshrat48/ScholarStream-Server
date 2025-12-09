// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();

// GET /api/v1/reviews/scholarship/:id - Get reviews (Public)
// GET /api/v1/reviews/user/:email - Get my reviews (Protected)
// GET /api/v1/reviews - Get all (Moderator/Admin)
// POST /api/v1/reviews - Add review (Protected)
// PATCH /api/v1/reviews/:id - Update review (Protected)
// DELETE /api/v1/reviews/:id - Delete review (Protected)
// Configured in index.js

module.exports = router;
