const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Get all reviews for an artwork with stats
router.get('/:id/reviews', reviewController.getReviews.bind(reviewController));

// Submit a review
router.post('/:id/reviews', reviewController.submitReview.bind(reviewController));

// Toggle like for an artwork
router.post('/:id/like', reviewController.toggleLike.bind(reviewController));

// Check if user has liked an artwork
router.get('/:id/like/check', reviewController.checkLike.bind(reviewController));

module.exports = router;
