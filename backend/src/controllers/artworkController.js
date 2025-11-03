const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

class ArtworkController {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const db = getDatabase();

      // Try to find by MongoDB _id first, then by artworkId field
      let artwork = null;
      
      // Check if id is a valid MongoDB ObjectId
      if (ObjectId.isValid(id)) {
        artwork = await db.collection('artworks').findOne({ _id: new ObjectId(id) });
      }
      
      // If not found by _id, try artworkId field
      if (!artwork) {
        artwork = await db.collection('artworks').findOne({ artworkId: id });
      }

      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      res.json(artwork);
    } catch (error) {
      console.error('Get artwork error:', error);
      res.status(500).json({ error: 'Failed to get artwork' });
    }
  }

  async list(req, res) {
    try {
      const { location, limit = 20, offset = 0 } = req.query;
      const db = getDatabase();

      const filter = {};
      if (location) filter.location = location;

      const artworks = await db.collection('artworks')
        .find(filter)
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();

      const total = await db.collection('artworks').countDocuments(filter);

      res.json({
        artworks,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      });
    } catch (error) {
      console.error('List artworks error:', error);
      res.status(500).json({ error: 'Failed to list artworks' });
    }
  }

  async search(req, res) {
    try {
      const { q, location, period, limit = 20 } = req.query;
      const db = getDatabase();

      let filter = {};

      if (q) {
        // Text search
        filter.$text = { $search: q };
      }

      if (location) {
        filter.location = location;
      }

      if (period) {
        const year = parseInt(period);
        filter.yearCreated = {
          $gte: year - 10,
          $lte: year + 10
        };
      }

      const artworks = await db.collection('artworks')
        .find(filter)
        .limit(parseInt(limit))
        .toArray();

      res.json({
        results: artworks,
        count: artworks.length,
        query: q,
        filters: { location, period }
      });
    } catch (error) {
      console.error('Search artworks error:', error);
      res.status(500).json({ error: 'Failed to search artworks' });
    }
  }

  async create(req, res) {
    try {
      const artwork = req.body;
      const db = getDatabase();

      // Add timestamps
      artwork.createdAt = new Date();
      artwork.updatedAt = new Date();

      const result = await db.collection('artworks').insertOne(artwork);

      res.status(201).json({
        _id: result.insertedId,
        ...artwork
      });
    } catch (error) {
      console.error('Create artwork error:', error);
      res.status(500).json({ error: 'Failed to create artwork' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = getDatabase();

      updates.updatedAt = new Date();

      const result = await db.collection('artworks').findOneAndUpdate(
        { artworkId: id },
        { $set: updates },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      res.json(result.value);
    } catch (error) {
      console.error('Update artwork error:', error);
      res.status(500).json({ error: 'Failed to update artwork' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const db = getDatabase();

      const result = await db.collection('artworks').deleteOne({ artworkId: id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      res.json({ deleted: true, artworkId: id });
    } catch (error) {
      console.error('Delete artwork error:', error);
      res.status(500).json({ error: 'Failed to delete artwork' });
    }
  }
}

module.exports = new ArtworkController();
