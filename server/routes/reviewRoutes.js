// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();

// Import the Logic (Controller) and the Guard (Middleware)
const { createReview, getCafeReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// --- Define Routes ---

// 1. Add a Review (POST /api/reviews)
// We add 'protect' here so only logged-in users can post
router.post('/', protect, createReview);

// 2. Get Reviews for a Cafe (GET /api/reviews/:cafeId)
// We do NOT add 'protect' here because anyone should be able to read reviews
router.get('/:cafeId', getCafeReviews);

module.exports = router;