# PhotoConnect v2 — Professional Photographer Booking Platform

## New in v2
- Video uploads (MP4, MOV, AVI, MKV, WebM) alongside all photo formats
- Forgot Password with 6-digit OTP via email
- Multi-step Registration with password strength checker + confirm password
- Extended photographer profile: tagline, equipment, languages, highlights, per-category pricing
- Interactive home: rotating hero text, lightbox, masonry feed, video preview cards
- Animated navbar with dropdown, mobile hamburger menu
- Upload progress bar for videos
- Aspect-based reviews (Quality, Communication, Punctuality, Value)
- Search by name, city, or tagline

## Quick Start

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI, Cloudinary keys, and Gmail credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## .env Setup (backend/.env)

| Key | Where to get it |
|-----|----------------|
| MONGO_URI | mongodb.com/atlas → Connect → Drivers |
| JWT_SECRET | Any long random string |
| CLOUDINARY_* | cloudinary.com → Dashboard |
| EMAIL_USER | Your Gmail address |
| EMAIL_PASS | Gmail → Settings → 2FA → App Passwords → Generate |

## Gmail App Password (for OTP emails)
1. Go to myaccount.google.com
2. Security → 2-Step Verification → Turn ON
3. Security → App passwords → Select app: Mail → Generate
4. Copy the 16-character password into EMAIL_PASS

## Features by Role

### Photographer
- Multi-step profile: bio, tagline, location, equipment, languages, highlights
- Upload photos in any format + videos up to 500MB
- Upload progress bar for large videos
- Set pricing per category
- Accept / Decline / Complete bookings
- Cover photo + avatar upload

### Customer
- Browse photographers with search + category + sort filters
- Photo & video feed with lightbox viewer
- Book with event details, date range, budget, hours, people count
- Track bookings with status
- Leave detailed reviews with star ratings per aspect

### Forgot Password Flow
1. Enter email → OTP sent
2. Enter 6-digit OTP (individual boxes, paste-supported, 60s resend timer)
3. Set new password with confirm password check
