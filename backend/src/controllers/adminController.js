const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const config = require('../config/env');
const { generateQRCode } = require('../utils/qrGenerator');

class AdminController {
  /**
   * Upload new artwork (metadata, images, 3D, audio, video)
   * Expects multipart/form-data with fields:
   * - title, artist, year, description, tags, type
   * - images (multiple files), model3d (file), audio (file), video (file)
   * Note: 3D models are only allowed for 'sculpture' type artworks
   */
  async uploadArtwork(req, res) {
    try {
      const db = getDatabase();
      const body = req.body;
      const files = req.files || {};

      // Validate artwork type
      const validTypes = ['painting', 'sculpture', 'drawing', 'installation', 'other'];
      if (!body.type || !validTypes.includes(body.type.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid artwork type. Must be one of: ' + validTypes.join(', ') });
      }

      // Validate: 3D models only for sculptures
      if (files.model3d && files.model3d[0] && body.type.toLowerCase() !== 'sculpture') {
        return res.status(400).json({ error: '3D models can only be uploaded for sculptures. This artwork is a ' + body.type });
      }

      // Upload files to Cloudinary
      let images = [], model3d = null, audio = null, video = null;
      
      // Handle multiple images
      if (files.images && files.images.length > 0) {
        for (const img of files.images) {
          const uploadedImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'artworks/images', resource_type: 'image' }, (err, result) => {
              if (err) reject(err); else resolve(result);
            }).end(img.buffer);
          });
          images.push({ url: uploadedImage.secure_url, cloudinaryId: uploadedImage.public_id });
        }
      }

      // Handle 3D model (only for sculptures)
      if (files.model3d && files.model3d[0]) {
        const model = files.model3d[0];
        model3d = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'artworks/3d', resource_type: 'raw' }, (err, result) => {
            if (err) reject(err); else resolve(result);
          }).end(model.buffer);
        });
        model3d = { url: model3d.secure_url, cloudinaryId: model3d.public_id, format: model3d.format };
      }

      // Handle audio
      if (files.audio && files.audio[0]) {
        const audioFile = files.audio[0];
        audio = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'artworks/audio', resource_type: 'video' }, (err, result) => {
            if (err) reject(err); else resolve(result);
          }).end(audioFile.buffer);
        });
        audio = { url: audio.secure_url, cloudinaryId: audio.public_id, duration: audio.duration };
      }

      // Handle video
      if (files.video && files.video[0]) {
        const videoFile = files.video[0];
        video = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'artworks/video', resource_type: 'video' }, (err, result) => {
            if (err) reject(err); else resolve(result);
          }).end(videoFile.buffer);
        });
        video = { url: video.secure_url, cloudinaryId: video.public_id, duration: video.duration };
      }

      // Build artwork document
      const artwork = {
        title: body.title,
        artist: body.artist,
        yearCreated: parseInt(body.year) || new Date().getFullYear(),
        description: body.description,
        type: body.type.toLowerCase(),
        tags: body.tags ? body.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        images: images.length > 0 ? images : null,
        model3d: model3d,
        audio: audio,
        video: video,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('artworks').insertOne(artwork);
      
      // Auto-generate QR code for the artwork
      try {
        const qrCodeUrl = await generateQRCode(result.insertedId.toString());
        
        // Update artwork with QR code URL
        await db.collection('artworks').findOneAndUpdate(
          { _id: result.insertedId },
          { $set: { qrCode: { url: qrCodeUrl, generatedAt: new Date() } } },
          { returnDocument: 'after' }
        );
        
        console.log(`✅ QR Code auto-generated for artwork ${result.insertedId}`);
      } catch (qrError) {
        console.warn(`⚠️ QR Code generation failed for artwork ${result.insertedId}:`, qrError.message);
        // Don't fail the upload if QR generation fails
      }
      
      res.status(201).json({ message: 'Artwork uploaded', artworkId: result.insertedId, artwork });
    } catch (error) {
      console.error('Artwork upload error:', error);
      res.status(500).json({ error: 'Export report failed' });
    }
  }

  async generateBulkQRCodes(req, res) {
    try {
      const db = getDatabase();
      
      // Get all artworks
      const artworks = await db.collection('artworks').find({}).toArray();
      
      if (artworks.length === 0) {
        return res.status(404).json({ error: 'No artworks found' });
      }

      console.log(`📊 Starting bulk QR generation for ${artworks.length} artworks...`);
      
      let successCount = 0;
      let failedCount = 0;
      const results = [];

      for (const artwork of artworks) {
        try {
          const qrUrl = await generateQRCode(artwork._id.toString());
          
          // Update artwork with QR code
          await db.collection('artworks').findOneAndUpdate(
            { _id: artwork._id },
            { $set: { qrCode: { url: qrUrl, generatedAt: new Date() } } },
            { returnDocument: 'after' }
          );
          
          successCount++;
          results.push({
            artworkId: artwork._id.toString(),
            title: artwork.title,
            status: 'success'
          });
        } catch (error) {
          failedCount++;
          results.push({
            artworkId: artwork._id.toString(),
            title: artwork.title,
            status: 'failed',
            error: error.message
          });
        }
      }

      res.json({
        message: 'Bulk QR generation complete',
        summary: {
          total: artworks.length,
          success: successCount,
          failed: failedCount
        },
        results: results
      });
    } catch (error) {
      console.error('Bulk QR generation error:', error);
      res.status(500).json({ error: 'Bulk QR generation failed', details: error.message });
    }
  }

  async regenerateQRCode(req, res) {
    try {
      const { artworkId } = req.params;
      const db = getDatabase();
      
      if (!ObjectId.isValid(artworkId)) {
        return res.status(400).json({ error: 'Invalid artwork ID' });
      }

      const artwork = await db.collection('artworks').findOne({ _id: new ObjectId(artworkId) });
      
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      // Generate new QR code
      const qrUrl = await generateQRCode(artworkId);
      
      // Update artwork
      const result = await db.collection('artworks').findOneAndUpdate(
        { _id: new ObjectId(artworkId) },
        { $set: { qrCode: { url: qrUrl, generatedAt: new Date() } } },
        { returnDocument: 'after' }
      );

      res.json({
        message: 'QR code regenerated',
        artworkId: artwork._id,
        title: artwork.title,
        qrCode: result.value.qrCode
      });
    } catch (error) {
      console.error('Regenerate QR code error:', error);
      res.status(500).json({ error: 'QR code regeneration failed', details: error.message });
    }
  }

  async getQRCode(req, res) {
    try {
      const { artworkId } = req.params;
      const db = getDatabase();

      if (!ObjectId.isValid(artworkId)) {
        return res.status(400).json({ error: 'Invalid artwork ID' });
      }

      const artwork = await db.collection('artworks').findOne({ _id: new ObjectId(artworkId) });
      
      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      if (!artwork.qrCode || !artwork.qrCode.url) {
        return res.status(404).json({ error: 'QR code not generated for this artwork' });
      }

      res.json({
        artworkId: artwork._id,
        title: artwork.title,
        qrCode: artwork.qrCode
      });
    } catch (error) {
      console.error('Get QR code error:', error);
      res.status(500).json({ error: 'Failed to retrieve QR code', details: error.message });
    }
  }

  async login(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password required' });
      }

      // Simple password check (in production, use proper admin user table)
      if (password !== config.admin.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { role: 'admin', loginTime: new Date().toISOString() },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      res.json({
        token,
        expiresIn: config.jwt.expire,
        type: 'Bearer'
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getDashboard(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const db = getDatabase();

      // Disable caching for dashboard data (always fresh)
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      const filter = {};
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      // Total visitors (unique sessions)
      const uniqueSessions = await db.collection('analytics').distinct('sessionId', filter);
      const totalVisitors = uniqueSessions.length;

      // Total events
      const totalEvents = await db.collection('analytics').countDocuments(filter);

      console.log(`📊 Dashboard: ${totalVisitors} visitors, ${totalEvents} events`);

      // Top artworks by views
      const topArtworks = await db.collection('analytics').aggregate([
        { $match: { ...filter, artworkId: { $exists: true } } },
        {
          $group: {
            _id: '$artworkId',
            totalEvents: { $sum: 1 },
            views: {
              $sum: {
                $cond: [{ $eq: ['$eventType', 'artwork_view'] }, 1, 0]
              }
            },
            likes: {
              $sum: {
                $cond: [{ $in: ['$eventType', ['like_added', 'like']] }, 1, 0]
              }
            },
            likesRemoved: {
              $sum: {
                $cond: [{ $eq: ['$eventType', 'like_removed'] }, 1, 0]
              }
            },
            reviews: {
              $sum: {
                $cond: [{ $in: ['$eventType', ['review_submitted', 'review']] }, 1, 0]
              }
            },
            uniqueVisitors: { $addToSet: '$anonymousId' },
            avgDwellTime: { $avg: '$metadata.dwellTime' }
          }
        },
        {
          $project: {
            artworkId: '$_id',
            views: 1,
            likes: 1,
            likesRemoved: 1,
            netLikes: { $subtract: ['$likes', '$likesRemoved'] },
            reviews: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            avgDwellTime: { $round: ['$avgDwellTime', 0] },
            engagement: {
              $add: [
                { $subtract: ['$likes', '$likesRemoved'] },
                { $multiply: ['$reviews', 2] }
              ]
            },
            _id: 0
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]).toArray();

      // Event type distribution
      const eventDistribution = await db.collection('analytics').aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();

      // Time-based metrics
      const timelineData = await db.collection('analytics').aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            events: { $sum: 1 },
            visitors: { $addToSet: '$anonymousId' }
          }
        },
        {
          $project: {
            date: '$_id',
            events: 1,
            visitors: { $size: '$visitors' },
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]).toArray();

      res.json({
        totalVisitors,
        totalEvents,
        avgEventsPerVisitor: totalVisitors > 0 ? (totalEvents / totalVisitors).toFixed(2) : 0,
        topArtworks,
        eventDistribution,
        timelineData,
        period: { startDate, endDate },
        debug: {
          timestamp: new Date(),
          uniqueSessionsCount: uniqueSessions.length,
          topArtworksCount: topArtworks.length,
          eventTypesCount: eventDistribution.length
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to get dashboard data', details: error.message });
    }
  }

  async listArtworks(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const db = getDatabase();

      const skip = (page - 1) * limit;

      const artworks = await db.collection('artworks')
        .find({})
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      const total = await db.collection('artworks').countDocuments({});

      res.json({
        artworks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('List artworks error:', error);
      res.status(500).json({ error: 'Failed to list artworks' });
    }
  }

  async updateArtworkContent(req, res) {
    try {
      const { artworkId } = req.params;
      const { description, story } = req.body;
      const db = getDatabase();

      if (!artworkId) {
        return res.status(400).json({ error: 'Artwork ID required' });
      }

      if (!description && !story) {
        return res.status(400).json({ error: 'At least description or story is required' });
      }

      const updateData = {};
      
      if (description) updateData.description = description;
      if (story) updateData.story = story;
      updateData.updatedAt = new Date();

      const result = await db.collection('artworks').findOneAndUpdate(
        { _id: new ObjectId(artworkId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      console.log(`📝 Updated artwork ${artworkId}: description and/or story updated`);
      res.json({
        message: 'Artwork content updated successfully',
        artwork: result.value
      });
    } catch (error) {
      console.error('Update artwork error:', error);
      res.status(500).json({ error: 'Failed to update artwork', details: error.message });
    }
  }

  async getAnalyticsDebug(req, res) {
    try {
      const db = getDatabase();

      // Count documents in each collection
      const analyticsCount = await db.collection('analytics').countDocuments({});
      const likesCount = await db.collection('likes').countDocuments({});
      const reviewsCount = await db.collection('reviews').countDocuments({});

      // Get event type distribution
      const eventTypes = await db.collection('analytics').distinct('eventType');

      // Get recent like events
      const recentLikes = await db.collection('analytics')
        .find({ eventType: 'like_added' })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      // Get recent review events
      const recentReviews = await db.collection('analytics')
        .find({ eventType: 'review_submitted' })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      // Get all likes per artwork
      const likesByArtwork = await db.collection('analytics').aggregate([
        { $match: { eventType: 'like_added' } },
        {
          $group: {
            _id: '$artworkId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();

      // Get all reviews per artwork
      const reviewsByArtwork = await db.collection('analytics').aggregate([
        { $match: { eventType: 'review_submitted' } },
        {
          $group: {
            _id: '$artworkId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();

      res.json({
        collections: {
          analyticsCount,
          likesCount,
          reviewsCount
        },
        eventTypes,
        recentLikes,
        recentReviews,
        likesByArtwork,
        reviewsByArtwork,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analytics debug error:', error);
      res.status(500).json({ error: 'Failed to get analytics debug info' });
    }
  }

  async upload3DModel(req, res) {
    try {
      // This endpoint requires multer middleware setup
      // For now, return a placeholder response
      res.status(501).json({ 
        message: 'File upload endpoint - requires multer middleware',
        note: 'Implement with multer and cloudinary upload'
      });
    } catch (error) {
      console.error('3D upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  }

  async exportReport(req, res) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;
      const db = getDatabase();

      const filter = {};
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      const data = await db.collection('analytics').find(filter).toArray();

      if (format === 'csv') {
        // Convert to CSV format
        const csv = convertToCSV(data);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="analytics-report.csv"');
        res.send(csv);
      } else {
        // JSON format
        res.header('Content-Type', 'application/json');
        res.header('Content-Disposition', 'attachment; filename="analytics-report.json"');
        res.json({ data, count: data.length });
      }
    } catch (error) {
      console.error('Export report error:', error);
      res.status(500).json({ error: 'Failed to export report' });
    }
  }
}

function convertToCSV(data) {
  if (data.length === 0) return 'No data';

  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).includes(',') ? `"${value}"` : value;
    });
    csv.push(values.join(','));
  });

  return csv.join('\n');
}

module.exports = new AdminController();
