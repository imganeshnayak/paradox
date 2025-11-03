const { getDatabase } = require('../config/database');

class AnalyticsController {
  async submitEvents(req, res) {
    try {
      const { events } = req.body;
      const { sessionId, anonymousId } = req;

      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ error: 'Events array required' });
      }

      const db = getDatabase();
      
      // Add metadata to each event
      const enrichedEvents = events.map(event => ({
        ...event,
        sessionId,
        anonymousId,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }));

      // Insert events
      const result = await db.collection('analytics').insertMany(enrichedEvents);

      console.log(`📊 Received ${result.insertedCount} analytics events from session ${sessionId}`);

      res.json({ 
        received: result.insertedCount,
        insertedIds: result.insertedIds 
      });
    } catch (error) {
      console.error('Analytics submission error:', error);
      res.status(500).json({ error: 'Failed to submit analytics' });
    }
  }

  async getSummary(req, res) {
    try {
      const { startDate, endDate, artworkId } = req.query;
      const db = getDatabase();

      const filter = {};
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }
      if (artworkId) filter.artworkId = artworkId;

      // Get basic stats
      const totalEvents = await db.collection('analytics').countDocuments(filter);
      const uniqueSessions = await db.collection('analytics').distinct('sessionId', filter);

      // Get dwell time stats
      const dwellTimeStats = await db.collection('analytics').aggregate([
        { $match: { ...filter, eventType: 'dwell_time' } },
        {
          $group: {
            _id: null,
            avgDwellTime: { $avg: '$metadata.dwellTime' },
            maxDwellTime: { $max: '$metadata.dwellTime' },
            minDwellTime: { $min: '$metadata.dwellTime' }
          }
        }
      ]).toArray();

      // Get top artworks
      const topArtworks = await db.collection('analytics').aggregate([
        { $match: { ...filter, artworkId: { $exists: true } } },
        {
          $group: {
            _id: '$artworkId',
            views: { $sum: 1 },
            avgDwellTime: { $avg: '$metadata.dwellTime' }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]).toArray();

      res.json({
        totalEvents,
        uniqueSessions: uniqueSessions.length,
        dwellTimeStats: dwellTimeStats[0] || {},
        topArtworks,
        period: { startDate, endDate }
      });
    } catch (error) {
      console.error('Analytics summary error:', error);
      res.status(500).json({ error: 'Failed to get analytics summary' });
    }
  }

  async getHeatmap(req, res) {
    try {
      const { exhibitId } = req.query;
      const db = getDatabase();

      const filter = { 'metadata.location': { $exists: true } };
      if (exhibitId) filter.exhibitId = exhibitId;

      // Get location-based aggregation
      const heatmapData = await db.collection('analytics').aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$metadata.location',
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$anonymousId' }
          }
        },
        {
          $project: {
            location: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            _id: 0
          }
        },
        { $sort: { views: -1 } }
      ]).toArray();

      res.json({ locations: heatmapData });
    } catch (error) {
      console.error('Heatmap error:', error);
      res.status(500).json({ error: 'Failed to get heatmap data' });
    }
  }
}

module.exports = new AnalyticsController();
