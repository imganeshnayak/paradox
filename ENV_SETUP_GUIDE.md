# 🔐 Environment Variables - Quick Setup Guide

## Local Development Setup

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ArtVerse
DATABASE_NAME=ArtVerse

# Cloudinary (Image/Model storage)
CLOUDINARY_CLOUD_NAME=dahotkqpi
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# JWT (Authentication)
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Admin
ADMIN_PASSWORD=your_admin_password

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```bash
# Open Router API (AI Chat)
OPEN_ROUTER_API_KEY=your_key_here
OPEN_ROUTER_MODEL=openai/gpt-3.5-turbo

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Translation Models (Optional)
# TRANSLATION_MODEL_ES=Helsinki-NLP/opus-mt-en-es
# TRANSLATION_MODEL_FR=Helsinki-NLP/opus-mt-en-fr
```

## Getting API Keys

### Cloudinary
1. Sign up at https://cloudinary.com
2. Go to Dashboard → Settings → API Keys
3. Copy API Key and API Secret

### Open Router
1. Sign up at https://openrouter.ai
2. Go to Keys → Create New API Key
3. Copy the API key (starts with `sk-or-v1-`)

### Hugging Face (Optional)
1. Sign up at https://huggingface.co
2. Go to Settings → Access Tokens → New Token
3. Create Read token and copy

## Security Rules

✅ **DO:**
- Keep `.env` in `.gitignore` (already done)
- Use `.env.example` as template
- Rotate keys regularly
- Use environment-specific secrets for production

❌ **DON'T:**
- Commit `.env` files to git
- Share API keys in messages/emails
- Use same keys for dev and production
- Hardcode secrets in source code

## Verification

Check that files are protected:

```bash
# Show ignored files (should include .env)
cat .gitignore | grep ".env"

# Verify not in git
git ls-files | grep -v ".example"
```

## Production Deployment

For Vercel/Railway/Heroku:
1. Add environment variables in dashboard
2. Use same variable names as local `.env`
3. Values automatically injected at runtime

## Team Setup

1. New developer clones repository
2. Copies `.env.example` to `.env`
3. Fills in their own API keys
4. `.gitignore` prevents accidental commits

---

✅ **All API keys are now secured!**
