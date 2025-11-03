# Analytics System Verification Guide

## System Overview

This museum app now has a complete anonymous engagement system that tracks user interactions (likes, reviews) without requiring signup. All interactions are stored in analytics for admin visibility.

### Key Components

1. **Frontend Session Management** - Anonymous users get a unique session ID
2. **Like & Review System** - Users can like artworks and submit ratings/comments
3. **Analytics Tracking** - All interactions recorded in MongoDB
4. **Admin Dashboard** - Real-time metrics and engagement data

---

## Architecture

```
User Action (Like/Review)
    ↓
Frontend: Send to Backend with SessionId
    ↓
Backend: Record in Reviews/Likes Collection + Analytics Collection
    ↓
Analytics Event Types: 'like_added', 'like_removed', 'review_submitted'
    ↓
Admin Dashboard: Aggregates analytics to show metrics
```

---

## Testing Checklist

### 1. Session ID Generation
**File**: `frontend/lib/session-id.ts`

```javascript
getSessionId() // Returns: "550e8400-e29b-41d4-a716-446655440000_1234567890123"
```

✅ Session ID is generated on first visit and persists in localStorage
✅ Key: `museum-session-id`

**How to verify:**
```javascript
// In browser console
localStorage.getItem('museum-session-id')
// Should return: UUID_timestamp format
```

---

### 2. Like System
**Frontend Component**: `frontend/components/artwork-detail/like-button.tsx`

**Endpoints**:
- `POST /api/reviews/:id/like` - Toggle like
- `GET /api/reviews/:id/like/check` - Get like status

**Test Steps**:
1. Navigate to artwork detail page
2. Click heart icon to like
3. Console should show: `❤️ Like added`
4. Click again to unlike
5. Console should show: `💔 Like removed`
6. Refresh page - like status persists (session-based)

**Expected Response**:
```json
{
  "message": "Like added",
  "liked": true,
  "totalLikes": 42
}
```

---

### 3. Review System
**Frontend Component**: `frontend/components/artwork-detail/feedback-form.tsx`

**Endpoint**:
- `POST /api/reviews/:id/reviews` - Submit review

**Test Steps**:
1. Navigate to artwork detail page
2. Scroll to feedback form
3. Select rating (1-5 stars)
4. Enter comment (optional)
5. Click submit
6. Should see success message
7. Refresh - review appears in reviews list

**Expected Response**:
```json
{
  "message": "Review submitted successfully",
  "reviewId": "507f1f77bcf86cd799439011",
  "review": {
    "artworkId": "...",
    "rating": 5,
    "comment": "Amazing artwork!",
    "sessionId": "550e8400...",
    "_id": "..."
  }
}
```

---

### 4. Analytics Events
**Backend**: All events recorded in `analytics` collection

**Event Types**:
- `artwork_view` - User views an artwork
- `like_added` - User likes an artwork
- `like_removed` - User unlikes an artwork
- `review_submitted` - User submits a review

**Event Structure**:
```javascript
{
  artworkId: "507f1f77bcf86cd799439011",
  sessionId: "550e8400-e29b-41d4-a716-446655440000_1234567890123",
  eventType: "like_added",
  metadata: {
    timestamp: 2024-01-15T10:30:00.000Z,
    action: "like",
    rating: 5,           // for reviews
    hasComment: true,    // for reviews
    commentLength: 15    // for reviews
  },
  timestamp: 2024-01-15T10:30:00.000Z,
  anonymousId: "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 5. Admin Dashboard
**File**: `frontend/app/admin/page.tsx`

**Endpoint**: `GET /api/admin/dashboard?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Response Includes**:
```javascript
{
  totalVisitors: 42,                              // Unique sessions
  totalEvents: 156,                               // Total interactions
  avgEventsPerVisitor: "3.71",                    // Events per user
  topArtworks: [
    {
      artworkId: "507f1f77bcf86cd799439011",
      views: 45,                                  // Just views
      likes: 12,                                  // Just likes added
      likesRemoved: 2,                            // Unlikes
      netLikes: 10,                               // likes - removed
      reviews: 8,                                 // Just reviews
      uniqueVisitors: 28,
      avgDwellTime: 120,                          // Seconds
      engagement: 26                              // netLikes + (reviews * 2)
    }
  ],
  eventDistribution: [
    { _id: "artwork_view", count: 95 },
    { _id: "like_added", count: 42 },
    { _id: "review_submitted", count: 19 }
  ],
  timelineData: [
    {
      date: "2024-01-15",
      events: 45,
      visitors: 12
    }
  ],
  period: { startDate, endDate },
  debug: {
    timestamp: 2024-01-15T10:30:00.000Z,
    uniqueSessionsCount: 42,
    topArtworksCount: 10,
    eventTypesCount: 3
  }
}
```

---

### 6. Analytics Debug Endpoint
**Endpoint**: `GET /api/admin/analytics-debug`

Use this to inspect raw data for troubleshooting.

**Response Includes**:
```javascript
{
  collections: {
    analyticsCount: 156,      // Total events
    likesCount: 42,           // Separate likes collection
    reviewsCount: 19          // Separate reviews collection
  },
  eventTypes: ["artwork_view", "like_added", "like_removed", "review_submitted"],
  recentLikes: [ /* 10 most recent like events */ ],
  recentReviews: [ /* 10 most recent review events */ ],
  likesByArtwork: [
    { _id: "artworkId", count: 12 }
  ],
  reviewsByArtwork: [
    { _id: "artworkId", count: 8 }
  ],
  timestamp: 2024-01-15T10:30:00.000Z
}
```

---

### 7. Visitor Feedback Endpoint
**Endpoint**: `GET /api/feedback`

**Response**:
```javascript
{
  feedback: [
    {
      _id: "607f1f77bcf86cd799439011",
      visitorName: "Visitor 550e8400...",
      rating: 5,
      feedback: "Amazing artwork!",
      artworkId: "507f1f77bcf86cd799439011",
      createdAt: 2024-01-15T10:30:00.000Z
    }
  ],
  count: 19
}
```

---

## Console Logs to Watch For

**Backend Console** (while server running):

```
❤️ Like added for artwork 507f1f77bcf86cd799439011 by session 550e8400...
💔 Like removed for artwork 507f1f77bcf86cd799439011 by session 550e8400...
⭐ Review submitted (5 stars) for artwork 507f1f77bcf86cd799439011 by session 550e8400...
📊 Dashboard: 42 visitors, 156 events
```

**Frontend Console** (browser DevTools):

```
Session ID: 550e8400-e29b-41d4-a716-446655440000_1234567890123
Like toggled for artwork 507f1f77bcf86cd799439011
Review submitted with rating: 5
```

---

## Common Issues & Fixes

### Issue: Dashboard shows 208 bytes response
**Cause**: Data not flowing or filtered out by date range
**Fix**: 
1. Check analytics collection has data: `/api/admin/analytics-debug`
2. Remove date filters to get all data
3. Check browser DevTools Network tab - response size should increase

### Issue: Like button not showing as liked after refresh
**Cause**: Session ID might be different or not persisting
**Fix**: 
1. Verify localStorage key: `museum-session-id`
2. Check same sessionId sent with like check request
3. Look for browser privacy mode - might block localStorage

### Issue: Reviews not appearing in admin dashboard
**Cause**: eventType might be different or timestamp filtering
**Fix**:
1. Check `/api/admin/analytics-debug` for review_submitted events
2. Check timestamps - might be filtered by date range
3. Verify reviews actually inserted in `reviews` collection

### Issue: HTTP 304 "Not Modified" on repeated requests
**Cause**: Browser caching
**Fix**: ✅ Already fixed with cache-control headers

---

## Data Flow Diagram

```
Frontend                Backend              Database
────────────────────────────────────────────────────

User clicks like
        │
        ├─→ POST /api/reviews/artworkId/like {sessionId}
        │                                        │
        │                                        ├─→ Check if like exists
        │                                        │
        │                                        ├─→ If exists: delete from 'likes'
        │                                        │   Record 'like_removed' in 'analytics'
        │                                        │
        │                                        ├─→ If not exists: insert into 'likes'
        │                                        │   Record 'like_added' in 'analytics'
        │                                        │
        │                    {liked, totalLikes} ←┤
        │←─────────────────────────────────────────
        │
        └─→ Update UI heart icon

Admin navigates to dashboard
        │
        ├─→ GET /api/admin/dashboard
        │                                        │
        │                                        ├─→ Count unique sessions from 'analytics'
        │                                        │
        │                                        ├─→ Aggregate 'analytics':
        │                                        │   - Filter by eventType
        │                                        │   - Group by artworkId
        │                                        │   - Calculate metrics
        │                                        │
        │                    {dashboard data}    ←┤
        │←─────────────────────────────────────────
        │
        └─→ Render charts and metrics
```

---

## Quick Testing Commands

### Terminal: Test Like Endpoint
```bash
curl -X POST http://localhost:5000/api/reviews/507f1f77bcf86cd799439011/like \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-session-123"}'
```

### Terminal: Test Review Endpoint
```bash
curl -X POST http://localhost:5000/api/reviews/507f1f77bcf86cd799439011/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"test-session-123",
    "rating":5,
    "comment":"Amazing!"
  }'
```

### Terminal: Test Dashboard Endpoint
```bash
curl http://localhost:5000/api/admin/dashboard
```

### Terminal: Test Analytics Debug
```bash
curl http://localhost:5000/api/admin/analytics-debug
```

### Terminal: Test Feedback Endpoint
```bash
curl http://localhost:5000/api/feedback
```

---

## Expected Behavior Summary

| Action | Before | After | Where |
|--------|--------|-------|-------|
| User visits artwork | SessionId generated | Stored in localStorage | Browser DevTools |
| User clicks like | Heart filled | Analytics event recorded | `/api/admin/analytics-debug` |
| User submits review | Form cleared | Analytics event recorded | `/api/admin/analytics-debug` |
| Admin views dashboard | Data loads | Shows topArtworks, engagement | `/admin` page |
| Same user likes twice | Like removed | netLikes updated correctly | Dashboard |
| New visitor comes | Fresh session | Counted as new visitor | Dashboard totalVisitors |

---

## Next Steps

1. ✅ Verify all endpoints respond correctly
2. ✅ Test like/review flow end-to-end
3. ✅ Check admin dashboard displays data
4. ✅ Monitor console logs for event tracking
5. 🔄 Monitor for any remaining issues

---

## Files Modified/Created This Session

### Backend
- `src/controllers/reviewController.js` - Like/review logic
- `src/controllers/adminController.js` - Dashboard aggregation fixed
- `src/routes/reviews.js` - Like/review endpoints
- `src/routes/feedback.js` - Feedback aggregation endpoint
- `src/app.js` - Registered feedback route

### Frontend
- `lib/session-id.ts` - Session management
- `components/artwork-detail/like-button.tsx` - Like UI
- `components/artwork-detail/reviews-display.tsx` - Reviews list
- `components/artwork-detail/feedback-form.tsx` - Form submission
- `app/artwork/[id]/page.tsx` - Integrated components

---

## Version Info

- Node.js: 16+
- MongoDB: 4.0+
- Next.js: 16.0.0
- Express: 4.18.2

---

## Support

For issues:
1. Check `/api/admin/analytics-debug` for raw data
2. Check browser console for frontend errors
3. Check server console for backend logs
4. Verify MongoDB connection with `GET /api/health`

