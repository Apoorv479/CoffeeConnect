// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview, getCafeReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import kiya


router.post('/', protect, upload.single('image'), createReview);

router.get('/:cafeId', getCafeReviews);

module.exports = router;