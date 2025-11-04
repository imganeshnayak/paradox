/**
 * Gemini Image Recognition Utility
 * Uses OpenRouter (primary) and Gemini (fallback) for artwork image analysis
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || 'meta-llama/llava-1.5-7b-hf';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Analyze artwork image using OpenRouter or Gemini
 * Extracts: title, artist, style, period, description
 * 
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<Object>} - Artwork metadata { title, artist, style, period, description }
 */
async function analyzeArtworkImage(base64Image) {
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

  let metadata = null;
  let usedProvider = 'unknown';

  // Try OpenRouter first (primary provider for vision)
  if (OPENROUTER_API_KEY) {
    try {
      console.log('🔄 Attempting image analysis via OpenRouter...');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paradox-wygi.onrender.com',
          'X-Title': 'Museum Image Recognition',
        },
        body: JSON.stringify({
          model: OPENROUTER_VISION_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const responseText = result?.choices?.[0]?.message?.content?.trim() || null;
        
        if (responseText) {
          console.log(`\n📝 RAW OPENROUTER RESPONSE:\n${responseText}\n`);
          
          // Extract JSON from markdown code blocks if present
          let jsonText = responseText;
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1].trim();
          }
          
          metadata = JSON.parse(jsonText);
          usedProvider = 'openrouter';
          console.log('✅ Image analysis via OpenRouter successful');
        }
      } else {
        const errorText = await response.text();
        console.warn('OpenRouter vision API error:', response.statusText, errorText);
      }
    } catch (openRouterError) {
      console.warn('OpenRouter image analysis failed, trying Gemini...', openRouterError.message);
    }
  }

  // Fallback to Gemini if OpenRouter fails or not configured
  if (!metadata && genAI && GEMINI_API_KEY) {
    try {
      console.log('🔄 Attempting image analysis via Gemini (fallback)...');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const responseText = response.text();
      
      console.log(`\n📝 RAW GEMINI RESPONSE:\n${responseText}\n`);
      
      // Extract JSON from markdown code blocks if present
      let jsonText = responseText;
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }
      
      metadata = JSON.parse(jsonText);
      usedProvider = 'gemini';
      console.log('✅ Image analysis via Gemini successful');
    } catch (geminiError) {
      console.error('❌ Gemini Image Analysis Error:', geminiError.message);
      throw new Error(`Image analysis failed: ${geminiError.message}`);
    }
  }

  if (!metadata) {
    throw new Error('No image analysis provider available (OpenRouter and Gemini both failed or not configured)');
  }

  console.log(`\n✅ PARSED METADATA FROM ${usedProvider.toUpperCase()}:`);
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

  console.log(`✅ Analysis Complete (${usedProvider}): ${metadata.title} by ${metadata.artist}`);
  console.log(`🎯 Confidence Level: ${metadata.confidence}\n`);
  return metadata;
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

    const artworkTitle = (artwork.title || '').toLowerCase();
    const artworkArtist = (artwork.artist || '').toLowerCase();
    const artworkDescription = (artwork.description || '').toLowerCase();
    const artworkPeriod = (artwork.period || '').toLowerCase();

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
