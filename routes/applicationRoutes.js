// routes/applicationRoutes.js

const express = require('express');
const router = express.Router();

// POST /api/v1/applications - Create (Protected)
// GET /api/v1/applications/user/:email - Get my apps (Protected)
// GET /api/v1/applications - Get all (Moderator/Admin)
// PATCH /api/v1/applications/:id/status - Update status (Moderator/Admin)
// PATCH /api/v1/applications/:id/feedback - Add feedback (Moderator/Admin)
// PATCH /api/v1/applications/:id/payment - Update payment (Protected)
// PATCH /api/v1/applications/:id - Update (Protected)
// DELETE /api/v1/applications/:id - Delete (Protected)
// Configured in index.js

module.exports = router;
