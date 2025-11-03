# Backend API Testing Guide

## Quick Start

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Seed database with sample data
npm run seed
```

Server runs on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

### Analytics Endpoints

#### Submit Events
```
POST http://localhost:5000/api/analytics/events
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid
  Content-Type: application/json

Body:
{
  "events": [
    {
      "eventType": "artwork_view",
      "artworkId": "starry-night",
      "metadata": { "location": "Post-Impressionism" }
    },
    {
      "eventType": "dwell_time",
      "artworkId": "starry-night",
      "metadata": { "dwellTime": 45000 }
    }
  ]
}
```

#### Get Analytics Summary
```
GET http://localhost:5000/api/analytics/summary
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid

Query Parameters (optional):
  ?startDate=2025-11-01&endDate=2025-11-30
  ?artworkId=starry-night
```

#### Get Engagement Heatmap
```
GET http://localhost:5000/api/analytics/heatmap
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid

Query Parameters (optional):
  ?exhibitId=Post-Impressionism
```

### Artwork Endpoints

#### Get Single Artwork
```
GET http://localhost:5000/api/artworks/starry-night
```

#### List All Artworks
```
GET http://localhost:5000/api/artworks
Query Parameters (optional):
  ?location=Post-Impressionism
  ?limit=20&offset=0
```

#### Search Artworks
```
GET http://localhost:5000/api/artworks/search/query
Query Parameters:
  ?q=Van%20Gogh
  ?location=Post-Impressionism
  ?period=1889
```

#### Create Artwork (Admin)
```
POST http://localhost:5000/api/artworks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "artworkId": "new-artwork",
  "title": "New Artwork",
  "artist": "Artist Name",
  "yearCreated": 2024,
  "description": "Description here",
  "medium": "Oil on canvas",
  "dimensions": "100x100cm"
}
```

#### Update Artwork (Admin)
```
PUT http://localhost:5000/api/artworks/starry-night
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Artwork (Admin)
```
DELETE http://localhost:5000/api/artworks/starry-night
Authorization: Bearer <JWT_TOKEN>
```

### Session Endpoints

#### Validate Session
```
POST http://localhost:5000/api/sessions/validate
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid
```

#### Update Session Preferences
```
POST http://localhost:5000/api/sessions/preferences
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid
Content-Type: application/json

Body:
{
  "analyticsEnabled": true,
  "marketingEnabled": false
}
```

#### Get Artworks Viewed
```
GET http://localhost:5000/api/sessions/viewed
Headers:
  X-Session-Id: session_demo_001
  X-Anonymous-Id: anon_001_uuid
```

### Admin Endpoints

#### Admin Login
```
POST http://localhost:5000/api/admin/login
Content-Type: application/json

Body:
{
  "password": "museum123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d",
  "type": "Bearer"
}
```

#### Get Dashboard
```
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer <JWT_TOKEN>

Query Parameters (optional):
  ?startDate=2025-11-01&endDate=2025-11-30
```

#### List Artworks (Admin)
```
GET http://localhost:5000/api/admin/artworks
Authorization: Bearer <JWT_TOKEN>

Query Parameters (optional):
  ?page=1&limit=20
```

#### Export Report
```
GET http://localhost:5000/api/admin/reports/export
Authorization: Bearer <JWT_TOKEN>

Query Parameters (optional):
  ?startDate=2025-11-01&endDate=2025-11-30&format=json
  ?format=csv
```

## Testing with cURL

### Test Health
```bash
curl http://localhost:5000/api/health
```

### Test Analytics Submission
```bash
curl -X POST http://localhost:5000/api/analytics/events \
  -H "X-Session-Id: session_demo_001" \
  -H "X-Anonymous-Id: anon_001_uuid" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "eventType": "artwork_view",
      "artworkId": "starry-night"
    }]
  }'
```

### Test Get Artwork
```bash
curl http://localhost:5000/api/artworks/starry-night
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "museum123"}'
```

## Testing with Postman

1. Import the provided Postman collection
2. Set environment variables:
   - `base_url`: http://localhost:5000
   - `sessionId`: session_demo_001
   - `anonymousId`: anon_001_uuid
   - `adminPassword`: museum123

## Database Collections

### Artworks
- Stores metadata for museum artworks
- Includes links to 3D models (Cloudinary), audio guides, related works
- Sample data includes 4 artworks pre-loaded

### Sessions
- Tracks visitor sessions
- TTL: 24 hours
- Contains preferences and artworks viewed

### Analytics
- Stores visitor engagement events
- TTL: 30 days (auto-deletes)
- Indexed by: sessionId, timestamp, artworkId

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB is running locally on port 27017
- Or update MONGODB_URI in .env for Atlas connection

### "Missing session headers"
- Always include X-Session-Id and X-Anonymous-Id headers
- Format: 32-char hex for session ID, UUID for anonymous ID

### "Invalid token"
- Make sure JWT token hasn't expired (7 days)
- Include "Bearer " prefix in Authorization header

### "Session expired"
- Sessions expire after 24 hours
- Create new session from frontend

## Performance Notes

- Analytics events are batched on frontend (10 events or 30 seconds)
- Database indexes optimize queries by: sessionId, timestamp, artworkId
- TTL indexes auto-delete old data to manage storage

## Next Steps

1. Connect frontend to these backend endpoints
2. Test full flow: QR scan → analytics submission → dashboard
3. Add museum-specific artwork data
4. Deploy to production environment
