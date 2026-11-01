# WhatTheTag Admin - Inventory Management System

A separate admin interface for managing inventory assets in the WhatTheTag system. This is a full-featured CRUD application built with React, Material-UI, and Firebase Firestore.

## 🎯 Features

- ✅ **Dashboard** - View all inventory items with statistics
- ✅ **Add Assets** - Create new inventory items with auto-generated asset numbers
- ✅ **Edit Assets** - Modify existing asset details
- ✅ **Delete Assets** - Remove assets while preserving asset numbers
- ✅ **Deleted Assets Log** - View all deleted asset numbers (prevents reuse)
- ✅ **Auto-Generated Asset Numbers** - Automatically generates next asset number (AST-001, AST-002, etc.)
- ✅ **Asset Number Preservation** - Deleted asset numbers are never reused
- ✅ **Gruvbox Theme** - Beautiful, consistent UI matching the main app

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **Firebase Firestore** - Database
- **Vite** - Build tool
- **React Router** - Navigation

## 📦 Installation

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note:** Use the same Firebase project as your main WhatTheTag app.

### 3. Run Development Server

```bash
npm run dev
```

The admin site will be available at `http://localhost:3001`

## 🚀 Usage

### Dashboard

- View all inventory items in a table
- See statistics (total assets, status counts, category counts)
- Quick actions: Edit or Delete assets

### Add New Asset

1. Click "Add New Asset" button
2. The next asset number is automatically generated and displayed
3. Fill in the form:
   - Item Name
   - Item Description
   - Category (Fixed or Electronics)
   - Status (Good, Has Defects, or BAD)
   - Designated Owner
   - Image URL
4. Click "Add Asset"
5. The asset is created with the auto-generated asset number

### Edit Asset

1. Click the edit icon (pencil) on any asset in the dashboard
2. Modify the fields (asset number cannot be changed)
3. Click "Update Asset"
4. Changes are saved

### Delete Asset

1. Click the delete icon (trash) on any asset in the dashboard
2. Confirm the deletion
3. The asset is removed, but its asset number is preserved
4. The deleted asset number appears in the "Deleted Assets" log

### View Deleted Assets

- Navigate to "Deleted Assets" in the sidebar
- See all deleted asset numbers with deletion dates and reasons
- These numbers will never be reused

## 🔢 Asset Number System

### How It Works

1. **Auto-Generation**: When adding a new asset, the system:
   - Fetches the highest asset number from existing items
   - Checks the counter document for the next number
   - Uses the higher of the two
   - Formats as `AST-001`, `AST-002`, etc.

2. **Preservation**: When an asset is deleted:
   - The asset number is stored in the `deleted_assets` collection
   - The number is never reused for new assets
   - This prevents confusion and maintains data integrity

3. **Counter Document**: A special document in the `counters` collection tracks the next available number:
   ```
   Collection: counters
   Document: asset_counter
   {
     nextNumber: 13,
     updatedAt: "2024-01-15T10:30:00Z"
   }
   ```

### Example Flow

1. Current highest asset: `AST-010`
2. Delete `AST-005`
3. `AST-005` is added to `deleted_assets` collection
4. Add new asset → Gets `AST-011` (not `AST-005`)
5. `AST-005` is permanently retired

## 📊 Firestore Collections

### `inventory`
Main collection for all active inventory items.

```typescript
{
  id: string;
  assetNumber: string;      // e.g., "AST-001"
  itemName: string;
  itemDescription: string;
  category: "Fixed" | "Electronics";
  status: "Good" | "Has Defects" | "BAD";
  designatedOwner: string;
  image: string;            // URL
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}
```

### `deleted_assets`
Tracks all deleted asset numbers.

```typescript
{
  assetNumber: string;      // e.g., "AST-005"
  deletedAt: string;        // ISO timestamp
  reason?: string;          // Optional reason for deletion
}
```

### `counters`
Stores the next available asset number.

```typescript
{
  nextNumber: number;       // e.g., 13
  updatedAt: string;        // ISO timestamp
}
```

## 🎨 Theme

The admin site uses the Gruvbox Light theme to match the main WhatTheTag app:

- **Background**: Light brown (#fbf1c7, #ebdbb2)
- **Primary**: Blue (#458588)
- **Secondary**: Orange (#d65d0e)
- **Success**: Green (#98971a)
- **Warning**: Yellow (#d79921)
- **Error**: Red (#cc241d)
- **Info**: Aqua (#689d6a)

## 🚢 Deployment

### Option 1: Firebase Hosting (Recommended)

Since this is part of the same Firebase project, you can deploy it alongside the main app.

1. Build the admin site:
   ```bash
   npm run build
   ```

2. Update `firebase.json` in the root project to include the admin site:
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

3. Deploy:
   ```bash
   firebase deploy --only hosting:admin
   ```

The admin site will be available at `https://your-project-admin.web.app` or a custom domain.

### Option 2: Separate Hosting

Deploy to any static hosting service (Netlify, Vercel, etc.):

1. Build: `npm run build`
2. Deploy the `admin/dist` directory

## 🔒 Security

### Firestore Rules

The admin site uses the same Firestore rules as the main app. For full CRUD operations, you may want to add authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for inventory
    match /inventory/{document=**} {
      allow read: if true;
      allow create, update, delete: if false; // Require auth for admin operations
    }
    
    // Admin-only operations
    match /deleted_assets/{document=**} {
      allow read, write: if false; // Require admin auth
    }
    
    match /counters/{document=**} {
      allow read, write: if false; // Require admin auth
    }
  }
}
```

### Recommended: Add Authentication

For production, add Firebase Authentication to protect the admin site:

1. Enable Firebase Authentication
2. Add login page to admin site
3. Update Firestore rules to require authentication
4. Only allow authenticated users to perform CRUD operations

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Asset Number Not Incrementing

If the asset number is not incrementing correctly:

1. Check the `counters` collection in Firestore
2. Verify the `asset_counter` document exists
3. Manually update the `nextNumber` field if needed

### Can't Delete Assets

If deletion fails:

1. Check Firestore rules allow deletion
2. Verify the item exists
3. Check browser console for errors

### Build Errors

If you get TypeScript errors:

1. Run `npm install` to ensure all dependencies are installed
2. Check that all imports are correct
3. Verify TypeScript configuration

## 📚 Documentation

- **Main App**: See `README.md` in the root directory
- **Firebase Setup**: See `FIRESTORE_DATA_ENTRY_GUIDE.md`
- **PWA/TWA**: See `PWA_SETUP_COMPLETE.md` and `TWA_SETUP_COMPLETE.md`

## 🤝 Contributing

This is a separate admin interface for the WhatTheTag system. When making changes:

1. Ensure compatibility with the main app's data structure
2. Follow the existing code style
3. Test thoroughly before deploying
4. Update documentation as needed

## 📄 License

Same license as the main WhatTheTag application.

---

**Status:** ✅ Ready to use! Install dependencies, configure Firebase, and start managing your inventory.
