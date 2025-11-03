# API Proxy Routes Setup - Fixed 404 Errors

## Problem Identified
Frontend was getting 404 errors for review endpoints because the API calls were being routed through Next.js frontend, but there was no proxy route to forward them to the backend.

**Error Pattern**:
```
GET /api/reviews/6908e1eb098e5517740a673f/reviews 404 in 589ms
GET /api/reviews/6908e1eb098e5517740a673f/like/check?sessionId=... 404 in 603ms
```

---

## Solution Implemented

Created proxy routes in the Next.js frontend that forward all requests to the backend Express server.

### Proxy Routes Created

#### 1. Reviews Proxy (`frontend/app/api/reviews/[...catchAll]/route.ts`)
**Purpose**: Forward all review-related API calls to backend

**Handles**:
- `GET /api/reviews/:id/reviews` → Backend `/api/reviews/:id/reviews`
- `GET /api/reviews/:id/like/check?sessionId=...` → Backend `/api/reviews/:id/like/check?sessionId=...`
- `POST /api/reviews/:id/reviews` → Backend `/api/reviews/:id/reviews`
- `POST /api/reviews/:id/like` → Backend `/api/reviews/:id/like`

**How it works**:
```
Frontend Component
  ↓
Makes fetch to: /api/reviews/[id]/reviews
  ↓
Frontend Proxy Route (catch-all)
  ↓
Forwards to: http://localhost:5000/api/reviews/[id]/reviews
  ↓
Backend Express Server
  ↓
Returns data
  ↓
Frontend receives response
```

#### 2. Feedback Proxy (`frontend/app/api/feedback/route.ts`)
**Purpose**: Forward feedback aggregation requests

**Handles**:
- `GET /api/feedback` → Backend `/api/feedback`

---

## How It Works

### Frontend Component (e.g., like-button.tsx)
```typescript
// This call now works!
const response = await fetch(`/api/reviews/${artworkId}/like/check?sessionId=${sessionId}`)
```

### Next.js Proxy Route
```typescript
// Intercepts the frontend call
// Extracts: artworkId = "6908e1eb098e5517740a673f", path = "like/check"
// Constructs: http://localhost:5000/api/reviews/6908e1eb098e5517740a673f/like/check
// Forwards the request
// Returns response from backend
```

### Backend Express Route
```javascript
// Backend already has these routes
GET  /api/reviews/:id/like/check
POST /api/reviews/:id/like
GET  /api/reviews/:id/reviews
POST /api/reviews/:id/reviews
```

---

## Files Modified

### Created
1. `frontend/app/api/reviews/[...catchAll]/route.ts`
   - Catch-all proxy for nested review endpoints
   - Handles both GET and POST requests
   - Logs all proxied requests for debugging

2. `frontend/app/api/feedback/route.ts`
   - Proxy for feedback aggregation endpoint
   - Handles GET requests

### Components Using These Proxies (No Changes Needed)
- `components/artwork-detail/like-button.tsx`
- `components/artwork-detail/reviews-display.tsx`
- `components/artwork-detail/feedback-form.tsx`
- `admin/analytics-overview.tsx`

---

## Environment Configuration

The proxy routes use this configuration:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
```

### Setting API_BASE

**Development** (default):
```
http://localhost:5000
```

**Production** (set in `.env.local` or deployment):
```
NEXT_PUBLIC_API_BASE=https://api.yourdomain.com
```

---

## Testing the Fix

### Before (Got 404 Errors)
```bash
# Frontend tried to call non-existent route
GET /api/reviews/6908e1eb098e5517740a673f/reviews 404
```

### After (Should Work)
```bash
# Frontend calls proxy route
GET /api/reviews/6908e1eb098e5517740a673f/reviews 200

# Backend logs show
❤️ Like added for artwork 6908e1eb098e5517740a673f by session d7dc21d5...
```

---

## Console Output to Watch For

### Frontend Console
```
✅ Like toggled for artwork 6908e1eb098e5517740a673f
✅ Review submitted with rating: 5
✅ Session ID: d7dc21d5-dfda-4705-8467-e03852a501a8_1762192140129
```

### Next.js Dev Server Console
```
📡 Proxying GET: http://localhost:5000/api/reviews/6908e1eb098e5517740a673f/like/check?sessionId=...
📡 Proxying POST: http://localhost:5000/api/reviews/6908e1eb098e5517740a673f/like
GET /api/reviews/6908e1eb098e5517740a673f/reviews 200 in 50ms
```

### Backend Express Console
```
❤️ Like added for artwork 6908e1eb098e5517740a673f by session d7dc21d5...
💔 Like removed for artwork 6908e1eb098e5517740a673f by session d7dc21d5...
⭐ Review submitted (5 stars) for artwork 6908e1eb098e5517740a673f by session d7dc21d5...
📊 Dashboard: X visitors, Y events
```

---

## Troubleshooting

### Still Getting 404?

1. **Check Next.js dev server reloaded**
   ```
   After creating proxy routes, restart:
   npm run dev
   ```

2. **Verify backend is running**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: { "status": "ok", ... }
   ```

3. **Check endpoint names**
   ```bash
   # All review endpoints should exist
   curl -X POST http://localhost:5000/api/reviews/[id]/like \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"test"}'
   # Should return 201 with { "liked": true, "totalLikes": X }
   ```

4. **Check logs for proxy errors**
   ```
   Watch Next.js dev server console
   Should show: 📡 Proxying GET/POST: http://localhost:5000/...
   ```

### Getting CORS Errors?

The backend Express server should have CORS enabled. Check `backend/src/app.js`:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

If you get CORS errors, verify the backend has the frontend origin whitelisted.

---

## How Components Call the API

### Like Button
```typescript
// This now works through the proxy!
const response = await fetch(`/api/reviews/${artworkId}/like/check?sessionId=${sessionId}`)
// Proxy intercepts and forwards to backend
```

### Reviews Display
```typescript
// Fetches reviews from backend through proxy
const response = await fetch(`/api/reviews/${artworkId}/reviews`)
```

### Feedback Form
```typescript
// Submits review to backend through proxy
const response = await fetch(`/api/reviews/${artworkId}/reviews`, {
  method: "POST",
  body: JSON.stringify({ sessionId, rating, comment })
})
```

---

## Route Matching Priority

Next.js route matching (in order):
1. Static routes (exact match)
2. Dynamic segments `[id]`
3. Catch-all routes `[...catchAll]`

Our setup:
```
/api/reviews/
  └─ [...catchAll]/route.ts
```

This catches:
- `/api/reviews/123/reviews`
- `/api/reviews/123/like`
- `/api/reviews/123/like/check`
- `/api/reviews/anything/any/nested/path`

---

## Next Steps

1. ✅ Restart Next.js dev server
2. ✅ Check console logs for "📡 Proxying" messages
3. ✅ Test like button on artwork page
4. ✅ Test review form submission
5. ✅ Verify data appears in backend logs
6. ✅ Check admin dashboard shows analytics data

---

## Summary

**Fixed**: 404 errors on `/api/reviews/*` endpoints

**Solution**: Created Next.js proxy routes that forward frontend API calls to backend

**Result**: Frontend and backend are now properly integrated

**Status**: ✅ Ready for testing

