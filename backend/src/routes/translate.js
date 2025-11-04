const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

// POST /api/translate
router.post('/translate', translateController.translate);

module.exports = router;
