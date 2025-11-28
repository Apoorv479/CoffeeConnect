// server/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (User must be logged in)
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, cafeId, cafeName } = req.body;

  // 1. Validation: Ensure all fields are present
  if (!rating || !comment || !cafeId) {
    res.status(400);
    throw new Error('Please provide rating, comment, and cafe ID');
  }

  // 2. Check: Did this user already review this specific cafe?
  const alreadyReviewed = await Review.findOne({
    user: req.user._id, // Getting User ID from the authMiddleware
    cafeId: cafeId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this cafe');
  }

  // 3. Create: Save the new review to MongoDB
  const review = await Review.create({
    user: req.user._id,
    cafeId,
    cafeName,
    rating: Number(rating),
    comment,
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

// @desc    Get all reviews for a specific cafe
// @route   GET /api/reviews/:cafeId
// @access  Public (Anyone can read reviews)
const getCafeReviews = asyncHandler(async (req, res) => {
  // Find reviews matching the cafeId from the URL
  const reviews = await Review.find({ cafeId: req.params.cafeId })
    .populate('user', 'name') // IMPORTANT: This replaces the user ID with the actual User Name
    .sort({ createdAt: -1 }); // Sort by newest first

  res.json(reviews);
});

module.exports = { createReview, getCafeReviews };