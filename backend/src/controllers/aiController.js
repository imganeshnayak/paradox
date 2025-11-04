require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

exports.chat = async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body.' });
  }
  try {
    // Use the Gemini 2.5 Flash model for content generation
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });
    // The SDK returns the text directly
    res.json({ reply: result.text });
  } catch (err) {
    console.error('Gemini AI chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};
