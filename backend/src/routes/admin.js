const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyJWT = require('../middleware/verifyJWT');

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

module.exports = router;
