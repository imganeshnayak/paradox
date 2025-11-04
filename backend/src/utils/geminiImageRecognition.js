/**
 * Gemini Image Recognition Utility
 * Uses Google's Gemini API to identify artworks from images
 */

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Analyze artwork image using Gemini API
 * Extracts: title, artist, style, period, description
 * 
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<Object>} - Artwork metadata { title, artist, style, period, description }
 */
async function analyzeArtworkImage(base64Image) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured in environment');
    }

    const prompt = `Analyze this artwork image and extract the following information in JSON format:
{
  "title": "artwork title or 'Unknown' if not identifiable",
  "artist": "artist name or 'Unknown'",
  "style": "art style or period",
  "period": "historical period or era",
  "description": "brief description of what you see",
  "confidence": "high/medium/low - confidence in identification"
}

If you recognize a famous artwork (like Mona Lisa, Starry Night, etc), use the actual title.
If it's a generic artwork or not identifiable, provide descriptive keywords.
Respond ONLY with valid JSON, no additional text.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image, // Base64 without 'data:image/jpeg;base64,' prefix
                },
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
      }
    );

    // Extract text response from Gemini
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini API response');
    }

    const responseText = response.data.candidates[0].content.parts[0].text;
    
    console.log(`\n📝 RAW GEMINI RESPONSE:\n${responseText}\n`);
    
    // Parse JSON response
    let metadata = JSON.parse(responseText);
    
    console.log(`\n✅ PARSED METADATA FROM GEMINI:`);
    console.log('─'.repeat(50));
    console.log(`  Title:       ${metadata.title}`);
    console.log(`  Artist:      ${metadata.artist}`);
    console.log(`  Style:       ${metadata.style}`);
    console.log(`  Period:      ${metadata.period}`);
    console.log(`  Description: ${metadata.description}`);
    console.log(`  Confidence:  ${metadata.confidence}`);
    console.log('─'.repeat(50) + `\n`);
    
    // Ensure all required fields exist
    metadata = {
      title: metadata.title || 'Unknown Artwork',
      artist: metadata.artist || 'Unknown Artist',
      style: metadata.style || 'Contemporary',
      period: metadata.period || 'Modern',
      description: metadata.description || 'An artwork',
      confidence: metadata.confidence || 'medium',
    };

    console.log(`✅ Gemini Analysis Complete: ${metadata.title} by ${metadata.artist}`);
    console.log(`🎯 Confidence Level: ${metadata.confidence}\n`);
    return metadata;
  } catch (error) {
    console.error('❌ Gemini Image Analysis Error:', error.message);
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

/**
 * Search for artworks using Gemini-extracted metadata
 * Matches title, artist, or keywords
 * 
 * @param {Object} metadata - Metadata from Gemini { title, artist, style, description }
 * @param {Array} artworks - Array of artwork objects to search
 * @returns {Array} - Matching artworks sorted by relevance
 */
function findMatchingArtworks(metadata, artworks) {
  const { title, artist, style, description, confidence } = metadata;

  console.log(`\n📊 MATCHING ALGORITHM STARTED`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`Search Term: "${title}"`);
  console.log(`Artist: "${artist}"`);
  console.log(`Style: "${style}"`);
  console.log(`Confidence: ${confidence}`);
  console.log(`Total Artworks to Search: ${artworks.length}`);
  console.log(`${'─'.repeat(50)}\n`);

  // Create search terms
  const searchTerms = [
    title,
    artist,
    style,
    ...description.toLowerCase().split(' '),
  ].filter(term => term && term.length > 2);

  console.log(`🔑 Search Keywords: ${searchTerms.slice(0, 8).join(', ')}`);
  console.log(`   (${searchTerms.length} total keywords)\n`);

  // Score each artwork based on matches
  const scored = artworks.map(artwork => {
    let score = 0;

    const artworkTitle = artwork.title.toLowerCase();
    const artworkArtist = artwork.artist.toLowerCase();
    const artworkDescription = artwork.description.toLowerCase();
    const artworkPeriod = artwork.period.toLowerCase();

    // Exact title match (highest score)
    if (artworkTitle === title.toLowerCase()) {
      score += 100;
      console.log(`   ✅ EXACT TITLE MATCH: ${artwork.title} (+100)`);
    }
    // Title contains search term
    else if (artworkTitle.includes(title.toLowerCase())) {
      score += 50;
      console.log(`   📌 PARTIAL TITLE MATCH: ${artwork.title} (+50)`);
    }

    // Artist match
    if (artworkArtist === artist.toLowerCase()) {
      score += 80;
    }
    if (artworkArtist.includes(artist.toLowerCase())) {
      score += 40;
    }

    // Period/Style match
    if (artworkPeriod.includes(style.toLowerCase()) || artworkPeriod.includes(period?.toLowerCase() || '')) {
      score += 30;
    }

    // Keyword matches in description
    searchTerms.forEach(term => {
      if (artworkDescription.includes(term.toLowerCase())) {
        score += 10;
      }
      if (artworkTitle.includes(term.toLowerCase())) {
        score += 15;
      }
    });

    // Confidence multiplier
    const confidenceMultiplier = confidence === 'high' ? 1.5 : confidence === 'medium' ? 1.2 : 1;

    return {
      artwork,
      score: score * confidenceMultiplier,
    };
  });

  // Sort by score and return top matches
  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      ...item.artwork,
      matchScore: Math.round(item.score),
    }));

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📈 MATCHING COMPLETE`);
  console.log(`   Total Matches: ${results.length}`);
  console.log(`${'─'.repeat(50)}\n`);

  return results;
}

module.exports = {
  analyzeArtworkImage,
  findMatchingArtworks,
};
