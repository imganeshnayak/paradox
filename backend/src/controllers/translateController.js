require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

exports.translate = async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).json({ error: 'Missing text or target language.' });
  }

  let translated = null;
  let usedProvider = 'unknown';

  // Try OpenRouter first (primary provider)
  if (OPENROUTER_API_KEY) {
    try {
      const translationPrompt = `Translate the following text to ${target === 'es' ? 'Spanish' : target === 'fr' ? 'French' : target}. Only provide the translation, nothing else:\n\n${text}`;
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paradox-wygi.onrender.com',
          'X-Title': 'Museum Translation',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: 'user', content: translationPrompt }],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        translated = result?.choices?.[0]?.message?.content?.trim() || null;
        if (translated) {
          usedProvider = 'openrouter';
          console.log(`✅ Translation via OpenRouter: ${target}`);
          return res.json({ translated });
        }
      } else {
        const errorText = await response.text();
        console.warn('OpenRouter API error:', response.statusText, errorText);
      }
    } catch (openRouterError) {
      console.warn('OpenRouter translation failed, trying Gemini...', openRouterError);
    }
  }

  // Fallback to Gemini if OpenRouter fails
  if (!translated && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Translate the following text to ${target} (just the translation, no explanation):\n"""${text}"""`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      translated = response.text();
      usedProvider = 'gemini';
      console.log(`✅ Translation via Gemini (fallback): ${target}`);
      return res.json({ translated });
    } catch (geminiError) {
      console.error('Gemini AI translate error:', geminiError);
    }
  }

  // If both providers fail
  res.status(500).json({ error: 'Failed to translate text from any provider.' });
};
