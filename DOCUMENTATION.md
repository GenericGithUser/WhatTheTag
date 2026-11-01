# WhatTheTag - Complete System Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Main Application (Scanner)](#main-application-scanner)
4. [Admin Site](#admin-site)
5. [Data Model](#data-model)
6. [Firebase Configuration](#firebase-configuration)
7. [Asset Number System](#asset-number-system)
8. [PWA & TWA Support](#pwa--twa-support)
9. [Theme & Design](#theme--design)
10. [Deployment Guide](#deployment-guide)
11. [Testing Guide](#testing-guide)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### What is WhatTheTag?

**WhatTheTag** is a comprehensive inventory management system designed for tracking physical assets using QR codes and barcodes. It consists of two separate applications that work together:

1. **Main Application (Scanner)** - A Progressive Web App (PWA) that allows users to scan QR codes on inventory items and view their details
2. **Admin Site** - A web-based management interface for creating, editing, and deleting inventory assets

### Purpose

The system solves the problem of:
- **Asset Tracking** - Keep track of physical items in an organization
- **Quick Access** - Scan a QR code to instantly see asset details
- **Inventory Management** - Add, edit, and remove assets with proper tracking
- **Status Monitoring** - Track the condition of assets (Good, Has Defects, BAD)
- **Ownership** - Know who is responsible for each asset

### Key Features

✅ QR code and barcode scanning
✅ Real-time asset lookup
✅ Auto-generated asset numbers (AST-001, AST-002, etc.)
✅ Asset number preservation (deleted numbers are never reused)
✅ Status tracking (Good, Has Defects, BAD)
✅ Category classification (Fixed, Electronics)
✅ Image support for visual identification
✅ Owner assignment
✅ PWA support (installable on mobile devices)
✅ TWA support (runs as native Android app without browser UI)
✅ Email/password authentication for admin operations
✅ Beautiful Gruvbox light theme

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Cloud                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Firestore   │  │     Auth     │  │   Hosting    │     │
│  │  Database    │  │  (Email/PW)  │  │  (2 sites)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
         │                    │                    │
┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐
│   Main App      │  │   Admin Site    │  │   Firebase      │
│   (Scanner)     │  │   (Management)  │  │   Console       │
│                 │  │                 │  │                 │
│ • QR Scanning   │  │ • Login/Logout  │  │ • User Mgmt     │
│ • Asset Lookup  │  │ • CRUD Ops      │  │ • Data View     │
│ • PWA/TWA       │  │ • Asset Numbers │  │ • Rules         │
│ • Public Read   │  │ • Auth Required │  │ • Analytics     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
   your-project         your-project        console.firebase
     .web.app           -admin.web.app      .google.com
```

### Technology Stack

**Main Application:**
- React 18 with TypeScript
- Ionic React (mobile UI framework)
- Firebase Firestore (database)
- html5-qrcode (QR/barcode scanning)
- Tailwind CSS (styling)
- Vite (build tool)

**Admin Site:**
- React 18 with TypeScript
- Material-UI (MUI) (UI components)
- Firebase Firestore (database)
- Firebase Authentication (email/password)
- React Router (navigation)
- Vite (build tool)

**Backend:**
- Firebase Firestore (NoSQL database)
- Firebase Authentication (user management)
- Firebase Hosting (static site hosting)

---

## 📱 Main Application (Scanner)

### Purpose

The main application is a **Progressive Web App (PWA)** designed for end-users to quickly scan and view inventory asset details. It's optimized for mobile devices and can be installed as a native app.

### Features

#### 1. QR Code Scanning
- Uses device camera to scan QR codes and barcodes
- Supports multiple formats: QR_CODE, CODE_128, CODE_39, EAN_13
- Real-time scanning with visual feedback
- Works on both mobile and desktop (with camera)

#### 2. Manual Search
- Enter asset number manually
- Useful when QR code is damaged or unavailable
- Case-insensitive search

#### 3. Asset Details View
- Displays comprehensive asset information:
  - Asset number
  - Item name
  - Description
  - Category (Fixed/Electronics)
  - Status (Good/Has Defects/BAD)
  - Designated owner
  - Image
  - Last updated date

#### 4. Dashboard
- View all inventory items
- Filter by status and category
- Search functionality
- Statistics cards showing counts

#### 5. PWA Features
- Installable on mobile devices
- Works offline (cached assets)
- Service worker for background sync
- Add to home screen

#### 6. TWA Support
- Runs as native Android app
- No browser UI (full-screen)
- Can be distributed via Google Play Store
- Uses Digital Asset Links for verification

### User Flow

```
User opens app
    ↓
Sees dashboard with all assets
    ↓
Clicks scan button OR enters asset number manually
    ↓
Camera opens (if scanning)
    ↓
User points at QR code
    ↓
System decodes QR code
    ↓
Looks up asset in Firestore
    ↓
Displays asset details
    ↓
User can view full details or scan again
```

### Access Control

- **Public Read Access** - Anyone can scan and view assets
- **No Authentication Required** - Quick access for all users
- **No Write Access** - Users cannot modify data (admin only)

### File Structure

```
src/
├── pages/
│   ├── Dashboard.tsx       # Main dashboard with asset list
│   ├── Scanner.tsx         # QR scanning interface
│   └── ItemDetail.tsx      # Individual asset details
├── data/
│   └── inventory.ts        # Data service layer
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main app with routing
└── main.tsx                # Entry point
```

---

## 🔐 Admin Site

### Purpose

The admin site is a **secure web application** for managing inventory assets. It requires authentication and provides full CRUD (Create, Read, Update, Delete) operations.

### Features

#### 1. Authentication
- Email/password login
- Protected routes (all pages require login)
- Session persistence
- Logout functionality
- User display in header

#### 2. Dashboard
- View all inventory items in a table
- Statistics cards:
  - Total assets
  - Assets by status (Good, Has Defects, BAD)
  - Assets by category (Fixed, Electronics)
- Quick actions: Edit or Delete assets

#### 3. Add New Asset
- **Auto-generated asset number** - System calculates next available number
- Form fields:
  - Item Name (required)
  - Item Description (required)
  - Category (Fixed/Electronics)
  - Status (Good/Has Defects/BAD)
  - Designated Owner (required)
  - Image URL (required)
- Validation before submission
- Success/error feedback

#### 4. Edit Asset
- Load existing asset data
- Asset number is read-only (cannot be changed)
- Modify all other fields
- Updates timestamp automatically

#### 5. Delete Asset
- Confirmation dialog
- **Asset number preservation** - Deleted numbers are stored and never reused
- Records deletion reason (optional)
- Updates deleted_assets collection

#### 6. Deleted Assets Log
- View all deleted asset numbers
- See deletion date and time
- See reason for deletion
- These numbers will never be reused

### User Flow

```
User visits admin site
    ↓
Redirected to login page (if not authenticated)
    ↓
Enters email and password
    ↓
Firebase validates credentials
    ↓
Redirected to dashboard
    ↓
Can add, edit, or delete assets
    ↓
All changes saved to Firestore
    ↓
Click logout when done
```

### Access Control

- **Authentication Required** - Must login to access
- **Authenticated Users** - Can perform all CRUD operations
- **Public Read** - Main app can still read data (for scanning)

### File Structure

```
admin/src/
├── components/
│   ├── Layout.tsx              # Main layout with navigation
│   └── ProtectedRoute.tsx      # Route protection
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Dashboard.tsx           # Asset list and stats
│   ├── AddAsset.tsx            # Add new asset form
│   ├── EditAsset.tsx           # Edit existing asset
│   └── DeletedAssets.tsx       # View deleted numbers
├── AuthContext.tsx             # Authentication state
├── firebase.ts                 # Firebase config
├── inventoryService.ts         # CRUD operations
├── types.ts                    # TypeScript types
├── theme.ts                    # Gruvbox theme
└── App.tsx                     # Main app with routing
```

---

## 📊 Data Model

### Inventory Item Structure

```typescript
interface InventoryItem {
  id: string;                    // Auto-generated by Firestore
  assetNumber: string;           // e.g., "AST-001"
  itemName: string;              // e.g., "Dell Laptop"
  itemDescription: string;       // Detailed description
  category: "Fixed" | "Electronics";
  status: "Good" | "Has Defects" | "BAD";
  designatedOwner: string;       // e.g., "John Smith"
  image: string;                 // URL to image
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Firestore Collections

#### 1. `inventory` (Main Collection)
Stores all active inventory items.

**Access:**
- Read: Public (for main app scanning)
- Write: Authenticated users only (admin site)

**Example Document:**
```json
{
  "id": "abc123",
  "assetNumber": "AST-001",
  "itemName": "Dell OptiPlex 7090",
  "itemDescription": "Desktop computer with Intel i7, 16GB RAM",
  "category": "Electronics",
  "status": "Good",
  "designatedOwner": "John Smith",
  "image": "https://example.com/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 2. `deleted_assets` (Admin Only)
Tracks all deleted asset numbers to prevent reuse.

**Access:**
- Read/Write: Authenticated users only

**Example Document:**
```json
{
  "assetNumber": "AST-005",
  "deletedAt": "2024-01-20T14:45:00Z",
  "reason": "Item disposed of"
}
```

#### 3. `counters` (Admin Only)
Stores the next available asset number.

**Access:**
- Read/Write: Authenticated users only

**Example Document:**
```json
{
  "nextNumber": 13,
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

#### 4. `users` (Optional - for role-based access)
Stores user roles for advanced permission management.

**Access:**
- Read: Own document or admin
- Write: Own document (except role) or admin

**Example Document:**
```json
{
  "email": "admin@example.com",
  "role": "admin"
}
```

### Valid Values

#### Category
- `Fixed` - Furniture, fixtures, non-electronic items
- `Electronics` - Computers, printers, devices, etc.

#### Status
- `Good` - Item is in good condition
- `Has Defects` - Item has issues but still usable
- `BAD` - Item is broken or needs replacement

---

## 🔥 Firebase Configuration

### Project Structure

```
Firebase Project
├── Firestore Database
│   ├── inventory (collection)
│   ├── deleted_assets (collection)
│   ├── counters (collection)
│   └── users (collection, optional)
├── Authentication
│   └── Users (email/password)
└── Hosting
    ├── whatthetag-app (main site)
    └── whatthetag-admin (admin site)
```

### Environment Variables

Both applications use the same Firebase project. Configure in `.env.local`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firestore Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Inventory collection
    match /inventory/{itemId} {
      // Public read access (for main app scanning)
      allow read: if true;
      
      // Authenticated users can create, update, delete (admin site)
      allow create: if isAuthenticated() &&
                    request.resource.data.keys().hasAll([
                      'assetNumber', 'itemName', 'itemDescription', 
                      'category', 'status', 'designatedOwner', 'image'
                    ]) &&
                    request.resource.data.category in ['Fixed', 'Electronics'] &&
                    request.resource.data.status in ['Good', 'Has Defects', 'BAD'];
      
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Deleted assets - authenticated only
    match /deleted_assets/{documentId} {
      allow read, write: if isAuthenticated();
    }
    
    // Counters - authenticated only
    match /counters/{documentId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

### Hosting Configuration

```json
{
  "hosting": [
    {
      "target": "app",
      "public": "dist",
      "rewrites": [{ "source": "**", "destination": "/index.html" }],
      "headers": [
        {
          "source": "/sw.js",
          "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
        }
      ]
    },
    {
      "target": "admin",
      "public": "admin/dist",
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  ]
}
```

---

## 🔢 Asset Number System

### Overview

The asset number system ensures:
1. **Auto-generation** - New assets get the next available number
2. **Uniqueness** - No two assets have the same number
3. **Preservation** - Deleted numbers are never reused
4. **Sequential** - Numbers follow a pattern (AST-001, AST-002, etc.)

### How It Works

#### Auto-Generation Process

```
1. User clicks "Add Asset"
    ↓
2. System fetches highest asset number from inventory
    ↓
3. System checks counter document for next number
    ↓
4. Uses the higher of the two values
    ↓
5. Formats as AST-001, AST-002, etc.
    ↓
6. Displays to user before saving
    ↓
7. After save, updates counter document
```

#### Example Flow

**Initial State:**
- Inventory has: AST-001, AST-002, AST-003
- Counter document: `nextNumber: 4`

**Add New Asset:**
- System checks highest: AST-003
- System checks counter: 4
- Uses: 4 (they match)
- New asset gets: AST-004
- Counter updates to: 5

**Delete Asset:**
- User deletes AST-002
- AST-002 stored in `deleted_assets`
- Inventory now has: AST-001, AST-003, AST-004
- Counter remains: 5

**Add Another Asset:**
- System checks highest: AST-004
- System checks counter: 5
- Uses: 5
- New asset gets: AST-005
- **AST-002 is never reused**

### Code Implementation

```typescript
// Get next asset number
export const getNextAssetNumber = async (): Promise<string> => {
  // Get highest from inventory
  const q = query(
    collection(db, INVENTORY_COLLECTION),
    orderBy('assetNumber', 'desc'),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  
  let nextNumber = 1;
  
  if (!querySnapshot.empty) {
    const lastItem = querySnapshot.docs[0].data();
    const match = lastItem.assetNumber.match(/AST-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  // Check counter document
  const counterRef = doc(db, COUNTERS_COLLECTION, 'asset_counter');
  const counterSnap = await getDoc(counterRef);
  
  if (counterSnap.exists()) {
    const counterNumber = counterSnap.data().nextNumber || 1;
    nextNumber = Math.max(nextNumber, counterNumber);
  }
  
  return `AST-${String(nextNumber).padStart(3, '0')}`;
};

// Update counter after adding asset
export const updateAssetCounter = async (assetNumber: string): Promise<void> => {
  const match = assetNumber.match(/AST-(\d+)/);
  if (match) {
    const nextNumber = parseInt(match[1], 10) + 1;
    const counterRef = doc(db, COUNTERS_COLLECTION, 'asset_counter');
    await setDoc(counterRef, { 
      nextNumber, 
      updatedAt: new Date().toISOString() 
    });
  }
};
```

### Why Preserve Deleted Numbers?

1. **Data Integrity** - Prevents confusion if old records reference deleted assets
2. **Audit Trail** - Maintains historical accuracy
3. **QR Code Conflicts** - Old QR codes won't suddenly point to new items
4. **Compliance** - Some industries require asset number preservation

---

## 📲 PWA & TWA Support

### Progressive Web App (PWA)

#### What is a PWA?

A Progressive Web App is a web application that:
- Can be installed on mobile devices
- Works offline
- Provides a native app-like experience
- Uses service workers for background tasks

#### WhatTheTag PWA Features

✅ **Installable** - Users can add to home screen
✅ **Offline Support** - Service worker caches assets
✅ **Fast Loading** - Cached resources load instantly
✅ **Native Feel** - Full-screen mode, no browser UI
✅ **Push Notifications** - Ready for future implementation
✅ **Auto Updates** - Service worker handles updates

#### PWA Configuration

**manifest.json:**
```json
{
  "name": "WhatTheTag",
  "short_name": "WhatTheTag",
  "description": "Scan and manage your inventory assets",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fbf1c7",
  "theme_color": "#ebdbb2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker (sw.js):**
- Caches app shell (HTML, CSS, JS)
- Caches images and assets
- Provides offline fallback
- Handles updates automatically

#### Installation

**On Mobile:**
1. Open app in browser
2. Tap "Add to Home Screen" or install prompt
3. App icon appears on home screen
4. Opens in full-screen mode

**On Desktop:**
1. Open app in Chrome/Edge
2. Click install icon in address bar
3. App installs as desktop application

### Trusted Web Activity (TWA)

#### What is a TWA?

A Trusted Web Activity allows your PWA to:
- Run as a native Android app
- Display without browser UI (no address bar)
- Be distributed via Google Play Store
- Provide a true native experience

#### TWA Configuration

**assetlinks.json:**
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.whatthetag.app",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

**Location:** `public/.well-known/assetlinks.json`

#### Setup Process

1. **Get SHA256 Fingerprint**
   ```bash
   keytool -list -v -keystore your-keystore.jks -alias your-key-alias
   ```

2. **Update assetlinks.json**
   - Replace package name
   - Replace SHA256 fingerprint

3. **Deploy**
   ```bash
   firebase deploy
   ```

4. **Generate Android App**
   - Use PWABuilder: https://www.pwabuilder.com/
   - Or use Bubblewrap CLI
   - Or build manually with Android Studio

5. **Publish to Google Play**
   - Upload APK/AAB
   - Fill in store listing
   - Submit for review

#### Benefits of TWA

✅ **No Browser UI** - Full-screen native experience
✅ **Google Play Distribution** - Reach millions of users
✅ **Native Features** - Access to device capabilities
✅ **Automatic Updates** - Web updates propagate instantly
✅ **Single Codebase** - Same code for web and mobile

---

## 🎨 Theme & Design

### Gruvbox Light Theme

The application uses the **Gruvbox Light** color scheme for a warm, eye-friendly interface.

#### Color Palette

**Backgrounds:**
- `#fbf1c7` - Main background (lightest)
- `#ebdbb2` - Card background
- `#d5c4a1` - Borders and dividers
- `#bdae93` - Disabled states

**Foregrounds:**
- `#282828` - Primary text
- `#3c3836` - Secondary text
- `#504945` - Tertiary text
- `#665c54` - Muted text
- `#7c6f64` - Disabled text

**Semantic Colors:**
- `#98971a` - **Green** - Success, Good status
- `#d79921` - **Yellow** - Warning, Has Defects status
- `#458588` - **Blue** - Primary actions, identifiers
- `#cc241d` - **Red** - Error, BAD status
- `#d65d0e` - **Orange** - Emphasis, FAB buttons
- `#689d6a` - **Aqua** - Fixed category, constants

#### Usage

**Status Colors:**
- Good → Green (#98971a)
- Has Defects → Yellow (#d79921)
- BAD → Red (#cc241d)

**Category Colors:**
- Fixed → Aqua (#689d6a)
- Electronics → Blue (#458588)

**UI Elements:**
- Primary buttons → Blue (#458588)
- FAB button → Orange (#d65d0e)
- Links → Blue (#458588)
- Errors → Red (#cc241d)

### Design Principles

1. **Clarity** - Clear visual hierarchy
2. **Consistency** - Same patterns throughout
3. **Accessibility** - Good contrast ratios
4. **Responsiveness** - Works on all screen sizes
5. **Performance** - Fast loading and interactions

---

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Domain configured (optional)

### Step 1: Install Dependencies

```bash
# Main app
npm install

# Admin site
cd admin
npm install
cd ..
```

### Step 2: Configure Environment

**Main App:**
```bash
cp .env.example .env.local
# Edit .env.local with Firebase credentials
```

**Admin Site:**
```bash
cd admin
cp .env.example .env.local
# Edit .env.local with same Firebase credentials
cd ..
```

### Step 3: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Create admin users in **Authentication** → **Users**

### Step 4: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Step 5: Setup Hosting Targets (One-time)

```bash
firebase target:apply hosting app whatthetag-app
firebase target:apply hosting admin whatthetag-admin
```

### Step 6: Build Applications

```bash
# Build main app
npm run build

# Build admin site
cd admin
npm run build
cd ..
```

### Step 7: Deploy to Firebase

```bash
# Deploy both sites
firebase deploy --only hosting

# Or deploy separately
firebase deploy --only hosting:app
firebase deploy --only hosting:admin
```

### Step 8: Verify Deployment

**Main App:**
- Visit: `https://your-project.web.app`
- Test QR scanning
- Verify dashboard loads

**Admin Site:**
- Visit: `https://your-project-admin.web.app`
- Login with credentials
- Test CRUD operations

### Step 9: (Optional) Setup Custom Domains

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for SSL certificate (can take 24-48 hours)

### Step 10: (Optional) Generate PWA Icons

```bash
# Install sharp
npm install sharp

# Generate icons
node scripts/generate-icons.js
```

### Step 11: (Optional) Configure TWA

1. Get SHA256 fingerprint from your keystore
2. Update `public/.well-known/assetlinks.json`
3. Deploy
4. Use PWABuilder to generate Android app
5. Publish to Google Play

---

## 🧪 Testing Guide

### Main App Testing

#### Manual Testing

1. **QR Scanning**
   - Generate QR codes with asset numbers
   - Scan with app
   - Verify correct asset displays

2. **Manual Search**
   - Enter asset number manually
   - Verify search works
   - Test case-insensitivity

3. **Dashboard**
   - Verify all assets display
   - Test filters (status, category)
   - Test search functionality

4. **Asset Details**
   - Click on asset
   - Verify all fields display correctly
   - Check image loads

#### Automated Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- Dashboard.test.tsx
```

**Test Coverage:**
- Type definitions
- Data service functions
- Component rendering
- User interactions
- Firebase operations
- Integration flows

### Admin Site Testing

#### Manual Testing

1. **Authentication**
   - Login with correct credentials
   - Login with wrong credentials (should fail)
   - Logout
   - Verify protected routes redirect to login

2. **Dashboard**
   - View all assets
   - Check statistics
   - Test edit and delete buttons

3. **Add Asset**
   - Fill form
   - Verify asset number auto-generates
   - Submit and verify asset appears

4. **Edit Asset**
   - Click edit on asset
   - Modify fields
   - Save and verify changes

5. **Delete Asset**
   - Click delete on asset
   - Confirm deletion
   - Verify asset removed
   - Check deleted assets log

#### Automated Testing

```bash
cd admin
npm test
```

### Firebase Testing

#### Firestore Rules Testing

Use Firebase Emulator:

```bash
# Install emulator
firebase init emulators

# Start emulator
firebase emulators:start

# Run tests
npm test -- firestore-rules.test.ts
```

#### Manual Rules Testing

1. Try reading without auth (should work)
2. Try writing without auth (should fail)
3. Login and try writing (should work)

### Performance Testing

#### Lighthouse

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit
5. Aim for 90+ score

#### Load Testing

- Test with 100+ assets
- Verify dashboard loads quickly
- Check search performance
- Test on slow networks

### Cross-Browser Testing

Test on:
- Chrome (desktop & mobile)
- Firefox
- Safari (iOS)
- Edge

### Device Testing

Test on:
- iPhone (Safari)
- Android (Chrome)
- Desktop (multiple browsers)
- Tablet (iPad, Android)

---

## 🔧 Troubleshooting

### Main App Issues

#### QR Scanner Not Working

**Problem:** Camera doesn't open or QR not detected

**Solutions:**
1. Ensure you're on HTTPS or localhost
2. Check camera permissions in browser
3. Verify device has camera
4. Try different browser
5. Use manual entry as fallback

#### Assets Not Loading

**Problem:** Dashboard shows no assets

**Solutions:**
1. Check Firebase credentials in `.env.local`
2. Verify Firestore rules allow read access
3. Check browser console for errors
4. Verify assets exist in Firestore

#### PWA Not Installing

**Problem:** Install prompt doesn't appear

**Solutions:**
1. Ensure HTTPS is enabled
2. Verify manifest.json is valid
3. Check service worker is registered
4. Clear browser cache
5. Use Chrome or Edge (best PWA support)

### Admin Site Issues

#### Can't Login

**Problem:** Login fails with error

**Solutions:**
1. Verify user exists in Firebase Console
2. Check Email/Password auth is enabled
3. Verify Firebase credentials in `.env.local`
4. Check browser console for errors
5. Reset password if needed

#### Can't Add/Edit/Delete

**Problem:** CRUD operations fail

**Solutions:**
1. Verify user is logged in
2. Check Firestore rules allow authenticated writes
3. Verify all required fields are filled
4. Check browser console for errors
5. Deploy updated Firestore rules

#### Asset Number Not Incrementing

**Problem:** New assets get same number

**Solutions:**
1. Check `counters/asset_counter` document
2. Verify `nextNumber` field is correct
3. Manually update if needed
4. Check for concurrent writes

#### Build Errors

**Problem:** TypeScript errors during build

**Solutions:**
1. Run `npm install` to ensure dependencies
2. Check `vite-env.d.ts` exists
3. Verify all imports are correct
4. Clear `node_modules` and reinstall

### Firebase Issues

#### Permission Denied

**Problem:** Firestore operations fail with permission error

**Solutions:**
1. Check Firestore rules are deployed
2. Verify user is authenticated
3. Check rule syntax
4. Test in Firebase Console

#### Deployment Fails

**Problem:** Firebase deploy fails

**Solutions:**
1. Run `firebase login`
2. Check `firebase.json` syntax
3. Verify hosting targets are set
4. Check internet connection
5. Run `firebase init` to reconfigure

#### Service Worker Not Registering

**Problem:** PWA features don't work

**Solutions:**
1. Ensure HTTPS is enabled
2. Check `sw.js` is deployed
3. Verify registration code in `index.html`
4. Clear browser cache
5. Check browser console for errors

### Common Errors

#### "Module not found"

```bash
npm install
```

#### "Permission denied"

- Check Firestore rules
- Verify authentication
- Deploy updated rules

#### "CORS error"

- Ensure you're using correct Firebase project
- Check Firebase credentials
- Verify domain is authorized

#### "Invalid API key"

- Check `.env.local` file
- Verify Firebase credentials
- Ensure no typos in keys

#### "Network error"

- Check internet connection
- Verify Firebase project is active
- Check Firebase status: https://status.firebase.google.com/

### Getting Help

1. **Check Documentation**
   - `README.md` - Main app overview
   - `ADMIN_COMPLETE.md` - Admin site guide
   - `FIREBASE_AUTH_COMPLETE.md` - Firebase setup

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error messages
   - Check network tab for failed requests

3. **Check Firebase Console**
   - Verify data exists
   - Check authentication users
   - Review Firestore rules

4. **Check Logs**
   - Firebase Hosting logs
   - Browser console logs
   - Build logs

5. **Community Resources**
   - Firebase Documentation: https://firebase.google.com/docs
   - Ionic Documentation: https://ionicframework.com/docs
   - React Documentation: https://react.dev

---

## 📚 Additional Resources

### Documentation Files

- `README.md` - Main project overview
- `ADMIN_COMPLETE.md` - Admin site complete guide
- `ADMIN_AUTH_SETUP.md` - Authentication setup
- `FIREBASE_AUTH_COMPLETE.md` - Firebase configuration
- `PWA_SETUP_COMPLETE.md` - PWA setup guide
- `TWA_SETUP_COMPLETE.md` - TWA setup guide
- `TESTING.md` - Testing documentation
- `CAMERA_TESTING_GUIDE.md` - Camera testing

### External Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Ionic Docs:** https://ionicframework.com/docs
- **React Docs:** https://react.dev
- **Material-UI:** https://mui.com
- **PWABuilder:** https://www.pwabuilder.com
- **Gruvbox Theme:** https://github.com/morhetz/gruvbox

---

## ✅ Summary

### WhatYou've Built

A complete inventory management system with:

✅ **Main App** - PWA/TWA for scanning and viewing assets
✅ **Admin Site** - Secure management interface with authentication
✅ **Firebase Backend** - Firestore database with proper security rules
✅ **Asset Number System** - Auto-generated and preserved numbers
✅ **Beautiful UI** - Gruvbox light theme throughout
✅ **Comprehensive Documentation** - Guides for everything

### Key Features

- QR code scanning
- Auto-generated asset numbers
- Asset number preservation
- Email/password authentication
- PWA and TWA support
- Real-time data sync
- Status and category tracking
- Image support
- Owner assignment
- Beautiful, consistent design

### Architecture

- **Frontend:** React + TypeScript + Ionic/Material-UI
- **Backend:** Firebase Firestore + Authentication
- **Hosting:** Firebase Hosting (2 sites)
- **Theme:** Gruvbox Light
- **Testing:** Jest + React Testing Library

### Deployment

- Main app: `https://your-project.web.app`
- Admin site: `https://your-project-admin.web.app`
- Both deployed via Firebase Hosting
- Proper headers and caching configured
- SSL certificates automatic

---

**Status:** ✅ **Complete and Production Ready**

For questions or issues, refer to the specific documentation files or check the troubleshooting section.

---

*Last Updated: 2024*
*Version: 1.0.0*
