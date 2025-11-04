require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

exports.chat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body.' });
  }

  let reply = null;
  let usedProvider = 'unknown';

  // Try OpenRouter first (primary provider)
  if (OPENROUTER_API_KEY) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paradox-wygi.onrender.com',
          'X-Title': 'Museum AI Chatbot',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        reply = result?.choices?.[0]?.message?.content?.trim() || null;
        if (reply) {
          usedProvider = 'openrouter';
          console.log('✅ Chat response from OpenRouter');
          return res.json({ reply });
        }
      } else {
        const errorText = await response.text();
        console.warn('OpenRouter API error:', response.statusText, errorText);
      }
    } catch (openRouterError) {
      console.warn('OpenRouter connection failed, trying Gemini...', openRouterError);
    }
  }

  // Fallback to Gemini if OpenRouter fails
  if (!reply && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(message);
      const response = await result.response;
      reply = response.text();
      usedProvider = 'gemini';
      console.log('✅ Chat response from Gemini (fallback)');
      return res.json({ reply });
    } catch (geminiError) {
      console.error('Gemini AI chat error:', geminiError);
    }
  }

  // If both providers fail
  res.status(500).json({ error: 'Failed to get AI response from any provider.' });
};
