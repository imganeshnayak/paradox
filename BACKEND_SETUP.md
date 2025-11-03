# ArtVerse Backend Setup Guide

## Overview
The backend uses Express.js with MongoDB and Node.js to handle:
- Analytics data collection and storage
- Artwork metadata management
- User session tracking
- 3D model storage via Cloudinary
- Admin dashboard API endpoints

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB (Atlas or local)
- **Image/3D Storage**: Cloudinary
- **Authentication**: JWT for admin, Anonymous sessions for visitors
- **Validation**: Joi or Zod
- **Logging**: Morgan or Winston
- **Environment**: dotenv

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary setup
│   │   └── env.js               # Environment variables
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── artworkController.js
│   │   ├── sessionController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Analytics.js         # Analytics events schema
│   │   ├── Artwork.js           # Artwork metadata schema
│   │   ├── Session.js           # Visitor sessions schema
│   │   └── Admin.js             # Admin users schema
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── artworks.js
│   │   ├── sessions.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js              # Session & admin verification
│   │   ├── validation.js        # Request validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── cors.js              # CORS configuration
│   ├── utils/
│   │   ├── cloudinary.js        # 3D model upload helpers
│   │   ├── validators.js        # Data validation schemas
│   │   └── logger.js            # Logging utilities
│   └── app.js                   # Express app setup
├── .env.example
├── package.json
└── server.js                    # Entry point
```

## Installation & Setup

### 1. Initialize the Project

```bash
cd backend
npm init -y
npm install express mongodb dotenv cors morgan joi cloudinary multer
npm install --save-dev nodemon
```

### 2. Create `.env` File

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ArtVerse
DATABASE_NAME=ArtVerse

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Admin
ADMIN_PASSWORD_HASH=hashed_password

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Update `package.json` Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage"
  }
}
```

## Database Schema

### Analytics Collection
```javascript
{
  _id: ObjectId,
  sessionId: String,          // From frontend session
  anonymousId: String,        // UUID
  eventType: String,          // 'artwork_view', 'dwell_time', 'click', etc.
  artworkId: String,
  metadata: {
    dwellTime: Number,        // milliseconds
    location: String,         // exhibit location
    qrScanned: Boolean
  },
  timestamp: Date,
  userAgent: String,
  createdAt: Date,
  expiresAt: Date             // TTL index for auto-deletion (30 days)
}
```

### Artwork Collection
```javascript
{
  _id: ObjectId,
  artworkId: String,          // Unique identifier
  title: String,
  artist: String,
  yearCreated: Number,
  description: String,
  image: {
    url: String,              // Cloudinary URL
    cloudinaryId: String
  },
  model3D: {
    url: String,              // Cloudinary 3D model URL
    cloudinaryId: String,
    format: String            // 'obj', 'glb', 'gltf'
  },
  audioGuide: {
    url: String,              // S3 or Cloudinary
    transcription: String,
    duration: Number          // seconds
  },
  location: {
    exhibit: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  relatedWorks: [ObjectId],
  metadata: {
    period: String,
    medium: String,
    dimensions: String
  },
  updatedAt: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  sessionId: String,          // 32-char hex
  anonymousId: String,        // UUID
  visitDate: Date,
  lastActivity: Date,
  preferences: {
    analyticsEnabled: Boolean,
    marketingEnabled: Boolean
  },
  artworksViewed: [String],
  expiresAt: Date             // TTL index (24 hours)
}
```

## API Endpoints

### Analytics
```
POST /api/analytics/events
  Body: {
    events: Array<{
      eventType: string,
      artworkId?: string,
      metadata?: object
    }>
  }
  Response: { received: number }

GET /api/analytics/summary
  Query: { startDate, endDate, artworkId? }
  Response: { totalEvents, uniqueSessions, avgDwellTime, topArtworks }

GET /api/analytics/heatmap
  Query: { exhibitId? }
  Response: { locations: Array<{ x, y, views }> }
```

### Artwork Management
```
GET /api/artworks/:id
  Response: Full artwork object

POST /api/artworks
  Auth: Admin JWT
  Body: artwork data + 3D model upload
  Response: Created artwork

PUT /api/artworks/:id
  Auth: Admin JWT
  Body: updated artwork data
  Response: Updated artwork

DELETE /api/artworks/:id
  Auth: Admin JWT
  Response: { deleted: true }

GET /api/artworks/search
  Query: { q, location, period }
  Response: Array of artworks

GET /api/artworks
  Query: { location?, limit, offset }
  Response: Paginated artworks
```

### Sessions
```
POST /api/sessions/validate
  Headers: X-Session-Id, X-Anonymous-Id
  Response: { valid: boolean, expiresAt: date }

POST /api/sessions/preferences
  Headers: X-Session-Id
  Body: { analyticsEnabled, marketingEnabled }
  Response: { updated: true }
```

### Admin
```
POST /api/admin/login
  Body: { password }
  Response: { token: JWT }

GET /api/admin/dashboard
  Auth: JWT
  Response: { totalVisitors, totalEvents, topArtworks, charts }

GET /api/admin/artworks
  Auth: JWT
  Response: Array of artworks with edit UI

POST /api/admin/3d-upload
  Auth: JWT
  Body: FormData with 3D model file
  Response: { url, cloudinaryId }

GET /api/admin/reports/export
  Auth: JWT
  Query: { startDate, endDate, format: 'csv' | 'json' }
  Response: Report file download
```

## 3D Model Storage (Cloudinary)

### Upload Configuration
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload 3D model
async function upload3DModel(filePath, artworkId) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    folder: 'ArtVerse/3d-models',
    public_id: `artwork-${artworkId}`,
    format: 'glb' // or your preferred format
  });
  
  return {
    url: result.secure_url,
    cloudinaryId: result.public_id
  };
}
```

## Authentication Flow

### Session Validation
```
1. Frontend includes headers:
   - X-Session-Id: 32-char hex
   - X-Anonymous-Id: UUID

2. Backend middleware:
   - Validates session exists in MongoDB
   - Checks expiration (24 hours)
   - Updates lastActivity timestamp

3. Response:
   - Allows request to proceed
   - Or returns 401 Unauthorized
```

### Admin Authentication
```
1. Admin sends password to POST /api/admin/login
2. Backend compares with hashed password
3. Returns JWT token (7-day expiration)
4. Admin includes token in Authorization header
5. Middleware verifies JWT and grants access
```

## Data Retention & Privacy

### TTL Indexes
```javascript
// Sessions expire after 24 hours
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Analytics expire after 30 days
db.analytics.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### GDPR Compliance
- No PII collected (only anonymous IDs)
- Users can request deletion of analytics (future implementation)
- Automatic data expiration after retention period
- Consent preferences stored on frontend (not in backend)

## Development Workflow

### 1. Local Setup
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Testing Endpoints
```bash
# Validate session
curl -X POST http://localhost:5000/api/sessions/validate \
  -H "X-Session-Id: abc123..." \
  -H "X-Anonymous-Id: uuid-here..."

# Submit analytics
curl -X POST http://localhost:5000/api/analytics/events \
  -H "Content-Type: application/json" \
  -d '{"events": [{"eventType": "artwork_view", "artworkId": "starry-night"}]}'
```

### 3. Seed Database
```bash
npm run seed
# Creates sample artworks and admin user
```

## Deployment

### MongoDB Atlas Setup
1. Create free tier cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP addresses
4. Copy connection string to `.env`

### Cloudinary Setup
1. Sign up at cloudinary.com
2. Copy API credentials to `.env`
3. Create folder: `ArtVerse/3d-models`

### Environment Deployment
```bash
# Production .env
PORT=5000
NODE_ENV=production
MONGODB_URI=[Atlas connection string]
CLOUDINARY_CLOUD_NAME=[your cloud]
...
```

## Next Steps

1. **Implement Core Endpoints**
   - Analytics event collection
   - Session validation
   - Artwork retrieval

2. **Add Authentication**
   - JWT for admin dashboard
   - Session validation middleware

3. **Connect Cloudinary**
   - Upload 3D models
   - Configure transformations

4. **Build Admin Dashboard Backend**
   - Analytics aggregation
   - Engagement heatmaps
   - Artwork CRUD operations

5. **Testing & Optimization**
   - Unit tests for controllers
   - API load testing
   - Database indexing

## Resources
- Express.js: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
- Cloudinary API: https://cloudinary.com/documentation/api_reference
- JWT: https://jwt.io
