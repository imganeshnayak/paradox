# Quick Reference Guide - ArtVerse Project

## 🎯 What is ArtVerse?

A museum companion app where visitors:
1. Scan QR codes to discover artworks
2. Get audio guides and 3D model views
3. Museum gets anonymous engagement analytics
4. Works offline when needed
5. No personal data collected

## 📁 Where's What?

```
paradox/
├── frontend/          ← Main app (Next.js + React)
│   ├── app/          ← Pages and API routes
│   ├── components/   ← React UI components
│   ├── hooks/        ← Custom logic (sessions, artworks)
│   ├── lib/          ← Core services (analytics, consent)
│   └── public/       ← Service Worker for offline
├── backend/          ← Coming next! (Express + MongoDB)
├── FRONTEND_COMPLETE.md     ← Frontend summary
├── BACKEND_SETUP.md         ← Backend architecture
├── BACKEND_INIT_GUIDE.md    ← Backend setup steps
└── PROJECT_HANDOFF.md       ← Complete overview
```

## 🏃 Quick Start

### Frontend (Already Working!)
```powershell
cd c:\Users\User\Desktop\paradox\frontend
npm install
npm run dev
# Opens http://localhost:3000
```

### Backend (Next Step)
```powershell
cd c:\Users\User\Desktop\paradox\backend
# Follow BACKEND_INIT_GUIDE.md for setup
npm install
npm run dev
# Runs on http://localhost:5000
```

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: localStorage + IndexedDB
- **Offline**: Service Worker
- **QR Scanning**: jsQR library

### Backend (To Build)
- **Framework**: Express.js
- **Database**: MongoDB
- **File Storage**: Cloudinary (3D models)
- **Admin Auth**: JWT tokens
- **Validation**: Joi

## 🎨 Key Features

### ✅ Already Built
- Anonymous sessions (no login)
- QR code scanning
- Artwork discovery
- Analytics tracking
- Offline support (Service Worker)
- Privacy consent banner
- Responsive mobile design

### 🔄 Next to Build
- Backend API endpoints
- MongoDB data storage
- Cloudinary 3D hosting
- Admin dashboard
- Audio guide player

## 📊 Data Flow

```
User scans QR code
        ↓
Frontend recognizes artwork ID
        ↓
Frontend requests /api/artworks/[id]
        ↓
Backend queries MongoDB
        ↓
Returns artwork data + Cloudinary 3D URL
        ↓
Frontend displays with video/audio
        ↓
Frontend tracks engagement analytics
        ↓
Batches 10 events and sends to backend
        ↓
Backend stores in MongoDB
        ↓
Admin dashboard shows engagement heatmap
```

## 🔌 API Integration Points

### Frontend Calls Backend

**1. Get Artwork**
```javascript
GET /api/artworks/[artworkId]
Response: {
  title, artist, description,
  image: { url },
  model3D: { url },  // Cloudinary
  audioGuide: { url, transcription }
}
```

**2. Submit Analytics**
```javascript
POST /api/analytics/events
Body: {
  events: [
    { eventType: 'artwork_view', artworkId: '123', dwellTime: 45000 },
    { eventType: 'audio_play', artworkId: '123' }
  ]
}
```

**3. Validate Session**
```javascript
POST /api/sessions/validate
Headers: X-Session-Id, X-Anonymous-Id
Response: { valid: true, expiresAt: date }
```

## 📝 File Organization

### Frontend - By Feature

**Sessions & Auth**
- `lib/session.ts` - Generate/manage sessions
- `hooks/use-guest-session.ts` - Session lifecycle hook
- `components/session-provider.tsx` - Context wrapper

**Analytics**
- `lib/analytics.ts` - Event tracking manager
- `app/api/analytics/events/route.ts` - Analytics endpoint
- `hooks/use-pwa.ts` - Sync analytics when online

**Content**
- `lib/artwork-data.ts` - Artwork types and samples
- `hooks/use-artwork.ts` - Fetch artwork data
- `app/api/artworks/[id]/route.ts` - Artwork endpoint
- `app/api/artworks/search/route.ts` - Search endpoint

**Privacy**
- `lib/consent.ts` - Consent preferences
- `components/consent-banner.tsx` - Consent UI

**Offline**
- `public/sw.js` - Service Worker
- `hooks/use-pwa.ts` - PWA utilities

## 🎮 Common Tasks

### Add a New Artwork
1. Add to `lib/artwork-data.ts`
2. Upload 3D model to Cloudinary
3. Update artwork metadata with Cloudinary URL
4. Frontend automatically displays it

### Track New Event Type
1. Add event type to analytics.ts
2. Call `analyticsManager.trackEvent()`
3. Backend receives in POST /api/analytics/events

### Fix Session Issues
1. Check localStorage: `museum_guest_session`
2. Check if token expired (24 hours)
3. Check inactivity (30 minutes resets)
4. Manual reset: Clear localStorage

### Deploy Frontend
```powershell
npm run build    # Creates optimized build
npm start        # Runs production build
# Or deploy to Vercel
```

## 🐛 Debugging Tips

### Check Session in Console
```javascript
localStorage.getItem('museum_guest_session')
// Shows: { sessionId, anonymousId, createdAt, etc }
```

### View Analytics Events Queued
```javascript
// Check browser's IndexedDB
// Open DevTools → Application → IndexedDB → museum_app_db
```

### Monitor Service Worker
```javascript
// DevTools → Application → Service Workers
// Should show "Active" status
```

### Test QR Scanner
```javascript
// Use any QR code generator
// Format: artwork:[artworkId]
// Example: artwork:starry-night
```

### View Network Requests
```javascript
// DevTools → Network tab
// Filter by "analytics" to see tracking
// Filter by "artworks" to see content requests
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## 🔐 Privacy by Design

### What's Collected
- Anonymous session ID
- Artwork viewing events
- Time spent on artworks
- Device type and browser
- Consent preferences

### What's NOT Collected
- ❌ Name, email, or ID
- ❌ IP address
- ❌ Exact location
- ❌ Biometric data
- ❌ Cookies

### Auto-Deletion
- Sessions: 24 hours
- Analytics: 30 days
- User can opt-out anytime

## 🎯 Current System Status (November 3, 2025)

### ✅ COMPLETE & OPERATIONAL
```
Backend:           Running on localhost:5000     ✅
Frontend:          Running on localhost:3000     ✅
Database:          MongoDB Connected             ✅
Like System:       Ready & tested               ✅
Review System:     Ready & tested               ✅
Analytics:         0 events (no interactions)    ✅
Admin Dashboard:   Displaying metrics            ✅
Documentation:     Complete                      ✅
```

### � Anonymous Engagement System (NEW!)
- Session ID generation & persistence
- Like system with duplicate prevention
- Review system with ratings (1-5)
- Analytics event recording
- Admin dashboard aggregation
- Real-time metrics

### 🧪 What's Working
- All 4 like/review endpoints responding
- Session IDs generating and persisting
- Analytics events recording correctly
- Dashboard aggregation working
- Debug endpoints for troubleshooting

### 📈 Next: Test & Populate Analytics
See TESTING_AND_VERIFICATION.md for complete testing guide

---

## �📚 Documentation Files

| File | Purpose |
|------|---------|
| FRONTEND_COMPLETE.md | Full frontend overview |
| BACKEND_SETUP.md | Backend architecture specs |
| BACKEND_INIT_GUIDE.md | Step-by-step backend setup |
| PROJECT_HANDOFF.md | Complete project guide |
| SESSION_SUMMARY.md | Latest session changes |
| ANALYTICS_VERIFICATION_GUIDE.md | Analytics system details |
| COMPLETE_SYSTEM_ARCHITECTURE.md | Full architecture & integration |
| TESTING_AND_VERIFICATION.md | Testing & troubleshooting guide |
| QUICK_REFERENCE.md | This file - quick reference |

## 💡 Pro Tips

### Faster Development
```powershell
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: View logs/debug
npm run dev -- --verbose
```

### Testing Integration
1. Frontend scans QR code
2. Opens DevTools → Network
3. Should see POST to /api/analytics/events
4. Check MongoDB to confirm data stored

### Offline Testing
1. Open DevTools → Network
2. Set to "Offline" mode
3. Page should still load
4. QR scanner should still work
5. Events queue locally
6. When online, auto-sync

## 🚀 Next Phase - Backend

### Step 1: Initialize (5 min)
```powershell
cd backend
npm init -y
npm install express mongodb dotenv cors morgan joi cloudinary multer
```

### Step 2: Create Structure (10 min)
```powershell
mkdir src
mkdir src/config src/controllers src/models src/routes src/middleware src/utils
```

### Step 3: Setup Config (15 min)
- Copy .env.example → .env
- Fill in MongoDB URI
- Add Cloudinary credentials
- Set JWT secret

### Step 4: Test Connection (5 min)
```powershell
npm run dev
# Should show "MongoDB connected"
```

### Step 5: Build Routes (Ongoing)
- Analytics collection
- Artwork management
- Session validation
- Admin dashboard

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| QR scanner not working | Check camera permissions in browser |
| Consent banner not showing | Clear localStorage and refresh |
| Service Worker offline fails | Check that localhost is available |
| MongoDB connection error | Verify connection string and IP whitelist |
| Cloudinary upload fails | Check API credentials in .env |
| CORS error | Update FRONTEND_URL in backend .env |

## 🎓 Key Concepts

### Anonymous Sessions
- Secure token generated on first visit
- Stored in localStorage
- Sent with every request (X-Session-Id header)
- Expires after 24 hours
- Updated on every activity

### Event Batching
- Events collected locally
- After 10 events OR 30 seconds
- Sent as single POST request
- Reduces server load
- Auto-syncs when online

### Service Worker Caching
- **Cache-First**: CSS, JS, images (fast offline)
- **Network-First**: API calls (fresh data when online)
- **Offline Fallback**: Works without internet

### Consent Management
- Banner shows once per browser
- Stored in localStorage
- 1-year expiry
- Can change anytime in footer
- GDPR compliant

## 📈 Success Metrics

### Frontend Checklist
- [x] Sessions persist across page reloads
- [x] QR scanning identifies artworks
- [x] Analytics events batch correctly
- [x] Service Worker caches content
- [x] Consent banner displays once
- [x] Offline mode works
- [x] Mobile layout responsive
- [x] No console errors

### Backend Checklist (Coming)
- [ ] MongoDB indexes created
- [ ] Analytics endpoint stores events
- [ ] Artwork API returns metadata
- [ ] Session validation works
- [ ] Cloudinary upload succeeds
- [ ] Admin dashboard calculates stats
- [ ] TTL auto-deletion works
- [ ] No errors in logs

---

**Ready to build the backend?** Follow BACKEND_INIT_GUIDE.md!

**Have questions?** Check BACKEND_SETUP.md for architecture details.

**Need full overview?** Read PROJECT_HANDOFF.md.

**Want frontend details?** See FRONTEND_COMPLETE.md.
