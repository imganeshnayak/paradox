const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load Gemini API key from env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

exports.chat = async (req, res) => {
  if (!genAI) {
    return res.status(500).json({ error: 'Gemini API key not configured.' });
  }
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body.' });
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini AI chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};
