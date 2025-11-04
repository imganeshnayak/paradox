const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

// POST /api/translate (router is already mounted at /api/translate)
router.post('/', translateController.translate);

module.exports = router;
