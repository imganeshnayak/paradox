# 🎨 ArtVerse - Museum Companion Experience

[![Live Demo](https://img.shields.io/badge/Live%20Demo-artvers.netlify.app-brightgreen)](https://artvers.netlify.app)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Express.js-green)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ArtVerse** is a no-login, privacy-first museum companion web application that revolutionizes how visitors engage with art. Scan QR codes to discover artworks, enjoy AI-powered guides, view 3D models, and provide feedback—all while maintaining complete privacy and working seamlessly offline.

🌐 **Live Demo:** [artvers.netlify.app](https://artvers.netlify.app)

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features Deep Dive](#-features-deep-dive)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security & Privacy](#-security--privacy)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Key Features

### 🎯 Visitor Experience
- **🔍 QR Code Scanning** - Instant artwork discovery using device camera
- **🎨 Rich Media Content** - High-resolution images, 3D models, audio & video guides
- **🤖 AI-Powered Features** - Smart chatbot for artwork Q&A and multi-language translation
- **🌍 Multilingual Support** - English, Spanish (Español), French (Français)
- **📱 Progressive Web App (PWA)** - Works offline with Service Worker caching
- **🔒 Zero Login Required** - Anonymous sessions with privacy-first design
- **⚡ Real-time Reviews** - Like, review, and rate artworks instantly
- **🗺️ Interactive 3D Museum Map** - Navigate exhibitions with immersive 3D visualization

### 🛠️ Museum Administration
- **📊 Analytics Dashboard** - Real-time visitor engagement metrics
- **📈 Engagement Heatmaps** - Visual representation of artwork popularity
- **⏱️ Dwell Time Tracking** - Understand visitor behavior patterns
- **👥 Session Management** - Anonymous visitor tracking without PII
- **🎯 Content Management** - Upload and manage artwork metadata
- **📱 QR Code Generation** - Bulk generate and manage QR codes
- **🖼️ Media Management** - Upload 3D models, images, and videos via Cloudinary
- **💬 Feedback Analysis** - Collect and analyze visitor reviews

### 🔐 Privacy & Compliance
- **✅ GDPR Compliant** - Consent banner with granular controls
- **🔒 No Personal Data** - Anonymous sessions with auto-expiring data
- **⏰ Auto-Cleanup** - 24-hour sessions, 30-day analytics retention
- **🎛️ User Controls** - Opt-out options for analytics and tracking
- **🔐 Secure by Design** - JWT authentication for admins, encrypted communications

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19.2.0)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI (Headless components)
- **State Management:** React Hooks + Context API
- **PWA:** Service Workers + IndexedDB
- **QR Scanning:** qr-scanner library
- **3D Rendering:** Three.js
- **Charts:** Recharts
- **Deployment:** Netlify

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB 6.20.0
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **File Upload:** Multer 2.0.2
- **Media CDN:** Cloudinary 2.8.0
- **AI Integration:** Google Gemini API 0.24.1
- **QR Generation:** qrcode 1.5.3
- **Deployment:** Render

### External Services
- **Database Hosting:** MongoDB Atlas
- **Media Storage:** Cloudinary
- **Video Hosting:** Vimeo
- **AI Models:** Google Gemini, Hugging Face

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MUSEUM VISITOR                           │
│              (Smartphone / Tablet / Desktop)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js 16)                      │
│                                                             │
│  ├─ React Components (40+)                                 │
│  ├─ QR Scanner                                             │
│  ├─ 3D Viewer                                              │
│  ├─ AI Chatbot                                             │
│  ├─ Service Worker (Offline Support)                       │
│  ├─ Analytics Manager (Event Batching)                     │
│  └─ Session Provider (Anonymous Auth)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express + Node.js)                    │
│                                                             │
│  ├─ REST API Routes                                        │
│  ├─ Analytics Controller                                   │
│  ├─ Artwork Controller                                     │
│  ├─ AI Controller (Translation, Chat)                      │
│  ├─ Review Controller                                      │
│  ├─ Admin Controller                                       │
│  ├─ Session Validation Middleware                          │
│  └─ JWT Authentication                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│                                                             │
│  ├─ MongoDB Atlas (Database)                               │
│  │  ├─ artworks (metadata)                                 │
│  │  ├─ analytics (events, TTL: 30d)                        │
│  │  ├─ sessions (visitors, TTL: 24h)                       │
│  │  ├─ likes (engagement)                                  │
│  │  ├─ reviews (feedback)                                  │
│  │  └─ admins (users)                                      │
│  │                                                          │
│  ├─ Cloudinary (Media CDN)                                 │
│  │  ├─ 3D Models (.glb)                                    │
│  │  ├─ Images (artwork photos)                             │
│  │  └─ Videos (guides)                                     │
│  │                                                          │
│  └─ External APIs                                          │
│     ├─ Google Gemini (AI chat)                             │
│     ├─ Hugging Face (translation)                          │
│     └─ Vimeo (video embedding)                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas account)
- Cloudinary account (for media)
- Google Gemini API key (for AI features)
- Hugging Face API key (for translations)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/imganeshnayak/paradox.git
cd paradox
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=ArtVerse

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
ADMIN_PASSWORD=your_admin_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI Features
GEMINI_API_KEY=your_gemini_api_key

# Logging
LOG_LEVEL=info
```

Start backend server:
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

Backend will run at `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# AI Features
HUGGING_FACE_API_KEY=your_huggingface_api_key
```

Start frontend server:
```bash
npm run dev    # Development mode
# or
npm run build  # Build for production
npm start      # Run production build
```

Frontend will run at `http://localhost:3000`

#### 4. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This will populate MongoDB with sample artworks and data.

#### 5. Access the Application

- **Visitor App:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000/api

---

## 📁 Project Structure

```
paradox/
├── frontend/                    # Next.js frontend application
│   ├── app/                     # Next.js 16 app directory
│   │   ├── page.tsx             # Homepage with hero
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── explore/             # Artwork discovery page
│   │   ├── artwork/[id]/        # Artwork detail pages
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── page.tsx         # Analytics dashboard
│   │   │   ├── content/         # Content management
│   │   │   ├── qr-codes/        # QR code generation
│   │   │   ├── upload/          # Media upload
│   │   │   └── login/           # Admin login
│   │   └── museum-map/          # 3D interactive map
│   ├── components/              # React components
│   │   ├── hero.tsx             # Landing hero
│   │   ├── navbar.tsx           # Navigation
│   │   ├── qr-scanner.tsx       # QR code scanner
│   │   ├── consent-banner.tsx   # Privacy consent
│   │   ├── session-provider.tsx # Session management
│   │   ├── artwork-detail/      # Artwork display components
│   │   ├── admin/               # Admin components
│   │   └── ui/                  # Reusable UI components (30+)
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-guest-session.ts # Session management
│   │   ├── use-artwork.ts       # Artwork data fetching
│   │   ├── use-pwa.ts           # PWA offline support
│   │   ├── use-mobile.ts        # Mobile detection
│   │   └── use-toast.ts         # Toast notifications
│   ├── lib/                     # Core utilities
│   │   ├── session.ts           # Session generation
│   │   ├── analytics.ts         # Event tracking & batching
│   │   ├── artwork-data.ts      # Artwork types & samples
│   │   ├── api-client.ts        # HTTP client
│   │   ├── consent.ts           # Privacy management
│   │   └── utils.ts             # Helper functions
│   ├── public/                  # Static assets
│   │   └── sw.js                # Service Worker for offline
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── netlify.toml             # Netlify deployment config
│
├── backend/                     # Express.js backend application
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── adminController.js
│   │   │   ├── aiController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── artworkController.js
│   │   │   ├── reviewController.js
│   │   │   ├── sessionController.js
│   │   │   ├── imageController.js
│   │   │   └── translateController.js
│   │   ├── routes/              # API routes
│   │   │   ├── admin.js
│   │   │   ├── ai.js
│   │   │   ├── analytics.js
│   │   │   ├── artworks.js
│   │   │   ├── reviews.js
│   │   │   ├── sessions.js
│   │   │   ├── images.js
│   │   │   ├── translate.js
│   │   │   └── feedback.js
│   │   ├── middleware/          # Express middleware
│   │   │   ├── verifyJWT.js
│   │   │   ├── validateSession.js
│   │   │   └── multer.js
│   │   ├── utils/               # Utility functions
│   │   │   ├── qrGenerator.js
│   │   │   ├── geminiImageRecognition.js
│   │   │   └── seed.js
│   │   └── app.js               # Express app configuration
│   ├── server.js                # Entry point
│   ├── seed.js                  # Database seeding script
│   └── package.json
│
├── render.yaml                  # Render deployment config
├── README.md                    # This file
└── [Documentation Files]        # 37+ comprehensive guides
    ├── ARCHITECTURE.md
    ├── PROJECT_HANDOFF.md
    ├── QR_CODE_SYSTEM.md
    ├── AI_FEATURES_SETUP.md
    └── ... (see Documentation section)
```

---

## 🎯 Features Deep Dive

### 1. QR Code Navigation System

Visitors scan QR codes placed next to physical artworks to instantly access digital content.

**How it works:**
```
┌─────────────────┐
│   QR Code on    │
│   Gallery Wall  │
└─────────────────┘
        │
        ↓ (Visitor scans)
┌─────────────────┐
│  Camera Opens   │
│  in Browser     │
└─────────────────┘
        │
        ↓ (QR decoded)
┌─────────────────┐
│  Navigate to:   │
│  /artwork/123   │
└─────────────────┘
        │
        ↓
┌─────────────────┐
│  Full Artwork   │
│  Experience     │
└─────────────────┘
```

**QR Code Format:**
- Full URL: `https://artvers.netlify.app/artwork/starry-night`
- Direct ID: `artwork:starry-night`

### 2. Anonymous Session Management

No login required! Automatic anonymous sessions for privacy.

**Features:**
- 32-character secure session tokens
- 24-hour expiration with 30-minute inactivity timeout
- Automatic activity tracking (clicks, scrolls, keyboard)
- localStorage persistence across browser sessions
- Available via `useSession()` hook throughout app

### 3. Analytics & Engagement Tracking

Anonymous analytics that respect privacy while providing valuable insights.

**Event Types:**
- `artwork_view` - When visitor views an artwork
- `dwell_time` - Time spent on artwork page
- `audio_play` - Audio guide playback
- `video_play` - Video guide playback
- `like_added` / `like_removed` - Engagement actions
- `review_submitted` - Feedback submission
- `qr_scan` - QR code scans

**Batching System:**
- Events batched (10 events or 30 seconds)
- Efficient network usage
- Offline queue with sync when online
- Auto-cleanup after 30 days

### 4. AI-Powered Features

#### Multilingual Translation
- **Languages:** English, Spanish, French
- **Model:** Helsinki-NLP/opus-mt
- **Coverage:** Titles, descriptions, stories, artist info

#### AI Chatbot
- **Model:** Google Gemini
- **Context-Aware:** Uses artwork metadata for relevant answers
- **Sample Questions:**
  - "What techniques did the artist use?"
  - "What is the historical context?"
  - "What does this artwork symbolize?"

### 5. Progressive Web App (PWA)

Works offline with Service Worker caching strategy:

**Cache Strategy:**
- **Static Assets:** Cache-first (CSS, JS, fonts, icons)
- **Images:** Cache-first with network fallback
- **API Calls:** Network-first with cache fallback
- **HTML Pages:** Network-first

**Offline Features:**
- Browse cached artworks
- Queue analytics events
- Local session management
- Auto-sync when connection restored

### 6. 3D Interactive Museum Map

Navigate exhibitions with immersive 3D visualization:
- **Technology:** Three.js
- **Features:** Clickable artwork locations, floor navigation, zoom controls
- **Responsive:** Works on mobile and desktop

### 7. Admin Dashboard

Comprehensive analytics and management:

**Analytics:**
- Total visitors and sessions
- Top viewed artworks
- Average dwell time per artwork
- Engagement heatmaps
- Real-time metrics

**Content Management:**
- Upload artwork metadata
- Add 3D models, images, videos
- Generate QR codes in bulk
- Manage reviews and feedback

---

## 📡 API Documentation

### Base URLs

- **Production:** `https://paradox-wygi.onrender.com/api`
- **Development:** `http://localhost:5000/api`

### Authentication

Most endpoints are public (anonymous). Admin endpoints require JWT token:

```bash
# Login
POST /api/admin/login
Body: { password: "admin_password" }
Response: { token: "jwt_token" }

# Use token in headers
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Artworks

```bash
# Get all artworks
GET /api/artworks
Response: Array<Artwork>

# Get single artwork
GET /api/artworks/:id
Response: Artwork

# Search artworks
GET /api/artworks/search?query=...&location=...&period=...
Response: Array<Artwork>

# Create artwork (Admin only)
POST /api/artworks
Headers: Authorization: Bearer <token>
Body: ArtworkData
Response: Artwork

# Update artwork (Admin only)
PUT /api/artworks/:id
Headers: Authorization: Bearer <token>
Body: Partial<ArtworkData>
Response: Artwork
```

#### Reviews & Engagement

```bash
# Get artwork reviews
GET /api/reviews/:artworkId
Response: Array<Review>

# Submit review
POST /api/reviews/:artworkId/reviews
Body: { rating: 1-5, comment: "text", sessionId: "id" }
Response: Review

# Check like status
GET /api/reviews/:artworkId/like/check?sessionId=...
Response: { liked: boolean, totalLikes: number }

# Toggle like
POST /api/reviews/:artworkId/like
Body: { sessionId: "id" }
Response: { liked: boolean, totalLikes: number }
```

#### Analytics

```bash
# Submit events (batched)
POST /api/analytics/events
Headers: X-Session-Id, X-Anonymous-Id
Body: { events: Array<Event> }
Response: { received: number }

# Get analytics summary (Admin only)
GET /api/analytics/summary
Headers: Authorization: Bearer <token>
Response: AnalyticsSummary

# Get engagement heatmap (Admin only)
GET /api/analytics/heatmap
Headers: Authorization: Bearer <token>
Response: HeatmapData
```

#### AI Features

```bash
# Translate text
POST /api/ai/translate
Body: { text: "string", targetLanguage: "es" | "fr" }
Response: { translatedText: "string" }

# AI Chat
POST /api/ai/chat
Body: { question: "string", artwork: ArtworkObject }
Response: { answer: "string" }
```

#### Sessions

```bash
# Validate session
POST /api/sessions/validate
Body: { sessionId: "id" }
Response: { valid: boolean }

# Update preferences
POST /api/sessions/preferences
Body: { sessionId: "id", preferences: Object }
Response: { success: boolean }
```

#### QR Codes (Admin only)

```bash
# Generate QR code
POST /api/admin/qr-codes/generate
Headers: Authorization: Bearer <token>
Body: { artworkId: "id", format: "url" | "id" }
Response: { qrCodeUrl: "data:image/png;base64..." }

# Bulk generate QR codes
POST /api/admin/qr-codes/bulk
Headers: Authorization: Bearer <token>
Body: { artworkIds: Array<string> }
Response: Array<QRCodeData>
```

### Request/Response Examples

**Submit Analytics Event:**
```json
POST /api/analytics/events
Headers: {
  "X-Session-Id": "abc123...",
  "X-Anonymous-Id": "xyz789...",
  "Content-Type": "application/json"
}
Body: {
  "events": [
    {
      "eventType": "artwork_view",
      "artworkId": "starry-night",
      "timestamp": "2025-11-06T10:30:00Z",
      "metadata": {}
    },
    {
      "eventType": "dwell_time",
      "artworkId": "starry-night",
      "timestamp": "2025-11-06T10:32:00Z",
      "metadata": { "dwellTime": 120000 }
    }
  ]
}
Response: { "received": 2, "success": true }
```

**Submit Review:**
```json
POST /api/reviews/starry-night/reviews
Body: {
  "rating": 5,
  "comment": "Absolutely breathtaking! The colors are mesmerizing.",
  "sessionId": "abc123..."
}
Response: {
  "_id": "review123",
  "artworkId": "starry-night",
  "rating": 5,
  "comment": "Absolutely breathtaking!...",
  "timestamp": "2025-11-06T10:35:00Z"
}
```

---

## 🚢 Deployment

### Frontend Deployment (Netlify)

**Automatic Deployment:**
1. Connect GitHub repository to Netlify
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
3. Set environment variables in Netlify dashboard
4. Deploy!

**Manual Deployment:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Environment Variables:**
```env
NEXT_PUBLIC_BACKEND_URL=https://paradox-wygi.onrender.com
NEXT_PUBLIC_API_URL=https://paradox-wygi.onrender.com/api
HUGGING_FACE_API_KEY=hf_xxx...
```

### Backend Deployment (Render)

**Using render.yaml:**
1. Push code to GitHub
2. Connect repository to Render
3. Render reads `render.yaml` configuration
4. Set environment variables in Render dashboard
5. Deploy!

**Manual Deployment:**
```bash
cd backend
npm install
npm start
```

**Environment Variables:** (See Backend Setup section above)

### Database Setup (MongoDB Atlas)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Add to backend `.env` as `MONGODB_URI`

### Media Storage (Cloudinary)

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get API credentials from dashboard
3. Add to backend `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## 🔐 Security & Privacy

### Privacy-First Design

✅ **Zero Personal Data Collection**
- No names, emails, or phone numbers
- Anonymous session tokens only
- No cross-site tracking

✅ **GDPR Compliant**
- Consent banner on first visit
- Granular privacy controls
- Clear data retention policies
- Easy opt-out options

✅ **Auto-Expiring Data**
- Sessions expire after 24 hours
- Analytics deleted after 30 days
- No permanent user profiles

✅ **User Control**
- Opt-out of analytics
- Clear consent preferences
- Delete session anytime

### Security Measures

✅ **Secure Communications**
- HTTPS enforced in production
- Secure headers (CORS, CSP)
- JWT tokens for admin auth

✅ **Input Validation**
- Server-side validation (Joi)
- Sanitized user input
- XSS protection via React

✅ **Rate Limiting**
- API endpoint rate limits
- DDoS protection
- Cloudflare integration

✅ **Authentication**
- JWT tokens for admins
- Bcrypt password hashing
- Secure session tokens

---

## 📚 Documentation

This repository includes **37+ comprehensive documentation files** covering every aspect of the system:

### Quick Start Guides
- **QUICK_START_AI.md** - AI features setup (5 min)
- **QR_QUICK_START.md** - QR code system overview (5 min)
- **QUICK_REFERENCE.md** - Quick reference guide

### System Architecture
- **ARCHITECTURE.md** - Complete system architecture with diagrams
- **COMPLETE_SYSTEM_ARCHITECTURE.md** - Detailed architecture guide
- **PROJECT_HANDOFF.md** - Complete project overview

### Feature Documentation
- **QR_CODE_SYSTEM.md** - QR code implementation
- **AI_FEATURES_SETUP.md** - AI chatbot and translation setup
- **MUSEUM_MAP_3D_UPDATE.md** - 3D map implementation
- **TEXT_READER_FEATURE.md** - Text-to-speech feature

### Setup & Deployment
- **BACKEND_SETUP.md** - Backend architecture
- **BACKEND_INIT_GUIDE.md** - Step-by-step backend setup
- **ENV_SETUP_GUIDE.md** - Environment configuration
- **API_PROXY_SETUP.md** - API proxy configuration

### Security & Privacy
- **SECURITY_AUDIT.md** - Security audit report
- **SECURITY_STATUS.md** - Current security status
- **SECURITY_SETUP_COMPLETE.md** - Security implementation

### Testing & Verification
- **TESTING_AND_VERIFICATION.md** - Testing guide
- **VERIFICATION_REPORT.md** - QA verification report
- **ANALYTICS_VERIFICATION_GUIDE.md** - Analytics testing

### Admin & Operations
- **IMPLEMENTATION_CHECKLIST.md** - Deployment checklist
- **COMPLETION_SUMMARY.md** - Project completion status
- **WHATS_BEEN_DONE.md** - What has been accomplished

### Frontend Documentation
- **FRONTEND_COMPLETE.md** - Frontend implementation summary
- **frontend/MUSEUM_APP_README.md** - Museum app guide
- **frontend/README.md** - Frontend specific guide

### API Documentation
- **backend/API_TESTING.md** - API testing guide

### Reference
- **DOCUMENTATION_INDEX.md** - Complete documentation index
- **QUICK_REFERENCE_QR.md** - QR system quick reference

**Navigation:** Start with `DOCUMENTATION_INDEX.md` for a guided tour through all documentation.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

1. Check existing issues first
2. Use issue templates
3. Provide detailed reproduction steps
4. Include screenshots/logs if applicable

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (lint, build, test)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Keep changes focused and minimal

### Code Style

**Frontend (TypeScript/React):**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Consistent naming conventions (camelCase)

**Backend (JavaScript/Node.js):**
- Use async/await for asynchronous code
- Handle errors properly
- Validate all inputs
- Follow RESTful API conventions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Acknowledgments

**Project Lead:** [Ganesh Nayak](https://github.com/imganeshnayak)

**Special Thanks:**
- Museum curators and staff for valuable feedback
- Open source community for amazing tools and libraries
- All contributors who helped improve the project

---

## 📞 Support & Contact

- **Live Demo:** [artvers.netlify.app](https://artvers.netlify.app)
- **Issues:** [GitHub Issues](https://github.com/imganeshnayak/paradox/issues)
- **Repository:** [github.com/imganeshnayak/paradox](https://github.com/imganeshnayak/paradox)

---

## 🎯 Project Status

✅ **Production Ready**

- ✅ Frontend: Complete & Deployed
- ✅ Backend: Complete & Deployed
- ✅ Database: Configured & Running
- ✅ Documentation: Comprehensive (37+ guides)
- ✅ Testing: Verified & Passing
- ✅ Security: Audited & Compliant
- ✅ Performance: Optimized
- ✅ Mobile: Responsive & PWA

**Live at:** [artvers.netlify.app](https://artvers.netlify.app) 🚀

---

## 🗺️ Roadmap

### Planned Features
- [ ] More language support (German, Italian, Japanese)
- [ ] AR (Augmented Reality) artwork preview
- [ ] Social sharing features
- [ ] Virtual tours and guided experiences
- [ ] Advanced analytics with ML insights
- [ ] Native mobile apps (iOS/Android)
- [ ] Voice-guided navigation
- [ ] Gamification and achievement system

### Future Enhancements
- [ ] Image recognition for artwork identification
- [ ] Blockchain-based digital collectibles
- [ ] Integration with museum ticketing systems
- [ ] Accessibility improvements (screen readers, etc.)
- [ ] Multi-museum support with centralized platform

---

**Built with ❤️ for museums and art enthusiasts worldwide**

*Making art accessible, engaging, and privacy-respecting for everyone.*
