// Script to list available Gemini models and test content generation
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Use your Gemini API key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
  try {
    // List available models
    const result = await ai.models.list();
    console.log('Raw result from ai.models.list():');
    console.dir(result, { depth: 10 });
    // Uncomment below after inspecting structure:
    // const { models } = result;
    // if (Array.isArray(models)) {
    //   for (const model of models) {
    //     console.log(`- ${model.name} (methods: ${model.supportedMethods?.join(', ')})`);
    //   }
    // }

    // Try generating content with a likely available model
    const modelName = 'gemini-2.5-flash'; // Update if needed
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Explain how AI works in a few words',
    });
    console.log(`\n${modelName} response:`, response.text);
  } catch (err) {
    console.error('Gemini API test error:', err);
  }
}

main();