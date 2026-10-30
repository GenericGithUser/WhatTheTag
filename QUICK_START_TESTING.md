# Quick Start: Testing with Firestore

## 🚀 Fastest Way (Recommended)

### Option 1: Manual Entry in Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project

2. **Open Firestore Database**
   - Click "Firestore Database" in left sidebar
   - Click "Start collection"

3. **Create Collection**
   - Collection ID: `inventory`
   - Click "Next"

4. **Add First Document**
   - Document ID: `item-001` (or click Auto-ID)
   - Add these fields:

```
Field              Type     Value
─────────────────────────────────────────────────────────
assetNumber        string   AST-001
itemName           string   Dell OptiPlex 7090
itemDescription    string   Desktop computer with Intel i7
category           string   Electronics
status             string   Good
designatedOwner    string   John Smith
image              string   https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop
```

5. **Click Save**

6. **Repeat for more items** (use sample data below)

### Option 2: Use Import Script (Advanced)

```bash
# Install dependencies
npm install firebase dotenv

# Create .env file with your Firebase config
# (copy from .env.local)

# Run import script
node scripts/import-data.js
```

## 📋 Sample Data (Copy-Paste Ready)

### Item 1
```
Document ID: item-001
assetNumber: AST-001
itemName: Dell OptiPlex 7090
itemDescription: Desktop computer with Intel i7, 16GB RAM
category: Electronics
status: Good
designatedOwner: John Smith
image: https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop
```

### Item 2
```
Document ID: item-002
assetNumber: AST-002
itemName: Herman Miller Aeron Chair
itemDescription: Ergonomic office chair, size B
category: Fixed
status: Good
designatedOwner: Sarah Johnson
image: https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop
```

### Item 3
```
Document ID: item-003
assetNumber: AST-003
itemName: HP LaserJet Pro M404
itemDescription: Monochrome laser printer with paper feed issues
category: Electronics
status: Has Defects
designatedOwner: IT Department
image: https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop
```

### Item 4
```
Document ID: item-004
assetNumber: AST-004
itemName: Conference Table
itemDescription: Large wooden table with water damage
category: Fixed
status: BAD
designatedOwner: Facilities
image: https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=400&h=300&fit=crop
```

### Item 5
```
Document ID: item-005
assetNumber: AST-005
itemName: MacBook Pro 16"
itemDescription: Apple MacBook Pro with M3 chip
category: Electronics
status: Good
designatedOwner: Mike Chen
image: https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop
```

## ✅ Valid Values

### Category (must be exactly)
- `Electronics`
- `Fixed`

### Status (must be exactly)
- `Good`
- `Has Defects`
- `BAD`

⚠️ **Case-sensitive!** Must match exactly.

## 🧪 Testing Your Data

### 1. Check Dashboard
- Open your app
- Go to Dashboard
- You should see your items listed

### 2. Test Scanner
Generate QR codes for these asset numbers:
- `AST-001`
- `AST-002`
- `AST-003`
- `AST-004`
- `AST-005`

**QR Code Generators:**
- https://www.qr-code-generator.com/
- https://www.qrcode-monkey.com/

### 3. Test Manual Search
- Go to Scanner page
- Type asset number (e.g., `AST-001`)
- Click Search
- Item details should appear

## 📊 Data Structure Reference

```javascript
{
  assetNumber: "AST-001",        // Required: Unique identifier
  itemName: "Item Name",         // Required: Display name
  itemDescription: "Description", // Required: Details
  category: "Electronics",       // Required: "Electronics" | "Fixed"
  status: "Good",                // Required: "Good" | "Has Defects" | "BAD"
  designatedOwner: "Owner Name", // Required: Person responsible
  image: "https://...",          // Required: Image URL
  createdAt: "2024-01-01...",    // Optional: Timestamp
  updatedAt: "2024-01-01..."     // Optional: Timestamp
}
```

## 🔍 Troubleshooting

### Data not showing in app?
- Check collection name is exactly `inventory`
- Verify all required fields are present
- Check browser console for errors

### Scanner can't find item?
- Verify `assetNumber` matches QR code exactly
- Check for typos
- Ensure document exists in Firestore

### Permission denied?
- Check Firestore security rules
- For testing, temporarily allow all reads:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /inventory/{document=**} {
        allow read: if true;
      }
    }
  }
  ```

## 📚 More Information

- **Detailed Guide**: See `FIRESTORE_DATA_ENTRY_GUIDE.md`
- **Import Script**: See `scripts/import-data.js`
- **Firebase Console**: https://console.firebase.google.com/

## 🎯 Quick Checklist

- [ ] Created `inventory` collection in Firestore
- [ ] Added at least 1 document with all required fields
- [ ] Verified category is "Electronics" or "Fixed"
- [ ] Verified status is "Good", "Has Defects", or "BAD"
- [ ] Tested Dashboard shows items
- [ ] Generated QR code for asset number
- [ ] Tested Scanner with QR code
- [ ] Tested manual search

## 💡 Tips

1. **Start Small**: Add 1-2 items first, test, then add more
2. **Use Real Images**: Unsplash URLs work great for testing
3. **Test All Statuses**: Add items with Good, Has Defects, and BAD status
4. **Test Both Categories**: Add Electronics and Fixed items
5. **Generate QR Codes**: Create physical QR codes to scan

## 🆘 Need Help?

1. Check `FIRESTORE_DATA_ENTRY_GUIDE.md` for detailed instructions
2. Review Firestore Console for errors
3. Check browser console for app errors
4. Verify data structure matches requirements

---

**Ready to test?** Start by adding Item 1 to Firestore, then check your app's Dashboard! 🚀
