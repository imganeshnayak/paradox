const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

exports.translate = async (req, res) => {
  if (!genAI) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).json({ error: 'Missing text or target language.' });
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Translate the following text to ${target} (just the translation, no explanation):\n"""${text}"""`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = response.text();
    res.json({ translated });
  } catch (err) {
    console.error('Gemini AI translate error:', err);
    res.status(500).json({ error: 'Failed to translate text.' });
  }
};
