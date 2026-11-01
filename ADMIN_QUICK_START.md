# Admin Site Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install & Configure

```bash
cd admin
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### 2. Run Development Server

```bash
npm run dev
```

Access at `http://localhost:3001`

### 3. Start Managing

- **Dashboard**: View all assets and statistics
- **Add Asset**: Create new items (auto-generated asset numbers)
- **Edit Asset**: Modify existing items
- **Delete Asset**: Remove items (numbers are preserved)
- **Deleted Assets**: View retired asset numbers

## 📋 What You Can Do

### Add New Asset

1. Click "Add New Asset"
2. See auto-generated asset number (e.g., AST-001)
3. Fill in:
   - Item Name
   - Description
   - Category (Fixed/Electronics)
   - Status (Good/Has Defects/BAD)
   - Owner
   - Image URL
4. Click "Add Asset"

### Edit Asset

1. Click edit icon (pencil) on any asset
2. Modify fields (asset number is read-only)
3. Click "Update Asset"

### Delete Asset

1. Click delete icon (trash) on any asset
2. Confirm deletion
3. Asset number is preserved (never reused)

### View Statistics

Dashboard shows:
- Total assets
- Assets by status (Good, Has Defects, BAD)
- Assets by category (Fixed, Electronics)

## 🔢 Asset Number System

### Auto-Generation
- Next number is automatically calculated
- Format: AST-001, AST-002, AST-003, etc.
- Based on highest existing number + 1

### Preservation
- Deleted numbers are **never reused**
- Stored in `deleted_assets` collection
- Prevents confusion and maintains integrity

### Example
```
Current: AST-001 to AST-010
Delete: AST-005
Add new: Gets AST-011 (NOT AST-005)
AST-005 is permanently retired
```

## 🚢 Deploy to Firebase

### 1. Update firebase.json (in root)

```json
{
  "hosting": [
    {
      "target": "app",
      "public": "dist"
    },
    {
      "target": "admin",
      "public": "admin/dist"
    }
  ]
}
```

### 2. Build & Deploy

```bash
cd admin
npm run build
cd ..
firebase deploy --only hosting:admin
```

Access at: `https://your-project-admin.web.app`

## 🔒 Security (Recommended)

Add Firebase Authentication to protect admin operations:

1. Enable Authentication in Firebase Console
2. Add login page to admin site
3. Update Firestore rules to require auth

See `ADMIN_SETUP_GUIDE.md` for detailed instructions.

## 📚 Documentation

- **Full Guide**: `ADMIN_SETUP_GUIDE.md`
- **Admin README**: `admin/README.md`
- **Main App**: `README.md`

## ✅ That's It!

You're ready to manage your inventory with:
- ✅ Auto-generated asset numbers
- ✅ Preserved deleted numbers
- ✅ Full CRUD operations
- ✅ Beautiful Gruvbox theme

---

**Need more details?** Check `ADMIN_SETUP_GUIDE.md` for comprehensive documentation.
