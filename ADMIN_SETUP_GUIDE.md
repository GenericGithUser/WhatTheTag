# Admin Site Setup Guide

## 🎯 Overview

The WhatTheTag Admin site is a separate web application for managing inventory assets. It provides full CRUD operations with auto-generated asset numbers and preservation of deleted numbers.

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project set up (same as main app)
- Firebase CLI installed (`npm install -g firebase-tools`)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Firebase

Copy the environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials (same as main app):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Run Development Server

```bash
npm run dev
```

Access the admin site at `http://localhost:3001`

## 🔧 Configuration

### Firebase Project

The admin site uses the **same Firebase project** as the main WhatTheTag app. This ensures:

- ✅ Shared database (same Firestore collections)
- ✅ Consistent data structure
- ✅ No data synchronization needed
- ✅ Single source of truth

### Firestore Collections

The admin site uses three collections:

1. **`inventory`** - Main inventory items (shared with main app)
2. **`deleted_assets`** - Tracks deleted asset numbers
3. **`counters`** - Stores the next available asset number

### Asset Number System

#### Auto-Generation

When adding a new asset:

1. System fetches the highest asset number from `inventory` collection
2. Checks the `counters/asset_counter` document for the next number
3. Uses the higher of the two values
4. Formats as `AST-001`, `AST-002`, etc.
5. Updates the counter document

#### Preservation

When deleting an asset:

1. Asset number is stored in `deleted_assets` collection
2. Asset is removed from `inventory` collection
3. The number is **never reused**
4. This prevents confusion and maintains data integrity

#### Example Flow

```
Current state:
- AST-001 to AST-010 exist
- AST-005 was deleted

Add new asset:
- System checks highest number: AST-010
- Next number: AST-011 (NOT AST-005)
- AST-005 is permanently retired
```

## 🎨 Features

### Dashboard

- View all inventory items in a sortable table
- See statistics:
  - Total assets
  - Assets by status (Good, Has Defects, BAD)
  - Assets by category (Fixed, Electronics)
- Quick actions: Edit or Delete assets

### Add Asset

- Auto-generated asset number displayed
- Form fields:
  - Item Name (required)
  - Item Description (required)
  - Category (Fixed or Electronics)
  - Status (Good, Has Defects, or BAD)
  - Designated Owner (required)
  - Image URL (required)
- Validation before submission
- Success/error feedback

### Edit Asset

- Load existing asset data
- Asset number cannot be changed (displayed as read-only)
- Modify all other fields
- Validation before submission
- Success/error feedback

### Delete Asset

- Confirmation dialog before deletion
- Asset number is preserved in `deleted_assets` collection
- Asset is removed from `inventory` collection
- Deleted asset appears in "Deleted Assets" log

### Deleted Assets Log

- View all deleted asset numbers
- See deletion date and time
- See reason for deletion (if provided)
- These numbers will never be reused

## 🚢 Deployment

### Option 1: Firebase Hosting (Recommended)

Deploy alongside the main app using Firebase Hosting.

#### 1. Update firebase.json

In the **root project directory**, update `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "app",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "admin",
      "public": "admin/dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

#### 2. Add Hosting Targets

```bash
# In root directory
firebase target:apply hosting app whatthetag-app
firebase target:apply hosting admin whatthetag-admin
```

#### 3. Build Admin Site

```bash
cd admin
npm run build
```

#### 4. Deploy

```bash
# Deploy both sites
firebase deploy --only hosting

# Or deploy only admin
firebase deploy --only hosting:admin
```

The admin site will be available at:
- Default: `https://your-project-admin.web.app`
- Custom domain: Configure in Firebase Console

### Option 2: Separate Hosting

Deploy to any static hosting service:

1. Build: `npm run build`
2. Upload `admin/dist` directory to your hosting service

## 🔒 Security

### Current Setup

The admin site currently uses the same Firestore rules as the main app, which allows:
- ✅ Public read access to inventory
- ❌ No write access (for security)

### Recommended: Add Authentication

For production, add Firebase Authentication to protect admin operations:

#### 1. Enable Authentication

In Firebase Console:
1. Go to Authentication
2. Enable sign-in methods (Email/Password, Google, etc.)
3. Create admin users

#### 2. Add Login to Admin Site

Create a login page and protect routes:

```typescript
// Example: Add authentication check
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const [user, setUser] = useState(null);

useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      // Redirect to login
      navigate('/login');
    }
  });
  return unsubscribe;
}, []);
```

#### 3. Update Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for inventory (main app needs this)
    match /inventory/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    // Admin-only operations
    match /deleted_assets/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /counters/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 4. Deploy Updated Rules

```bash
firebase deploy --only firestore:rules
```

## 📊 Data Structure

### Inventory Item

```typescript
{
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

### Deleted Asset

```typescript
{
  assetNumber: string;           // e.g., "AST-005"
  deletedAt: string;             // ISO timestamp
  reason?: string;               // Optional reason
}
```

### Counter

```typescript
{
  nextNumber: number;            // e.g., 13
  updatedAt: string;             // ISO timestamp
}
```

## 🎨 Theme

The admin site uses the Gruvbox Light theme:

- **Background**: #fbf1c7 (default), #ebdbb2 (paper)
- **Primary**: #458588 (Blue)
- **Secondary**: #d65d0e (Orange)
- **Success**: #98971a (Green)
- **Warning**: #d79921 (Yellow)
- **Error**: #cc241d (Red)
- **Info**: #689d6a (Aqua)
- **Text**: #282828 (primary), #504945 (secondary)

## 🐛 Troubleshooting

### Asset Number Not Incrementing

**Problem**: New assets get the same number as existing ones.

**Solution**:
1. Check Firestore `counters/asset_counter` document
2. Verify `nextNumber` field is correct
3. Manually update if needed:
   ```javascript
   // In Firestore Console
   // Collection: counters
   // Document: asset_counter
   // Field: nextNumber
   // Set to: (highest asset number + 1)
   ```

### Can't Delete Assets

**Problem**: Delete button doesn't work or shows error.

**Solution**:
1. Check Firestore rules allow deletion
2. Verify the item exists in Firestore
3. Check browser console for errors
4. Ensure Firebase credentials are correct

### Build Errors

**Problem**: TypeScript or build errors.

**Solution**:
1. Run `npm install` to ensure all dependencies are installed
2. Check that all imports are correct
3. Verify TypeScript configuration in `tsconfig.json`
4. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### CORS Errors

**Problem**: Can't access Firebase from admin site.

**Solution**:
1. Verify Firebase credentials in `.env.local`
2. Check that the Firebase project is correct
3. Ensure Firestore is enabled in Firebase Console

## 📝 Development Workflow

### Adding New Features

1. Create new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Layout.tsx`
4. Implement Firestore operations in `src/inventoryService.ts`
5. Test thoroughly

### Testing

1. Run development server: `npm run dev`
2. Test all CRUD operations
3. Verify asset number generation
4. Check deleted assets log
5. Test on different browsers

### Code Style

- Use TypeScript for type safety
- Follow existing component structure
- Use Material-UI components
- Maintain Gruvbox theme consistency
- Add proper error handling

## 📚 Related Documentation

- **Main App**: `README.md` in root directory
- **Firebase Setup**: `FIRESTORE_DATA_ENTRY_GUIDE.md`
- **PWA Setup**: `PWA_SETUP_COMPLETE.md`
- **TWA Setup**: `TWA_SETUP_COMPLETE.md`
- **Test Suite**: `TESTING.md`

## ✅ Checklist

Before deploying:

- [ ] Install all dependencies
- [ ] Configure Firebase credentials
- [ ] Test all CRUD operations
- [ ] Verify asset number generation
- [ ] Check deleted assets preservation
- [ ] Test on multiple browsers
- [ ] Build for production
- [ ] Deploy to Firebase Hosting
- [ ] Verify deployment works
- [ ] (Optional) Add authentication

## 🎉 Success!

Your admin site is ready to manage inventory assets with:

- ✅ Auto-generated asset numbers
- ✅ Preservation of deleted numbers
- ✅ Full CRUD operations
- ✅ Beautiful Gruvbox theme
- ✅ Consistent with main app

---

**Need help?** Check the troubleshooting section or refer to the main README.
