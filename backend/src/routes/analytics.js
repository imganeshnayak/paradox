const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Submit analytics events (no session validation needed for anonymous tracking)
router.post('/events', (req, res) => analyticsController.submitEvents(req, res));

// Get analytics summary
router.get('/summary', (req, res) => analyticsController.getSummary(req, res));

// Get engagement heatmap
router.get('/heatmap', (req, res) => analyticsController.getHeatmap(req, res));

module.exports = router;
