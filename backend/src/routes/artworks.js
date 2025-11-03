const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');

// Get single artwork
router.get('/:id', (req, res) => artworkController.getById(req, res));

// List artworks (paginated)
router.get('/', (req, res) => artworkController.list(req, res));

// Search artworks
router.get('/search/query', (req, res) => artworkController.search(req, res));

// Create artwork (admin only)
router.post('/', (req, res) => artworkController.create(req, res));

// Update artwork (admin only)
router.put('/:id', (req, res) => artworkController.update(req, res));

// Delete artwork (admin only)
router.delete('/:id', (req, res) => artworkController.delete(req, res));

module.exports = router;
