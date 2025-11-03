# ArtVerse Architecture Diagram & System Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MUSEUM VISITOR                              │
│                    (Smartphone/Tablet/Desktop)                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    React Components                          │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────────┐  │  │
│  │  │ QR Scanner │ │Search Bar  │ │ Artwork Detail View    │  │  │
│  │  │            │ │            │ │ • 3D Viewer           │  │  │
│  │  │ • Camera   │ │• Filters   │ │ • Audio Guide         │  │  │
│  │  │• Detection │ │• Matching  │ │ • Video Guide         │  │  │
│  │  └────────────┘ └────────────┘ │ • Recommendations    │  │  │
│  │                                 └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          Core Services Layer (Hooks & Utilities)            │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │   Sessions   │  │  Analytics   │  │   Consent/      │  │  │
│  │  │              │  │              │  │   Privacy       │  │  │
│  │  │ • Generate   │  │ • Track      │  │ • Preferences   │  │  │
│  │  │ • Validate   │  │ • Batch      │  │ • Banner        │  │  │
│  │  │ • Persist    │  │ • Sync       │  │ • Opt-out       │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │        Offline/PWA Support                          │  │  │
│  │  │ • Service Worker caching                            │  │  │
│  │  │ • IndexedDB persistence                             │  │  │
│  │  │ • Background sync for analytics                     │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Data Layer (Client-Side Storage)               │  │
│  │                                                              │  │
│  │  localStorage          IndexedDB           Service Worker   │  │
│  │  ┌────────────┐       ┌──────────────┐    ┌──────────────┐ │  │
│  │  │ Session    │       │ Offline      │    │ Cache        │ │  │
│  │  │ Consent    │       │ Artworks     │    │ • Assets     │ │  │
│  │  │ Prefs      │       │ Analytics    │    │ • Responses  │ │  │
│  │  │ User Data  │       │ Events       │    │ • Media      │ │  │
│  │  └────────────┘       └──────────────┘    └──────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                     (HTTPS/Secure WebSocket)
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + Node.js)                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              API Routes & Controllers                        │  │
│  │                                                              │  │
│  │  POST /api/analytics/events    ← Receives batched events   │  │
│  │  GET /api/artworks/[id]        ← Returns artwork metadata  │  │
│  │  GET /api/artworks/search      ← Search and filter         │  │
│  │  POST /api/sessions/validate   ← Verify session            │  │
│  │  GET /api/admin/dashboard      ← Analytics dashboard       │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Business Logic Layer (Controllers)                  │  │
│  │                                                              │  │
│  │  Analytics Controller    Artwork Controller                 │  │
│  │  • Process events        • Fetch metadata                   │  │
│  │  • Calculate metrics     • Search/filter                    │  │
│  │  • Generate reports      • Manage content                   │  │
│  │                                                              │  │
│  │  Session Controller      Admin Controller                   │  │
│  │  • Validate sessions     • Authentication                   │  │
│  │  • Check expiry          • Dashboard data                   │  │
│  │  • Update activity       • Content management               │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Middleware Layer                                     │  │
│  │                                                              │  │
│  │  • CORS Configuration     • Request Validation              │  │
│  │  • Session Verification   • Error Handling                  │  │
│  │  • JWT Authentication     • Logging                         │  │
│  │  • Rate Limiting          • Data Sanitization               │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                      │
│                                                                      │
│  ┌────────────────────────┐      ┌──────────────────────────────┐  │
│  │   MongoDB Database     │      │   Cloudinary (3D Models)    │  │
│  │                        │      │                              │  │
│  │ Collections:           │      │ Features:                    │  │
│  │ • Analytics Events     │      │ • 3D Model Storage           │  │
│  │ • Artworks Metadata    │      │ • Image Optimization         │  │
│  │ • Sessions             │      │ • Video Hosting              │  │
│  │ • Admin Users          │      │ • Audio Files                │  │
│  │                        │      │                              │  │
│  │ TTL Indexes:           │      │ CDN Distribution             │  │
│  │ • Sessions: 24h        │      │ • Global edge servers        │  │
│  │ • Analytics: 30d       │      │ • Fast delivery              │  │
│  └────────────────────────┘      └──────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────┐      ┌──────────────────────────────┐  │
│  │   Vimeo (Video CDN)    │      │   Google Vision (Future)     │  │
│  │                        │      │                              │  │
│  │ • Hero video           │      │ • Image recognition          │  │
│  │ • Background stream    │      │ • AI identification          │  │
│  │ • Analytics tracking   │      │ • Enhanced discovery         │  │
│  └────────────────────────┘      └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Discovery Flow

```
START
  ↓
[App Launches]
  ↓
[Session Generated]
  ├→ localStorage.setItem('museum_guest_session')
  ├→ Generates 32-char token
  └→ Session ID + Anonymous ID created
  ↓
[Display Home Page]
  ├→ Hero with Vimeo video
  ├→ Search bar
  └→ Featured artworks
  ↓
[User Scans QR Code]
  ├→ Opens QR Scanner component
  ├→ Camera permission requested
  ├→ Detects QR code in real-time
  └→ Extracts artwork ID
  ↓
[Navigate to Artwork]
  ├→ Route: /artwork/[id]
  ├→ Fetch metadata: GET /api/artworks/[id]
  └→ Load 3D model, audio, video
  ↓
[Display Artwork Detail]
  ├→ 3D Viewer (Cloudinary)
  ├→ Audio guide player
  ├→ Video guide embed
  ├→ Artwork info
  ├→ Related recommendations
  └→ Visitor feedback form
  ↓
[Track Engagement]
  ├→ Track: artwork_view (immediate)
  ├→ Track: audio_play (if played)
  ├→ Track: dwell_time (on leave)
  └→ Auto-batch events
  ↓
[Offline Support]
  ├→ Service Worker caches content
  ├→ IndexedDB stores offline data
  └→ Analytics queued for sync
  ↓
[Dwell Time Tracking]
  ├→ User leaves artwork page
  ├→ Calculate time spent
  ├→ Track: dwell_time event
  ├→ Move to next artwork
  └→ Repeat process
  ↓
[Analytics Submission]
  ├→ 10 events collected OR 30 seconds passed
  ├→ Batch events into array
  ├→ POST /api/analytics/events
  └→ Include session headers
  ↓
[Backend Processing]
  ├→ Receive batched events
  ├→ Validate session
  ├→ Store in MongoDB
  ├→ Update visitor metrics
  └→ Calculate engagement heatmap
  ↓
[Admin Dashboard]
  ├→ View total visitors
  ├→ See top artworks
  ├→ Check dwell time patterns
  ├→ Export reports
  └→ Improve exhibits
  ↓
END
```

### 2. Session Management Flow

```
[User Visits Page]
         ↓
[Check localStorage]
         ↓
    ┌────────────┐
    │ Session    │
    │ exists?    │
    └────────────┘
    ↙           ↘
[YES]            [NO]
  ↓              ↓
[Load]      [Generate New]
  ↓              ↓
[Validate]  [crypto.getRandomValues()]
  ↓              ↓
[Check]     [Save to]
[Expiry]    [localStorage]
  ↓              ↓
[Valid?]    [Include in]
            [all requests]
    ↓ YES
[Use for
requests]
    ↓
[Track Activity]
  • Click events
  • Keyboard events
  • Scroll events
    ↓
[Update lastActivity]
[timestamp]
    ↓
[After 30 min]
[of inactivity]
    ↓
[New session]
[generated on]
[next activity]
    ↓
[After 24 hours]
    ↓
[Session expires]
    ↓
[Auto-generate]
[new session]
[on next visit]
```

### 3. Analytics Batching & Submission

```
[Event Triggered]
       ↓
[Create Event Object]
{
  eventType: 'artwork_view',
  artworkId: 'starry-night',
  metadata: { dwellTime: 45000 }
}
       ↓
[Add to Queue]
[In Memory]
       ↓
    ┌─────────────────┐
    │ Queue Size ≥ 10 │
    │ OR              │
    │ 30s elapsed?    │
    └─────────────────┘
    ↙                ↘
[YES]                [NO]
  ↓                  ↓
[BATCH]          [WAIT]
  ↓                  ↓
[POST to API]        ↑
  ↓                  └─ More events
[Include Headers]       accumulate
X-Session-Id
X-Anonymous-Id
  ↓
[Body: { events: [...] }]
  ↓
[Backend Receives]
  ↓
[Validates Session]
  ↓
[Stores in MongoDB]
  ↓
[Updates Metrics]
  ↓
[Response: { received: 10 }]
  ↓
[Clear Queue]
  ↓
[Start New Batch]
```

### 4. Offline Sync Flow

```
[User Active Online]
       ↓
[Service Worker]
[Installs]
       ↓
[Caches Assets]
• CSS, JS, Images
• HTML pages
       ↓
[User Goes Offline]
       ↓
[Service Worker]
[Intercepts Requests]
       ↓
[API Calls]
       ↓
[Fall back to]
[Cached Response]
OR
[IndexedDB]
       ↓
[Events Still Track]
       ↓
[Events Stored]
[In IndexedDB]
       ↓
[User Back Online]
       ↓
[PWA Hook Detects]
[Online Status]
       ↓
[Trigger]
[syncAnalytics()]
       ↓
[Query IndexedDB]
[For Queued Events]
       ↓
[Batch Upload]
[To Backend]
       ↓
[Backend Stores]
       ↓
[Delete from]
[IndexedDB]
       ↓
[Resume Normal]
[Operation]
```

### 5. Privacy & Consent Flow

```
[User First Visit]
       ↓
[Check localStorage]
[for consent]
       ↓
    ┌─────────────┐
    │ Consent     │
    │ Preference  │
    │ exists?     │
    └─────────────┘
    ↙           ↘
[YES]           [NO]
  ↓             ↓
[Already]   [Show Banner]
[Decided]       ↓
             [Accept All]
                 ↓
             [setConsentPreferences]
             ├→ analytics: true
             ├→ marketing: true
             ├→ preferences: true
             └→ Save to localStorage
                 ↓
             [Dispatch Event]
             ├→ consent-updated
             └→ analytics-consent-changed
                 ↓
             [CONTINUE]
                 ↓
    OR       [Customize]
             [Show Details]
                 ├→ Toggles for each
                 ├→ Save Preferences
                 └→ [CONTINUE]
                 ↓
    OR       [Reject Non-Essential]
             ├→ analytics: false
             ├→ marketing: false
             ├→ preferences: false
             ├→ necessaryOnly: true
             └→ [CONTINUE]
                 ↓
[Preference Stored]
[1 year in localStorage]
       ↓
[Analytics Check]
       ↓
[Is Analytics Enabled?]
    ↙           ↘
[YES]           [NO]
  ↓             ↓
[Track      [Queue Events
[Events]     Locally Only]
             OR
             [Discard]
       ↓
[Consent Footer]
[Settings Available]
[Any Time]
```

## Technology Stack Visualization

```
┌─ FRONTEND LAYER ──────────────────────────────────────────┐
│                                                             │
│  Next.js 16 (React 19, TypeScript 5.7)                   │
│  ├─ Pages & Routing (File-based)                         │
│  ├─ API Routes (Mock endpoints)                          │
│  └─ Server Components (Performance)                      │
│                                                             │
│  React Components                                         │
│  ├─ UI Library: Radix UI (Headless)                      │
│  ├─ Styling: Tailwind CSS                                │
│  ├─ Icons: Lucide React                                  │
│  └─ Forms: Custom hooks                                  │
│                                                             │
│  Custom Hooks                                            │
│  ├─ useSession (Session lifecycle)                       │
│  ├─ useArtwork (Data fetching)                           │
│  ├─ usePWA (Offline/PWA)                                 │
│  ├─ useToast (Notifications)                             │
│  └─ useMobile (Responsive)                               │
│                                                             │
│  Core Libraries                                          │
│  ├─ jsQR (QR scanning)                                   │
│  ├─ Recharts (Analytics charts)                          │
│  ├─ Lottie (Animations)                                  │
│  ├─ Vaul (Drawers/modals)                                │
│  └─ Axios (HTTP client)                                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
                          ↓
           ┌──────────────────────────────┐
           │   HTTP/HTTPS Communication   │
           │   (Headers included)         │
           └──────────────────────────────┘
                          ↓
┌─ BACKEND LAYER ────────────────────────────────────────────┐
│                                                             │
│  Express.js (Node.js 18+)                                │
│  ├─ Routing (REST API)                                   │
│  ├─ Middleware (Auth, validation, logging)               │
│  ├─ Controllers (Business logic)                         │
│  └─ Error Handling                                        │
│                                                             │
│  Data Access Layer                                        │
│  ├─ MongoDB Driver (native)                              │
│  ├─ Cloudinary SDK                                       │
│  ├─ Validation (Joi, Zod)                                │
│  └─ Caching strategies                                   │
│                                                             │
│  Supporting Libraries                                    │
│  ├─ CORS (Cross-origin)                                  │
│  ├─ Morgan (Logging)                                     │
│  ├─ Multer (File uploads)                                │
│  ├─ JWT (Authentication)                                 │
│  └─ Dotenv (Environment)                                 │
│                                                             │
└────────────────────────────────────────────────────────────┘
                          ↓
┌─ DATA & SERVICES LAYER ────────────────────────────────────┐
│                                                             │
│  Primary Database: MongoDB                               │
│  ├─ Collections:                                         │
│  │  ├─ analytics (events, TTL: 30d)                      │
│  │  ├─ artworks (metadata)                               │
│  │  ├─ sessions (visitors, TTL: 24h)                     │
│  │  └─ admins (users)                                    │
│  └─ Indexes: Text search, location, timestamp            │
│                                                             │
│  Media CDN: Cloudinary                                   │
│  ├─ 3D Models (glb, obj)                                 │
│  ├─ Images (artwork photos)                              │
│  └─ Videos (guides)                                      │
│                                                             │
│  Video Hosting: Vimeo                                    │
│  ├─ Hero background video                                │
│  └─ Guide content                                         │
│                                                             │
│  Vision API: Google Cloud (Future)                       │
│  └─ Image recognition for artworks                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Component Communication Flow

```
User Interaction
       ↓
┌─────────────────────────────────────┐
│ React Component                     │
│ (e.g., QRScanner, ArtworkDetail)   │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ useSession() Hook                   │
│ (Get session context)               │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ analyticsManager.trackEvent()       │
│ (Event added to queue)              │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Event Batching Logic                │
│ (Wait 30s or 10 events)             │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ apiClient.POST()                    │
│ (With session headers)              │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Backend Express Route               │
│ POST /api/analytics/events          │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Middleware (validation, auth)       │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Controller (analytics)              │
│ (Process events)                    │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ MongoDB Analytics Collection        │
│ (Store documents)                   │
└─────────────────────────────────────┘
       ↓
Response (Confirmation)
```

---

This comprehensive architecture ensures scalability, privacy, and offline-first capabilities for a modern museum experience platform.
