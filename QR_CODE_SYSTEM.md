# QR Code System Documentation

## 📱 Overview

A complete QR code generation, management, and navigation system that enables visitors to scan QR codes and instantly view artwork details.

### ✅ How It Works

1. **QR Code Generation** → QR code is auto-generated when artwork is uploaded
2. **Direct Navigation** → QR encodes full URL to artwork detail page: `/artwork/{id}`
3. **Visitor Scanning** → Visitor scans QR → Browser navigates to `/artwork/{id}`
4. **Admin Management** → Admin can view, download, and regenerate QR codes

---

## 🎯 Key Features

### For Visitors 👥
- ✅ Scan QR code with phone camera or QR scanner app
- ✅ **Automatically navigated** to artwork detail page
- ✅ View artwork story, images, audio guides, 3D models
- ✅ Leave feedback and reviews
- ✅ View related artworks

### For Admins 👨‍💼
- ✅ View all QR codes in admin dashboard at `/admin/qr-codes`
- ✅ Download QR codes as PNG files for printing
- ✅ Regenerate individual QR codes if needed
- ✅ Bulk generate/regenerate all QR codes at once
- ✅ See generation dates for each QR code

---

## 🔄 Technical Architecture

### Backend Components

**File:** `backend/src/utils/qrGenerator.js`
```javascript
// Generates QR code that embeds full URL
generateQRCode(artworkId)
  → Encodes: http://localhost:3000/artwork/{artworkId}
  → Generates: 300x300px PNG image
  → Uploads: To Cloudinary (artworks/qrcodes folder)
  → Returns: Secure URL

// Generate multiple QR codes
generateBulkQRCodes(artworkIds)
  → Processes array of artwork IDs
  → Returns: {success, failed, details}
```

**File:** `backend/src/controllers/adminController.js`
- Modified `uploadArtwork()` method
- Auto-generates QR code after artwork insertion
- Updates artwork with `qrCode: { url, generatedAt }`
- Gracefully handles failures (doesn't break upload)

**File:** `backend/src/routes/admin.js`
- `POST /admin/qr-codes/bulk-generate` - Generate all QR codes
- `POST /admin/qr-codes/:artworkId/regenerate` - Regenerate specific QR
- `GET /admin/qr-codes/:artworkId` - Retrieve QR code info

### Frontend Components

**File:** `frontend/components/admin/qr-code-manager.tsx`
- Grid display of all artworks with QR thumbnails
- Download button for each QR code
- Per-artwork regenerate button
- Bulk generate button for all artworks
- Error/success message handling
- Loading states and authentication

**File:** `frontend/app/admin/qr-codes/page.tsx`
- Dedicated page for QR code management
- Authentication check (redirects to login if not authenticated)
- Responsive layout with Navbar and Footer

**File:** `frontend/components/navbar.tsx` - UPDATED
```typescript
const handleQRScan = (scannedData: string) => {
  // Parse QR code data: strips "artwork:" prefix if present
  let artworkId = scannedData;
  if (scannedData.startsWith('artwork:')) {
    artworkId = scannedData.replace('artwork:', '');
  }
  // Navigate to artwork detail page
  router.push(`/artwork/${artworkId}`)
  setQRScannerOpen(false)
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ARTWORK UPLOAD                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│        Admin uploads artwork via /admin/upload              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│   Backend: insertOne() → artwork saved to MongoDB           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│   AUTO-GENERATE QR CODE (try-catch, doesn't fail upload)   │
│   • Encodes: http://localhost:3000/artwork/{id}            │
│   • Generates: 300x300px PNG                               │
│   • Uploads: Cloudinary/artworks/qrcodes                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│   Update artwork: { qrCode: { url, generatedAt } }         │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────┐          ┌──────────────────────┐
│   ADMIN DASHBOARD    │          │   VISITOR SCANNING   │
│  /admin/qr-codes     │          │  Scan QR Code        │
├──────────────────────┤          ├──────────────────────┤
│ • View all QR codes  │          │ Opens URL from QR    │
│ • Download PNG       │          │ Browser navigates to │
│ • Regenerate         │          │ /artwork/{id}        │
│ • Bulk generate      │          │ Detail page loads    │
└──────────────────────┘          └──────────────────────┘
```

---

## 🚀 Usage Guide

### For Visitors: Scanning QR Codes

1. **Find a QR Code** (on museum display, printed materials, etc.)
2. **Open Camera App** or dedicated QR scanner
3. **Point at QR Code** - Camera recognizes it
4. **Tap the Notification** that appears
5. **Browser Opens** → Automatically navigated to artwork detail page
6. **View Artwork** → Full details, audio guides, 3D models, etc.

### For Admins: Managing QR Codes

#### Access QR Manager
1. Navigate to `/admin` dashboard
2. Click **QR Code Manager** or go to `/admin/qr-codes`
3. Must be authenticated with valid JWT token

#### Download Single QR Code
1. Locate artwork in grid
2. Click **Download** button
3. PNG file saves as `qr-{artwork-title}.png`
4. Print or share the QR code

#### Regenerate Individual QR Code
1. Click **Regenerate** button on artwork card
2. Shows loading indicator
3. QR code updates in Cloudinary
4. Grid refreshes with new QR

#### Generate All QR Codes
1. Click **Generate All QR Codes** button (top right)
2. System generates QR for all artworks
3. Shows progress and final count
4. Grid automatically refreshes

---

## 🔌 API Endpoints

### QR Code Generation

**POST** `/admin/qr-codes/bulk-generate`
```
Authentication: Required (JWT Bearer token)

Response: {
  message: "QR codes generated successfully",
  summary: {
    total: 15,
    success: 15,
    failed: 0
  },
  results: [...]
}
```

**POST** `/admin/qr-codes/:artworkId/regenerate`
```
Authentication: Required (JWT Bearer token)
Param: artworkId (MongoDB ObjectId)

Response: {
  message: "QR code regenerated successfully",
  artworkId: "690935fc6c7c57c30431c547",
  title: "Artwork Title",
  qrCode: {
    url: "https://cloudinary.com/...",
    generatedAt: "2025-11-04T..."
  }
}
```

**GET** `/admin/qr-codes/:artworkId`
```
Authentication: Required (JWT Bearer token)
Param: artworkId (MongoDB ObjectId)

Response: {
  artworkId: "690935fc6c7c57c30431c547",
  title: "Artwork Title",
  qrCode: {
    url: "https://cloudinary.com/...",
    generatedAt: "2025-11-04T..."
  }
}
```

---

## 🌐 Environment Configuration

### Backend `.env`

```env
# For QR code URLs embedded in QR images
FRONTEND_URL=http://localhost:3000

# For production
# FRONTEND_URL=https://your-domain.com
```

### Frontend `.env.local`

Already configured - no changes needed.

---

## 📁 File Structure

```
backend/
├── src/
│   ├── utils/
│   │   └── qrGenerator.js          ← QR generation logic
│   ├── controllers/
│   │   └── adminController.js      ← Auto-gen on upload
│   └── routes/
│       └── admin.js                ← QR management endpoints

frontend/
├── app/
│   └── admin/
│       └── qr-codes/
│           └── page.tsx            ← QR manager page
├── components/
│   ├── admin/
│   │   └── qr-code-manager.tsx    ← QR display & management
│   └── navbar.tsx                  ← QR scanner handling
```

---

## 🧪 Testing Checklist

- [ ] Upload new artwork → QR code auto-generated ✅
- [ ] Admin can access `/admin/qr-codes` page ✅
- [ ] View QR code thumbnail for each artwork ✅
- [ ] Download QR code as PNG file ✅
- [ ] Regenerate individual QR code ✅
- [ ] Bulk generate all QR codes ✅
- [ ] Scan QR with phone camera → Navigates to artwork ✅
- [ ] QR code shows correct artwork details page ✅
- [ ] Visitor can view full artwork information ✅
- [ ] Error handling works (network failures, etc.) ✅

---

## 🔒 Security

- ✅ All admin endpoints require JWT authentication
- ✅ QR codes stored in Cloudinary with secure URLs
- ✅ Artwork IDs used are MongoDB ObjectIds (non-sequential)
- ✅ QR data contains full URL (not just ID)
- ✅ Admin token required for QR management operations

---

## 📊 Analytics Integration

When a visitor scans a QR code and views an artwork:
- `artwork_view` event is recorded
- Session ID is tracked
- Timestamp recorded
- Helps analyze which artworks are most scanned

---

## 🔧 Troubleshooting

### QR Code Not Generating
1. Check Cloudinary credentials in `.env`
2. Verify `FRONTEND_URL` is set in backend `.env`
3. Check backend logs for errors
4. Try regenerating from admin panel

### QR Code Not Navigating
1. Verify QR code is scanned properly
2. Check browser console for errors
3. Verify artwork ID is valid in database
4. Try manual navigation to `/artwork/{id}`

### Admin Can't See QR Manager
1. Verify admin is authenticated (JWT token in localStorage)
2. Check browser console for errors
3. Verify backend endpoints are accessible
4. Try logging out and back in

### Download Not Working
1. Check browser download settings
2. Verify CORS is enabled on backend
3. Try different browser
4. Check file size (should be small PNG)

---

## 📈 Future Enhancements

- [ ] QR code batch export as ZIP file
- [ ] Custom QR code branding/logo in center
- [ ] Analytics dashboard showing QR scan rates
- [ ] Multiple QR codes per artwork (different languages)
- [ ] Dynamic QR codes with tracking
- [ ] Mobile app integration

---

## 📝 Summary

The QR code system provides a seamless bridge between physical museum experiences and digital artwork information. When visitors scan the QR codes, they're automatically taken to the complete artwork details with support for:

- 📖 Detailed stories and descriptions
- 🎧 Audio guides
- 📹 Video content
- 🗿 3D model viewers
- ⭐ Ratings and reviews
- 💬 AI-powered chatbot assistance
- 🌍 Multi-language translation

Admins have full control to manage, download, and regenerate QR codes through an intuitive interface.

---

*Last Updated: November 4, 2025*
*System Status: ✅ Fully Operational*
