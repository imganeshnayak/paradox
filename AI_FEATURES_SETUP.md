# AI Features Setup Guide

This document explains how to set up the AI-powered features (translation and chatbot) for the Museum Experience app.

## Features

### 1. Language Translation
- **Supported Languages**: English, Spanish (Español), French (Français)
- **Model**: Helsinki-NLP/opus-mt models
  - `Helsinki-NLP/opus-mt-en-es` - English to Spanish
  - `Helsinki-NLP/opus-mt-en-fr` - English to French

### 2. AI Chatbot
- **Model**: Google FLAN-T5-base
- **Purpose**: Answer artwork-specific questions
- **Context-Aware**: Uses artwork details to provide relevant answers

## Setup Instructions

### Step 1: Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permission
5. Copy the token

### Step 2: Configure Environment Variables

#### Frontend (.env.local)

Create or update `frontend/.env.local`:

```env
HUGGING_FACE_API_KEY=hf_your_api_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Step 3: Test the Features

1. Start the backend:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Navigate to any artwork page (e.g., `http://localhost:3000/artwork/[id]`)

4. Test Translation:
   - Click the language selector button (top right)
   - Select Spanish or French
   - Watch the title, description, and story translate

5. Test Chatbot:
   - Click the chat bubble icon (bottom right)
   - Ask questions about the artwork:
     - "What techniques did the artist use?"
     - "What is the historical context?"
     - "What does this artwork symbolize?"

## API Endpoints

### Translation API
- **Endpoint**: `POST /api/translate`
- **Request Body**:
```json
{
  "text": "The text to translate",
  "targetLanguage": "es" // or "fr"
}
```
- **Response**:
```json
{
  "translatedText": "El texto traducido",
  "originalText": "The text to translate",
  "targetLanguage": "es"
}
```

### AI Chat API
- **Endpoint**: `POST /api/ai-chat`
- **Request Body**:
```json
{
  "question": "What techniques did the artist use?",
  "artwork": {
    "title": "The Starry Night",
    "artist": "Vincent van Gogh",
    "year": 1889,
    "description": "...",
    "story": "...",
    "medium": "Oil on canvas",
    "period": "Post-Impressionism"
  },
  "language": "en" // or "es", "fr"
}
```
- **Response**:
```json
{
  "answer": "Vincent van Gogh used thick brushstrokes...",
  "question": "What techniques did the artist use?",
  "language": "en"
}
```

## Hugging Face Models Used

### Helsinki-NLP Translation Models
- **Purpose**: High-quality neural machine translation
- **Advantages**:
  - Free to use
  - Good accuracy for major languages
  - Optimized for speed
- **Rate Limit**: 1000 requests/hour (free tier)

### Google FLAN-T5-base
- **Purpose**: Text generation and Q&A
- **Advantages**:
  - Context-aware responses
  - Fine-tuned for instruction following
  - Good for educational content
- **Rate Limit**: 1000 requests/hour (free tier)

## Alternative Models (Optional)

If you experience rate limiting or want better performance:

### For Translation:
1. **Google Cloud Translation API** (paid, higher quality)
2. **DeepL API** (paid, best quality)
3. **LibreTranslate** (free, self-hosted)

### For Chatbot:
1. **OpenAI GPT-3.5/4** (paid, best quality)
2. **Anthropic Claude** (paid, good quality)
3. **facebook/blenderbot-400M-distill** (free, conversational)

## Troubleshooting

### Translation not working:
1. Check Hugging Face API key is valid
2. Check internet connection
3. Check browser console for errors
4. Verify environment variable is set correctly

### Chatbot not responding:
1. Verify Hugging Face API key
2. Check if model is loading (first request may take 20-30 seconds)
3. Check network tab for API errors
4. Try refreshing the page

### Rate Limiting:
- Hugging Face free tier: 1000 requests/hour
- Solution: Implement caching (already included)
- Or upgrade to Hugging Face Pro ($9/month)

## Performance Tips

1. **Translation Caching**: Translations are cached in memory to reduce API calls
2. **Model Warm-up**: First request may be slow (model loading)
3. **Batch Requests**: Multiple translations are done in parallel
4. **Fallback Responses**: If API fails, original text is shown

## Security Notes

1. **API Key Protection**: 
   - Never commit `.env.local` to Git
   - Add to `.gitignore`
   - Use environment variables on deployment

2. **Rate Limiting**:
   - Implement request throttling if needed
   - Monitor API usage

3. **Content Validation**:
   - User inputs are sanitized
   - API responses are validated

## Cost Estimation

### Free Tier (Hugging Face):
- **Translation**: ~1000 requests/hour
- **Chatbot**: ~1000 requests/hour
- **Cost**: $0/month
- **Best for**: Testing, small museums

### Paid Options:
- **Hugging Face Pro**: $9/month (higher limits)
- **OpenAI GPT-3.5**: ~$0.002/1K tokens
- **Google Translate**: $20/1M characters

## Future Enhancements

1. Add more languages (German, Italian, Japanese, etc.)
2. Voice input/output for accessibility
3. Offline translation support
4. Better context retention in chatbot
5. Image analysis capabilities
6. Multi-turn conversations with memory
