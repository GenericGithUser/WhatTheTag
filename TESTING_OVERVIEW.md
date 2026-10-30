# Firestore Testing Guide - Complete Overview

## 🎯 What You Need to Do

To test your WhatTheTag app with real data, you need to:
1. Add data to Firestore manually OR use the import script
2. Generate QR codes for testing the scanner
3. Test all app features

## 📚 Documentation Created

I've created comprehensive guides for you:

### 1. **QUICK_START_TESTING.md** ⭐ START HERE
- Fastest way to add test data
- Copy-paste ready sample data
- Quick testing checklist
- **Recommended for first-time setup**

### 2. **FIRESTORE_DATA_ENTRY_GUIDE.md**
- Detailed step-by-step instructions
- Complete data structure reference
- Troubleshooting guide
- Advanced batch import options
- **For detailed reference**

### 3. **scripts/import-data.js**
- Node.js script to batch import data
- Imports 10 sample items automatically
- **For advanced users**

## 🚀 Quick Start (5 Minutes)

### Step 1: Add Data to Firestore

**Option A: Manual Entry (Easiest)**
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Firestore Database"
4. Click "Start collection"
5. Collection ID: `inventory`
6. Add first document using sample data from `QUICK_START_TESTING.md`

**Option B: Import Script (Fastest for many items)**
```bash
npm install firebase dotenv
node scripts/import-data.js
```

### Step 2: Test Your App

1. **Dashboard Test**
   - Open your app
   - You should see items listed
   - Try filtering by status/category

2. **Scanner Test**
   - Generate QR code for `AST-001`
   - Use: https://www.qr-code-generator.com/
   - Scan it in your app
   - Item details should appear

3. **Manual Search Test**
   - Go to Scanner page
   - Type `AST-001`
   - Click Search
   - Item should appear

## 📋 Sample Data (Copy This First)

```
Collection: inventory
Document ID: item-001

Fields:
- assetNumber (string): AST-001
- itemName (string): Dell OptiPlex 7090
- itemDescription (string): Desktop computer with Intel i7
- category (string): Electronics
- status (string): Good
- designatedOwner (string): John Smith
- image (string): https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop
```

## ✅ Valid Values (Important!)

### Category
- `Electronics` ✅
- `Fixed` ✅
- ~~Furniture~~ ❌
- ~~Equipment~~ ❌

### Status
- `Good` ✅
- `Has Defects` ✅
- `BAD` ✅
- ~~Available~~ ❌
- ~~In Use~~ ❌

⚠️ **Case-sensitive!** Must match exactly.

## 🧪 Testing Checklist

- [ ] Created `inventory` collection
- [ ] Added at least 1 document
- [ ] All required fields present
- [ ] Dashboard shows items
- [ ] Scanner works with QR code
- [ ] Manual search works
- [ ] Item details display correctly

## 📱 Generate QR Codes

Use these online tools:
- https://www.qr-code-generator.com/
- https://www.qrcode-monkey.com/

Create QR codes with:
```
AST-001
AST-002
AST-003
AST-004
AST-005
```

## 🔍 Data Structure

```javascript
{
  assetNumber: "AST-001",        // Required
  itemName: "Item Name",         // Required
  itemDescription: "Description", // Required
  category: "Electronics",       // Required: "Electronics" | "Fixed"
  status: "Good",                // Required: "Good" | "Has Defects" | "BAD"
  designatedOwner: "Owner Name", // Required
  image: "https://...",          // Required: Image URL
  createdAt: "2024-01-01...",    // Optional
  updatedAt: "2024-01-01..."     // Optional
}
```

## 🆘 Common Issues

### Data not showing?
- Check collection name is `inventory` (exact match)
- Verify all required fields exist
- Check browser console for errors

### Scanner can't find item?
- Verify asset number matches exactly
- Check for typos
- Ensure document exists

### Permission denied?
- Check Firestore security rules
- For testing, allow all reads temporarily

## 📖 Read These Next

1. **QUICK_START_TESTING.md** - Start here!
2. **FIRESTORE_DATA_ENTRY_GUIDE.md** - Detailed reference
3. **scripts/import-data.js** - Batch import script

## 💡 Pro Tips

1. **Start with 1 item** - Test before adding more
2. **Use real images** - Unsplash URLs work great
3. **Test all statuses** - Good, Has Defects, BAD
4. **Test both categories** - Electronics and Fixed
5. **Generate physical QR codes** - Print them for realistic testing

## 🎉 You're Ready!

1. Open `QUICK_START_TESTING.md`
2. Add Item 1 to Firestore
3. Test your app
4. Add more items as needed
5. Generate QR codes and test scanner

**Happy testing!** 🚀
