const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai-chat
router.post('/ai-chat', aiController.chat);

module.exports = router;
