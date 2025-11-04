require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

exports.translate = async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).json({ error: 'Missing text or target language.' });
  }
  try {
    const prompt = `Translate the following text to ${target} (just the translation, no explanation):\n"""${text}"""`;
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const translated = result.text;
    res.json({ translated });
  } catch (err) {
    console.error('Gemini AI translate error:', err);
    res.status(500).json({ error: 'Failed to translate text.' });
  }
};
