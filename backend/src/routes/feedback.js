const express = require('express');
const { getDatabase } = require('../config/database');

const router = express.Router();

// Get recent feedback/reviews
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get recent reviews with rating and comment
    const reviews = await db.collection('reviews')
      .find({
        comment: { $exists: true, $ne: '' }  // Only reviews with comments
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Transform to feedback format
    const feedback = reviews.map((review) => ({
      _id: review._id,
      visitorName: `Visitor ${review.sessionId.substring(0, 8)}...`,  // Anonymous name
      rating: review.rating,
      feedback: review.comment,
      artworkId: review.artworkId,
      createdAt: review.createdAt
    }));

    res.json({
      feedback,
      count: feedback.length
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
});

module.exports = router;
