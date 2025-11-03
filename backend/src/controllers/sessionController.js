const { getDatabase } = require('../config/database');

class SessionController {
  async validate(req, res) {
    try {
      const { sessionId, anonymousId } = req;
      const db = getDatabase();

      const session = await db.collection('sessions').findOne({ sessionId });

      if (!session) {
        return res.status(401).json({ valid: false, error: 'Session not found' });
      }

      const isValid = new Date() < new Date(session.expiresAt);

      res.json({
        valid: isValid,
        sessionId,
        anonymousId,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      });
    } catch (error) {
      console.error('Validate session error:', error);
      res.status(500).json({ error: 'Failed to validate session' });
    }
  }

  async updatePreferences(req, res) {
    try {
      const { sessionId } = req;
      const { analyticsEnabled, marketingEnabled } = req.body;
      const db = getDatabase();

      const result = await db.collection('sessions').findOneAndUpdate(
        { sessionId },
        {
          $set: {
            'preferences.analyticsEnabled': analyticsEnabled,
            'preferences.marketingEnabled': marketingEnabled,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({
        updated: true,
        preferences: result.value.preferences
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  }

  async getArtworksViewed(req, res) {
    try {
      const { sessionId } = req;
      const db = getDatabase();

      const session = await db.collection('sessions').findOne({ sessionId });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Get artwork details for viewed artworks
      const artworks = await db.collection('artworks')
        .find({ artworkId: { $in: session.artworksViewed || [] } })
        .toArray();

      res.json({
        sessionId,
        artworksViewed: session.artworksViewed || [],
        artworkDetails: artworks,
        count: (session.artworksViewed || []).length
      });
    } catch (error) {
      console.error('Get artworks viewed error:', error);
      res.status(500).json({ error: 'Failed to get artworks viewed' });
    }
  }
}

module.exports = new SessionController();
