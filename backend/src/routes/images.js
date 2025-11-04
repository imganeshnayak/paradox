/**
 * Image Recognition Routes
 * POST /api/images/recognize - Recognize artwork from image
 */

const express = require('express');
const router = express.Router();
const { recognizeArtwork } = require('../controllers/imageController');

/**
 * POST /api/images/recognize
 * Recognize artwork from image using Gemini API
 * 
 * Body:
 * {
 *   "imageBase64": "base64_encoded_image_data"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "artwork": { ...artwork object },
 *   "metadata": { title, artist, style, period, description, confidence },
 *   "allMatches": [ ...all matching artworks sorted by relevance ],
 *   "matchScore": 95
 * }
 */
router.post('/recognize', recognizeArtwork);

module.exports = router;
