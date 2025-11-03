const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyJWT = require('../middleware/verifyJWT');
const { generateQRCode, generateBulkQRCodes } = require('../utils/qrGenerator');
const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

// Admin login (no auth required)
router.post('/login', (req, res) => adminController.login(req, res));

// Get dashboard (JWT required)
router.get('/dashboard', verifyJWT, (req, res) => adminController.getDashboard(req, res));

// Debug: Get raw analytics data (JWT required)
router.get('/analytics-debug', verifyJWT, (req, res) => adminController.getAnalyticsDebug(req, res));

// List artworks (JWT required)
router.get('/artworks', verifyJWT, (req, res) => adminController.listArtworks(req, res));

// Update artwork content (description/story) (JWT required)
router.put('/artworks/:artworkId', verifyJWT, (req, res) => adminController.updateArtworkContent(req, res));

// Upload new artwork (metadata, images, 3D, audio, video)
const upload = require('../middleware/multer');
router.post(
	'/artwork-upload',
	verifyJWT,
	upload.fields([
		{ name: 'images', maxCount: 10 },
		{ name: 'model3d', maxCount: 1 },
		{ name: 'audio', maxCount: 1 },
		{ name: 'video', maxCount: 1 }
	]),
	(req, res) => adminController.uploadArtwork(req, res)
);

// Export report (JWT required)
router.get('/reports/export', verifyJWT, (req, res) => adminController.exportReport(req, res));

// ==================== QR CODE ENDPOINTS ====================

// Generate QR codes for all artworks (bulk)
router.post('/qr-codes/bulk-generate', verifyJWT, async (req, res) => {
  try {
    const db = getDatabase();
    const artworks = await db.collection('artworks').find({}).toArray();

    if (artworks.length === 0) {
      return res.status(404).json({ error: 'No artworks found' });
    }

    let successCount = 0;
    let failedCount = 0;
    const results = [];

    for (const artwork of artworks) {
      try {
        const qrUrl = await generateQRCode(artwork._id.toString());
        await db.collection('artworks').findOneAndUpdate(
          { _id: artwork._id },
          { $set: { qrCode: { url: qrUrl, generatedAt: new Date() } } },
          { returnDocument: 'after' }
        );
        successCount++;
        results.push({ artworkId: artwork._id.toString(), title: artwork.title, status: 'success' });
      } catch (error) {
        failedCount++;
        results.push({ artworkId: artwork._id.toString(), title: artwork.title, status: 'failed', error: error.message });
      }
    }

    res.json({
      message: 'Bulk QR generation complete',
      summary: { total: artworks.length, success: successCount, failed: failedCount },
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Bulk QR generation failed', details: error.message });
  }
});

// Regenerate QR code for specific artwork
router.post('/qr-codes/:artworkId/regenerate', verifyJWT, async (req, res) => {
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

    const qrUrl = await generateQRCode(artworkId);
    await db.collection('artworks').findOneAndUpdate(
      { _id: new ObjectId(artworkId) },
      { $set: { qrCode: { url: qrUrl, generatedAt: new Date() } } },
      { returnDocument: 'after' }
    );

    res.json({ message: 'QR code regenerated', artworkId, title: artwork.title });
  } catch (error) {
    res.status(500).json({ error: 'QR code regeneration failed', details: error.message });
  }
});

// Get QR code for specific artwork
router.get('/qr-codes/:artworkId', verifyJWT, async (req, res) => {
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

    res.json({ artworkId: artwork._id, title: artwork.title, qrCode: artwork.qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve QR code', details: error.message });
  }
});

module.exports = router;
