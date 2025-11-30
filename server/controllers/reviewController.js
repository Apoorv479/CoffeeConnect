// server/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper Function: Upload Stream to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'cafefinder_reviews' }, // Cloudinary folder name
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const createReview = asyncHandler(async (req, res) => {
  
  const { rating, comment, cafeId, cafeName } = req.body;

  if (!rating || !comment || !cafeId) {
    res.status(400);
    throw new Error('Please provide rating, comment, and cafe ID');
  }

  // Duplicate Check
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    cafeId: cafeId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this cafe');
  }

  let imageUrl = null;

 
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url; // Cloudinary se URL mil gaya
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  
  const review = await Review.create({
    user: req.user._id,
    cafeId,
    cafeName,
    rating: Number(rating),
    comment,
    image: imageUrl, 
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

const getCafeReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ cafeId: req.params.cafeId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = { createReview, getCafeReviews };