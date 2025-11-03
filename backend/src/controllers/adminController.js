const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { getDatabase } = require('../config/database');
const config = require('../config/env');

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
      res.status(201).json({ message: 'Artwork uploaded', artworkId: result.insertedId, artwork });
    } catch (error) {
      console.error('Artwork upload error:', error);
      res.status(500).json({ error: 'Artwork upload failed', details: error.message });
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

      // Top artworks by views
      const topArtworks = await db.collection('analytics').aggregate([
        { $match: { ...filter, artworkId: { $exists: true } } },
        {
          $group: {
            _id: '$artworkId',
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$anonymousId' },
            avgDwellTime: { $avg: '$metadata.dwellTime' }
          }
        },
        {
          $project: {
            artworkId: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            avgDwellTime: { $round: ['$avgDwellTime', 0] },
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
        avgEventsPerVisitor: (totalEvents / totalVisitors).toFixed(2),
        topArtworks,
        eventDistribution,
        timelineData,
        period: { startDate, endDate }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to get dashboard data' });
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
