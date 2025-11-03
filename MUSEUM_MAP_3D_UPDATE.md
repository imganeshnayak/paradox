# Museum Map 3D Model Integration

## Overview
Updated the Museum Map to display **real artwork data from the backend** with support for both **2D images** (paintings) and **3D models** (sculptures).

## Changes Made

### 1. **Data Fetching from Backend**
- Fetches artworks from `/api/artworks` endpoint (uses `NEXT_PUBLIC_BACKEND_URL` or defaults to `http://localhost:5000`)
- Maps backend data to artwork locations with:
  - Real artwork titles, artists, images
  - 3D model URLs (for sculptures)
  - Artwork type (painting or sculpture)
  - Random floor distribution (Floor 1 & 2)

### 2. **Artwork Preview Overlay Component**
**File:** `components/museum-map/artwork-preview-overlay.tsx`

Features:
- ✅ **3D Model Display**: Shows `Model3DViewer` for sculptures with rotating view
- ✅ **Image Display**: Shows artwork image for paintings
- ✅ **Golden Frame**: Elegant gradient border (like museum frame)
- ✅ **3D Badge**: Shows "3D" badge for sculptures with Cuboid icon
- ✅ **Loading States**: Spinner while content loads
- ✅ **Error Handling**: Fallback UI if image/model fails
- ✅ **Positioned on Map**: Overlay appears at marker coordinates

### 3. **Museum Map Component Updates**
**File:** `components/museum-map/museum-map.tsx`

Changes:
- Imports `ArtworkPreviewOverlay` instead of `ArtworkPreviewModal`
- Fetches real data with proper field mapping:
  - `artwork.images[0].url` → `imageUrl`
  - `artwork.model3D.url` or `artwork.model3d.url` → `model3DUrl`
  - `artwork.type` → determines if sculpture (3D) or painting (image)
- Data includes both formats for backward compatibility
- Falls back to sample data if API unavailable

## Data Field Mapping

```typescript
// Backend response → Frontend data
{
  _id: artwork.id,
  title: artwork.title,
  artist: artwork.artist,
  images[0].url: artwork.imageUrl,
  model3D.url or model3d.url: artwork.model3DUrl,
  type: "painting" | "sculpture"
}
```

## How It Works

1. **User clicks artwork marker** on the SVG map
2. **Overlay popup appears** with:
   - For **Sculptures**: 3D model viewer with rotating view
   - For **Paintings**: High-quality artwork image
   - Golden frame styling around content
   - Title, Artist, 3D badge (if sculpture)
   - "View Details" button to full artwork page
3. **Close button** or clicking outside closes the overlay

## Visual Indicators

- **3D Badge**: Appears in top-right of popup for sculptures
- **Cuboid Icon**: Indicates 3D model
- **Golden Frame**: Museum-style framing with gradients
- **Loading Spinner**: While 3D model or image loads

## Fallback Behavior

If backend API fails:
- Uses sample hardcoded artworks
- Ensures map still functions
- Shows error message at top of map

## Testing

1. Start backend: `npm start` (in `/backend`)
2. Start frontend: `npm run dev` (in `/frontend`)
3. Navigate to `/museum-map`
4. Click any golden marker on the map
5. See artwork preview with real data:
   - Real images for paintings
   - 3D rotating models for sculptures
   - Real titles and artist names

## Supported Artwork Types

| Type | Display | Icon |
|------|---------|------|
| Painting | High-res 2D Image | 📷 |
| Sculpture | 3D Model Viewer | 🧊 3D |

## Browser Compatibility

- ✅ Chrome/Edge (WebGL support)
- ✅ Firefox (WebGL support)
- ✅ Safari (WebGL support)
- Requires modern browser with Three.js support for 3D models

## Next Steps

- Add interactive map with draggable artworks
- Save user preferences for floor visited
- Add audio descriptions for sculptures
- Implement virtual tour mode
