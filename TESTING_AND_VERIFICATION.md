# Testing & Verification Guide

## Current Issue: Empty Analytics

**Status**: ✅ System is working correctly - no errors in logs
**Problem**: 0 visitors, 0 events (empty analytics collection)

This is expected because no user interactions have been recorded yet. This guide will help you:
1. Verify all endpoints are working
2. Populate analytics with test data
3. Monitor data flow in real-time

---

## Part 1: Quick Verification Tests

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response**:
```json
{ "status": "ok", "timestamp": "2025-11-03T..." }
```

✅ **If you see this**: Backend is running correctly

---

### Test 2: Analytics Debug (Empty)
```bash
curl http://localhost:5000/api/admin/analytics-debug
```

**Expected Response** (current state):
```json
{
  "collections": {
    "analyticsCount": 0,
    "likesCount": 0,
    "reviewsCount": 0
  },
  "eventTypes": [],
  "recentLikes": [],
  "recentReviews": [],
  "likesByArtwork": [],
  "reviewsByArtwork": [],
  "timestamp": "2025-11-03T..."
}
```

✅ **If you see this**: Database connection is working

---

### Test 3: Check Artworks Exist
```bash
curl http://localhost:5000/api/artworks
```

**Expected**: Returns list of artworks with pagination

✅ **If you see artworks**: Frontend can display them

---

## Part 2: Manual Testing - Like System

### Step 1: Get an Artwork ID

First, get the ID of an existing artwork:

```bash
curl http://localhost:5000/api/artworks | jq '.artworks[0]._id'
```

This will output something like: `"507f1f77bcf86cd799439011"`

**Save this ID for the following tests**. Let's call it `ARTWORK_ID`.

---

### Step 2: Test Like Endpoint

```bash
curl -X POST http://localhost:5000/api/reviews/ARTWORK_ID/like \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-session-001"}'
```

**Expected Response** (first like):
```json
{
  "message": "Like added",
  "liked": true,
  "totalLikes": 1
}
```

✅ **Check backend console for**:
```
❤️ Like added for artwork ARTWORK_ID by session test-session-001
```

---

### Step 3: Test Like Again (Same Session)

```bash
curl -X POST http://localhost:5000/api/reviews/ARTWORK_ID/like \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-session-001"}'
```

**Expected Response** (unlike):
```json
{
  "message": "Like removed",
  "liked": false,
  "totalLikes": 0
}
```

✅ **Check backend console for**:
```
💔 Like removed for artwork ARTWORK_ID by session test-session-001
```

---

### Step 4: Check Like Status

```bash
curl "http://localhost:5000/api/reviews/ARTWORK_ID/like/check?sessionId=test-session-001"
```

**Expected Response**:
```json
{
  "artworkId": "ARTWORK_ID",
  "liked": false,
  "totalLikes": 0
}
```

---

## Part 3: Manual Testing - Review System

### Step 1: Submit a Review

```bash
curl -X POST http://localhost:5000/api/reviews/ARTWORK_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"test-session-002",
    "rating":5,
    "comment":"This is an amazing artwork!"
  }'
```

**Expected Response**:
```json
{
  "message": "Review submitted successfully",
  "reviewId": "507f1f77bcf86cd799439012",
  "review": {
    "artworkId": "...",
    "rating": 5,
    "comment": "This is an amazing artwork!",
    "sessionId": "test-session-002",
    "_id": "507f1f77bcf86cd799439012"
  }
}
```

✅ **Check backend console for**:
```
⭐ Review submitted (5 stars) for artwork ARTWORK_ID by session test-session-002
```

---

### Step 2: Get Reviews with Stats

```bash
curl "http://localhost:5000/api/reviews/ARTWORK_ID/reviews"
```

**Expected Response**:
```json
{
  "artworkId": "ARTWORK_ID",
  "reviews": [
    {
      "_id": "...",
      "artworkId": "ARTWORK_ID",
      "rating": 5,
      "comment": "This is an amazing artwork!",
      "sessionId": "test-session-002",
      "createdAt": "2025-11-03T..."
    }
  ],
  "stats": {
    "totalReviews": 1,
    "averageRating": 5,
    "totalLikes": 0,
    "ratingDistribution": {
      "5": 1,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    }
  }
}
```

✅ **You should see your review in the list**

---

## Part 4: Analytics Verification

### After Running Tests Above

```bash
curl http://localhost:5000/api/admin/analytics-debug
```

**Expected Response** (after tests):
```json
{
  "collections": {
    "analyticsCount": 3,        // 1 like_added + 1 like_removed + 1 review_submitted
    "likesCount": 0,            // Like was removed
    "reviewsCount": 1           // Review stored
  },
  "eventTypes": [
    "like_added",
    "like_removed",
    "review_submitted"
  ],
  "recentLikes": [
    {
      "eventType": "like_added",
      "artworkId": "ARTWORK_ID",
      "sessionId": "test-session-001",
      ...
    }
  ],
  "recentReviews": [
    {
      "eventType": "review_submitted",
      "artworkId": "ARTWORK_ID",
      "sessionId": "test-session-002",
      ...
    }
  ],
  "likesByArtwork": [
    {
      "_id": "ARTWORK_ID",
      "count": 2
    }
  ],
  "reviewsByArtwork": [
    {
      "_id": "ARTWORK_ID",
      "count": 1
    }
  ]
}
```

✅ **You should see your interactions recorded**

---

### Dashboard Should Now Show Data

```bash
curl http://localhost:5000/api/admin/dashboard
```

**Expected Response**:
```json
{
  "totalVisitors": 2,                    // test-session-001 + test-session-002
  "totalEvents": 3,                      // 3 total events
  "avgEventsPerVisitor": "1.5",
  "topArtworks": [
    {
      "artworkId": "ARTWORK_ID",
      "views": 0,
      "likes": 1,
      "likesRemoved": 1,
      "netLikes": 0,
      "reviews": 1,
      "uniqueVisitors": 2,
      "engagement": 2                    // 0 net likes + (1 review * 2)
    }
  ],
  "eventDistribution": [
    { "_id": "review_submitted", "count": 1 },
    { "_id": "like_added", "count": 1 },
    { "_id": "like_removed", "count": 1 }
  ]
}
```

✅ **Dashboard now shows 2 visitors, 3 events**

---

## Part 5: Browser-Based Testing

### Test 1: Open Artwork in Browser

1. Go to `http://localhost:3000`
2. Browse to any artwork detail page
3. Open browser DevTools → Console

**Watch for**:
```
Session ID: 550e8400-e29b-41d4-a716-446655440000_1730000000000
```

✅ **If you see this**: Session ID was generated

---

### Test 2: Like from Browser

1. On artwork detail page
2. Find the heart icon (like button)
3. Click it

**Watch for in browser console**:
```
Like toggled for artwork [artworkId]
```

**Watch for in server console**:
```
❤️ Like added for artwork [artworkId] by session [sessionId]
```

✅ **If you see both**: Like system is working

---

### Test 3: Submit Review from Browser

1. Scroll to feedback form at bottom
2. Enter rating (1-5 stars)
3. Enter comment (optional)
4. Click submit

**Watch for in browser console**:
```
Review submitted with rating: 5
```

**Watch for in server console**:
```
⭐ Review submitted (5 stars) for artwork [artworkId] by session [sessionId]
```

✅ **If you see both**: Review system is working

---

### Test 4: Check Dashboard

1. Go to `http://localhost:3000/admin`
2. Login with password `museum123`
3. Dashboard should load and show:
   - Visitors count
   - Events count
   - Top artworks
   - Charts

✅ **If you see data**: Admin dashboard is working

---

## Part 6: Bulk Testing Script

### Create test data script (save as `test-analytics.sh`)

```bash
#!/bin/bash

# Get first artwork ID
ARTWORK_ID=$(curl -s http://localhost:5000/api/artworks | jq -r '.artworks[0]._id')

echo "Testing with Artwork ID: $ARTWORK_ID"
echo ""

# Simulate 5 different users
for i in {1..5}; do
  SESSION_ID="test-user-$i"
  
  echo "--- User $i ($SESSION_ID) ---"
  
  # Like
  curl -s -X POST "http://localhost:5000/api/reviews/$ARTWORK_ID/like" \
    -H "Content-Type: application/json" \
    -d "{\"sessionId\":\"$SESSION_ID\"}" | jq '.'
  
  # Submit review
  RATING=$((1 + RANDOM % 5))
  curl -s -X POST "http://localhost:5000/api/reviews/$ARTWORK_ID/reviews" \
    -H "Content-Type: application/json" \
    -d "{\"sessionId\":\"$SESSION_ID\",\"rating\":$RATING,\"comment\":\"Great artwork!\"}" | jq '.'
  
  echo ""
  sleep 1
done

# Show final dashboard
echo "=== FINAL DASHBOARD ==="
curl -s http://localhost:5000/api/admin/dashboard | jq '.totalVisitors, .totalEvents, .topArtworks[0]'
```

**Run it**:
```bash
bash test-analytics.sh
```

**Expected Output**:
```
--- User 1 (test-user-1) ---
{ "message": "Like added", "liked": true, "totalLikes": 1 }
{ "message": "Review submitted successfully", "reviewId": "..." }

--- User 2 (test-user-2) ---
...

=== FINAL DASHBOARD ===
"totalVisitors": 5
"totalEvents": 10
{
  "artworkId": "...",
  "views": 0,
  "likes": 5,
  "reviews": 5,
  ...
}
```

✅ **If successful**: System handles multiple users correctly

---

## Part 7: Troubleshooting

### Issue: Endpoints return 404

**Check**:
1. Backend is running: `curl http://localhost:5000/api/health`
2. Correct artwork ID: `curl http://localhost:5000/api/artworks | jq '.artworks[0]._id'`
3. Correct format: Replace `ARTWORK_ID` with actual ID

---

### Issue: Like/Review returns error

**Check**:
1. SessionId provided: `"sessionId":"test-session-001"`
2. For reviews, rating 1-5: `"rating":5`
3. Artwork exists: Check ID matches one from artworks list

---

### Issue: Analytics still empty after testing

**Check**:
1. Backend console shows emoji logs (❤️, ⭐)
2. Check analytics debug: `curl http://localhost:5000/api/admin/analytics-debug`
3. Check MongoDB connection in server logs

---

### Issue: Dashboard shows 0 visitors but we tested

**Check**:
1. Different sessions used: Each test should use different `sessionId`
2. Date range includes test timestamps: No date filters or adjust range
3. Analytics collection has data: Use `/api/admin/analytics-debug`

---

## Part 8: Monitoring Real-Time Data

### Watch Backend Console

```bash
# Terminal 1: Start backend with visible logs
cd backend
npm start
```

**You should see these patterns**:

```
❤️ Like added for artwork [id] by session [sessionId]
💔 Like removed for artwork [id] by session [sessionId]
⭐ Review submitted (5 stars) for artwork [id] by session [sessionId]
📊 Dashboard: X visitors, Y events
```

---

### Monitor Database in Real-Time

**Terminal 2**: Connect to MongoDB and watch collections

```bash
mongosh
use museum
db.analytics.countDocuments()        # Should increase as you interact
db.analytics.find().limit(5)         # See recent events
db.likes.countDocuments()            # Current likes
db.reviews.countDocuments()          # Current reviews
```

---

### Monitor Network Traffic

**Browser DevTools → Network Tab**:

1. Like artwork
   - POST `/api/reviews/[id]/like` → Status 201
   - Response: `{ liked: true, totalLikes: X }`

2. Submit review
   - POST `/api/reviews/[id]/reviews` → Status 201
   - Response: `{ message: "Review submitted successfully" }`

3. View dashboard
   - GET `/api/admin/dashboard` → Status 200
   - Response includes: `totalVisitors`, `totalEvents`, `topArtworks`

---

## Part 9: Populate Analytics with Real Data

### Option 1: Manual User Interactions (Recommended)

```
1. Open http://localhost:3000 in browser
2. Browse to 3-4 different artworks
3. Like 2-3 artworks
4. Submit 2-3 reviews
5. Navigate between pages to generate view events
6. Check dashboard to see data
```

**Time**: 5-10 minutes
**Result**: Real, diverse analytics data

---

### Option 2: Bulk Load via Script

```bash
# Run the test script from Part 6
bash test-analytics.sh
```

**Time**: 1 minute
**Result**: Consistent, reproducible test data

---

### Option 3: Seed Script

Create `backend/populate-analytics.js`:

```javascript
const { MongoClient } = require('mongodb');
const config = require('./src/config/env');

async function populateAnalytics() {
  const client = new MongoClient(config.mongodb.uri);
  
  try {
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    
    // Get artworks
    const artworks = await db.collection('artworks').find({}).limit(5).toArray();
    
    if (artworks.length === 0) {
      console.log('No artworks found');
      return;
    }
    
    // Generate analytics events
    const events = [];
    
    for (let i = 1; i <= 10; i++) {
      const artwork = artworks[i % artworks.length];
      const sessionId = `seed-session-${i}`;
      
      // Like event
      events.push({
        artworkId: artwork._id.toString(),
        sessionId,
        eventType: 'like_added',
        metadata: { timestamp: new Date(), action: 'like' },
        timestamp: new Date(),
        anonymousId: sessionId.substring(0, 8)
      });
      
      // Review event
      events.push({
        artworkId: artwork._id.toString(),
        sessionId,
        eventType: 'review_submitted',
        metadata: {
          rating: 3 + (i % 3),
          hasComment: true,
          commentLength: 50
        },
        timestamp: new Date(),
        anonymousId: sessionId.substring(0, 8)
      });
    }
    
    // Insert all events
    const result = await db.collection('analytics').insertMany(events);
    console.log(`✅ Inserted ${result.insertedCount} analytics events`);
    
  } finally {
    await client.close();
  }
}

populateAnalytics();
```

**Run**:
```bash
cd backend
node populate-analytics.js
```

**Result**: 20 analytics events created instantly

---

## Part 10: Verification Checklist

After you've run tests:

- [ ] `GET /api/health` returns ok
- [ ] `GET /api/artworks` returns artworks list
- [ ] `POST /api/reviews/:id/like` creates like event
- [ ] `POST /api/reviews/:id/reviews` creates review event
- [ ] Backend console shows emoji logs (❤️, ⭐)
- [ ] `GET /api/admin/analytics-debug` shows event counts > 0
- [ ] `GET /api/admin/dashboard` shows totalVisitors > 0
- [ ] Browser can like artworks
- [ ] Browser can submit reviews
- [ ] Admin dashboard displays data

---

## Quick Start: 2-Minute Verification

```bash
# Terminal 1: Backend running?
curl http://localhost:5000/api/health

# Terminal 2: Get artwork ID
ARTWORK_ID=$(curl -s http://localhost:5000/api/artworks | jq -r '.artworks[0]._id')
echo "Using artwork: $ARTWORK_ID"

# Terminal 3: Simulate like
curl -X POST http://localhost:5000/api/reviews/$ARTWORK_ID/like \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-1"}'

# Terminal 4: Simulate review
curl -X POST http://localhost:5000/api/reviews/$ARTWORK_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-2","rating":5,"comment":"Great!"}'

# Terminal 5: Check dashboard
curl http://localhost:5000/api/admin/dashboard | jq '.totalVisitors, .totalEvents'
```

**Expected**:
```
Status 200 - ok
artworkId
Status 201 - Like added
Status 201 - Review submitted
totalVisitors: 2
totalEvents: 2
```

---

## Summary

**Current Status**: ✅ System working, 0 events (expected)

**Next Steps**:
1. Run one of the test options above to populate analytics
2. Watch backend console for emoji logs
3. Check admin dashboard to see data
4. All systems should be operational

**No code changes needed** - system is correctly reporting 0 events because no interactions have occurred yet.

