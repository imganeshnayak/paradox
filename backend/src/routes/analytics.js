const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const validateSession = require('../middleware/validateSession');

// Submit analytics events
router.post('/events', validateSession, (req, res) => analyticsController.submitEvents(req, res));

// Get analytics summary
router.get('/summary', validateSession, (req, res) => analyticsController.getSummary(req, res));

// Get engagement heatmap
router.get('/heatmap', validateSession, (req, res) => analyticsController.getHeatmap(req, res));

module.exports = router;
