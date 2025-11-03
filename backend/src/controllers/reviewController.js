const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

class ReviewController {
  /**
   * Get all reviews for an artwork with stats
   */
  async getReviews(req, res) {
    try {
      const { id } = req.params;
      const db = getDatabase();

      // Find artwork to validate it exists
      let artwork = null;
      if (ObjectId.isValid(id)) {
        artwork = await db.collection('artworks').findOne({ _id: new ObjectId(id) });
      }
      if (!artwork) {
        artwork = await db.collection('artworks').findOne({ artworkId: id });
      }
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      const artworkId = artwork._id.toString();

      // Get reviews
      const reviews = await db.collection('reviews')
        .find({ artworkId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      // Get likes count
      const likesCount = await db.collection('likes')
        .countDocuments({ artworkId });

      // Calculate average rating
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      // Count by rating
      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      res.json({
        artworkId,
        reviews,
        stats: {
          totalReviews: reviews.length,
          averageRating: parseFloat(avgRating),
          totalLikes: likesCount,
          ratingDistribution
        }
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Failed to get reviews' });
    }
  }

  /**
   * Submit a review for an artwork
   */
  async submitReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment, sessionId } = req.body;
      const db = getDatabase();

      // Validate input
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Find artwork to validate it exists
      let artwork = null;
      if (ObjectId.isValid(id)) {
        artwork = await db.collection('artworks').findOne({ _id: new ObjectId(id) });
      }
      if (!artwork) {
        artwork = await db.collection('artworks').findOne({ artworkId: id });
      }
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      const artworkId = artwork._id.toString();

      // Create review
      const review = {
        artworkId,
        rating: parseInt(rating),
        comment: comment || '',
        sessionId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('reviews').insertOne(review);

      res.status(201).json({
        message: 'Review submitted successfully',
        reviewId: result.insertedId,
        review: { ...review, _id: result.insertedId }
      });
    } catch (error) {
      console.error('Submit review error:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  }

  /**
   * Like an artwork (toggle like)
   */
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const { sessionId } = req.body;
      const db = getDatabase();

      // Validate input
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      // Find artwork to validate it exists
      let artwork = null;
      if (ObjectId.isValid(id)) {
        artwork = await db.collection('artworks').findOne({ _id: new ObjectId(id) });
      }
      if (!artwork) {
        artwork = await db.collection('artworks').findOne({ artworkId: id });
      }
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      const artworkId = artwork._id.toString();

      // Check if already liked
      const existingLike = await db.collection('likes')
        .findOne({ artworkId, sessionId });

      if (existingLike) {
        // Remove like
        await db.collection('likes').deleteOne({ _id: existingLike._id });
        
        // Get updated count
        const likesCount = await db.collection('likes')
          .countDocuments({ artworkId });

        return res.json({
          message: 'Like removed',
          liked: false,
          totalLikes: likesCount
        });
      } else {
        // Add like
        const like = {
          artworkId,
          sessionId,
          createdAt: new Date()
        };

        await db.collection('likes').insertOne(like);

        // Get updated count
        const likesCount = await db.collection('likes')
          .countDocuments({ artworkId });

        return res.status(201).json({
          message: 'Like added',
          liked: true,
          totalLikes: likesCount
        });
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      res.status(500).json({ error: 'Failed to toggle like' });
    }
  }

  /**
   * Check if user has liked an artwork
   */
  async checkLike(req, res) {
    try {
      const { id } = req.params;
      const { sessionId } = req.query;
      const db = getDatabase();

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      // Find artwork to validate it exists
      let artwork = null;
      if (ObjectId.isValid(id)) {
        artwork = await db.collection('artworks').findOne({ _id: new ObjectId(id) });
      }
      if (!artwork) {
        artwork = await db.collection('artworks').findOne({ artworkId: id });
      }
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      const artworkId = artwork._id.toString();

      // Check if liked
      const like = await db.collection('likes')
        .findOne({ artworkId, sessionId });

      // Get total likes
      const totalLikes = await db.collection('likes')
        .countDocuments({ artworkId });

      res.json({
        artworkId,
        liked: !!like,
        totalLikes
      });
    } catch (error) {
      console.error('Check like error:', error);
      res.status(500).json({ error: 'Failed to check like' });
    }
  }
}

module.exports = new ReviewController();
