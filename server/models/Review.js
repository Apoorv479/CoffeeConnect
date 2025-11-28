// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    // Link the review to a specific User (Relationship)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the 'User' model
    },
    // Store the Cafe's ID from OpenStreetMap (OSM)
    cafeId: {
      type: String,
      required: true,
    },
    // Store the Cafe's Name (for display purposes on user profile)
    cafeName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Rating must be between 1 and 5
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;