const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const validateSession = require('../middleware/validateSession');

// Validate session
router.post('/validate', validateSession, (req, res) => sessionController.validate(req, res));

// Update session preferences
router.post('/preferences', validateSession, (req, res) => sessionController.updatePreferences(req, res));

// Get artworks viewed in session
router.get('/viewed', validateSession, (req, res) => sessionController.getArtworksViewed(req, res));

module.exports = router;
