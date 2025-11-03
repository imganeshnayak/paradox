# 🚀 Quick Start: AI Features

## Get Your Artwork Talking in Minutes!

### Step 1: Get Your Free API Key (2 minutes)

1. Go to https://huggingface.co/
2. Click "Sign Up" (or "Log In" if you have an account)
3. After logging in, go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Name it: "Museum App"
6. Select permission: "Read"
7. Click "Generate"
8. **Copy the token** (starts with `hf_...`)

### Step 2: Add API Key to Your Project (1 minute)

1. Open your project folder: `paradox/frontend`
2. Create a new file called `.env.local` (if it doesn't exist)
3. Add this line (replace with your actual key):

```env
HUGGING_FACE_API_KEY=hf_your_actual_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

4. Save the file

### Step 3: Start Your Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Test It Out! (1 minute)

1. Open your browser: http://localhost:3000
2. Click "Explore" and select any artwork
3. **Test Translation:**
   - Look for language selector (top right) 
   - Click it and select "Español" or "Français"
   - Watch the content translate! ✨

4. **Test Chatbot:**
   - Look for chat bubble icon (bottom right)
   - Click it to open chat
   - Ask: "What techniques did the artist use?"
   - Get AI response! 🤖

## ✅ You're Done!

That's it! Your museum app now has AI-powered translations and a smart chatbot.

## 🎯 Try These Questions:

- "What is the historical context of this artwork?"
- "What techniques did the artist use?"
- "What does this artwork symbolize?"
- "Why is this artwork important?"
- "Tell me more about the artist"

## 🌍 Try These Languages:

- 🇬🇧 English (default)
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)

## 🐛 Having Issues?

### Translation not working?
✓ Check your API key is correct in `.env.local`
✓ Restart the frontend server (`npm run dev`)
✓ Check browser console for errors

### Chatbot not responding?
✓ First request takes 20-30 seconds (model loading)
✓ Check internet connection
✓ Verify API key is set

### Still stuck?
Check the full documentation: `AI_FEATURES_SETUP.md`

## 📊 Usage Limits (Free Tier)

- 1000 translation requests per hour
- 1000 chatbot requests per hour
- **Plenty for testing and small museums!**

Need more? Upgrade to Hugging Face Pro ($9/month) for unlimited requests.

---

**Enjoy your AI-powered museum experience! 🎨✨**
