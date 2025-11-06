/**
 * Image Recognition Controller
 * Handles artwork image recognition via Gemini API
 */

const { analyzeArtworkImage, findMatchingArtworks } = require('../utils/geminiImageRecognition');

/**
 * Recognize artwork from image
 * POST /api/images/recognize
 * 
 * Body: { imageBase64: string } - Base64 image data
 * Returns: { artwork, metadata, matchScore }
 */
async function recognizeArtwork(req, res) {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'imageBase64 is required',
      });
    }

    // Remove data URL prefix if present
    let base64 = imageBase64;
    if (base64.includes('base64,')) {
      base64 = base64.split('base64,')[1];
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📸 IMAGE RECOGNITION REQUEST RECEIVED`);
    console.log(`${'='.repeat(60)}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`📊 Image Size: ${(base64.length / 1024).toFixed(2)} KB`);
    console.log(`🔄 Status: Starting Gemini analysis...\n`);

    // Analyze image with Gemini
    const metadata = await analyzeArtworkImage(base64);

    console.log(`\n📌 GEMINI ANALYSIS COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🎨 Identified Artwork:`);
    console.log(`   └─ Title: ${metadata.title}`);
    console.log(`   └─ Artist: ${metadata.artist}`);
    console.log(`   └─ Period: ${metadata.period}`);
    console.log(`   └─ Style: ${metadata.style}`);
    console.log(`${'='.repeat(60)}\n`);

    // Get all artworks from database (or use sample data for now)
    const artworks = await getAllArtworks();

    console.log(`🔍 SEARCHING DATABASE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📚 Total artworks in database: ${artworks.length}`);
    console.log(`🔎 Searching for: "${metadata.title}"...\n`);

    // Find matching artworks
    const matches = findMatchingArtworks(metadata, artworks);

    // Ensure matches have proper ID fields
    const processedMatches = matches.map(match => ({
      ...match,
      id: match._id || match.id,
    }));

    console.log(`\n🎯 SEARCH RESULTS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Matches found: ${processedMatches.length}`);
    
    if (processedMatches.length > 0) {
      processedMatches.slice(0, 3).forEach((match, index) => {
        console.log(`\n   Match #${index + 1}:`);
        console.log(`   ├─ Title: ${match.title}`);
        console.log(`   ├─ Artist: ${match.artist}`);
        console.log(`   ├─ Score: ${match.matchScore}%`);
        console.log(`   └─ ID: ${match.id}`);
      });
    }
    console.log(`\n${'='.repeat(60)}\n`);

    if (processedMatches.length === 0) {
      return res.status(404).json({
        error: 'No matching artwork found',
        metadata,
        suggestions: 'Try scanning a different angle or a clearer image',
      });
    }

    // Return top match with metadata
    const topMatch = processedMatches[0];

    console.log(`✨ RETURNING TOP MATCH TO FRONTEND`);
    console.log(`   Title: ${topMatch.title}`);
    console.log(`   Confidence: ${topMatch.matchScore}%\n`);

    // Track image recognition event
    await trackImageRecognitionEvent(topMatch.id, metadata, req.headers['x-session-id']);

    res.json({
      success: true,
      artwork: topMatch,
      metadata,
      allMatches: processedMatches,
      matchScore: topMatch.matchScore,
    });
  } catch (error) {
    console.error('\n❌ IMAGE RECOGNITION ERROR');
    console.error(`${'='.repeat(60)}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Error Stack:\n${error.stack}`);
    console.error(`${'='.repeat(60)}\n`);
    
    res.status(500).json({
      error: 'Image recognition failed',
      details: error.message,
    });
  }
}

/**
 * Get all artworks from MongoDB database
 */
async function getAllArtworks() {
  try {
    const { getDatabase } = require('../config/database');
    const db = getDatabase();
    
    if (!db) {
      console.warn('Database not initialized, using fallback sample data');
      const { SAMPLE_ARTWORKS } = require('../models/Artwork');
      return Object.values(SAMPLE_ARTWORKS || {});
    }
    
    const artworks = await db.collection('artworks').find({}).toArray();
    console.log(`✅ Fetched ${artworks.length} artworks from database`);
    return artworks;
  } catch (error) {
    console.error('Error fetching artworks from database:', error);
    // Fallback to sample data if database fails
    try {
      const { SAMPLE_ARTWORKS } = require('../models/Artwork');
      console.warn('Using fallback sample data');
      return Object.values(SAMPLE_ARTWORKS || {});
    } catch (fallbackError) {
      console.error('Fallback to sample data also failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Track image recognition event for analytics
 */
async function trackImageRecognitionEvent(artworkId, metadata, sessionId) {
  try {
    // This will be sent to analytics later
    console.log(`📊 Tracked: Image recognition for artwork ${artworkId}`);
    console.log(`   Metadata: ${metadata.title} by ${metadata.artist}`);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

module.exports = {
  recognizeArtwork,
};
