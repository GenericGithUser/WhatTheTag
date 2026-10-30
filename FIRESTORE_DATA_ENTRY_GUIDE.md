# Firestore Data Entry Guide

## Quick Start

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., "whatthetag-demo")
3. Click on **Firestore Database** in the left sidebar

### Step 2: Create Collection

1. Click **Start collection** (or **Create collection** if you already have data)
2. Enter collection ID: `inventory`
3. Click **Next**

### Step 3: Add First Document

1. **Document ID**: Click **Auto-ID** or enter custom ID (e.g., `item-001`)
2. Add fields (see data structure below)
3. Click **Save**

## Data Structure

Each inventory item must have these fields:

| Field | Type | Example | Required |
|-------|------|---------|----------|
| `assetNumber` | string | `"AST-001"` | ✅ Yes |
| `itemName` | string | `"Dell Laptop"` | ✅ Yes |
| `itemDescription` | string | `"Business laptop for development"` | ✅ Yes |
| `category` | string | `"Electronics"` or `"Fixed"` | ✅ Yes |
| `status` | string | `"Good"`, `"Has Defects"`, or `"BAD"` | ✅ Yes |
| `designatedOwner` | string | `"John Doe"` | ✅ Yes |
| `image` | string | `"https://example.com/image.jpg"` | ✅ Yes |
| `createdAt` | timestamp | Auto-generated | ❌ Optional |
| `updatedAt` | timestamp | Auto-generated | ❌ Optional |

## Sample Data (Copy-Paste Ready)

### Item 1: Electronics - Good Status

```
Document ID: item-001

Fields:
- assetNumber (string): "AST-001"
- itemName (string): "Dell OptiPlex 7090"
- itemDescription (string): "Desktop computer with Intel i7, 16GB RAM, 512GB SSD. Assigned to finance department."
- category (string): "Electronics"
- status (string): "Good"
- designatedOwner (string): "John Smith"
- image (string): "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop"
```

### Item 2: Fixed Asset - Good Status

```
Document ID: item-002

Fields:
- assetNumber (string): "AST-002"
- itemName (string): "Herman Miller Aeron Chair"
- itemDescription (string): "Ergonomic office chair, size B, fully adjustable. Used in executive office."
- category (string): "Fixed"
- status (string): "Good"
- designatedOwner (string): "Sarah Johnson"
- image (string): "https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop"
```

### Item 3: Electronics - Has Defects

```
Document ID: item-003

Fields:
- assetNumber (string): "AST-003"
- itemName (string): "HP LaserJet Pro M404"
- itemDescription (string): "Monochrome laser printer. Currently experiencing paper feed issues."
- category (string): "Electronics"
- status (string): "Has Defects"
- designatedOwner (string): "IT Department"
- image (string): "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop"
```

### Item 4: Fixed Asset - BAD Status

```
Document ID: item-004

Fields:
- assetNumber (string): "AST-004"
- itemName (string): "Conference Table - 12 Seater"
- itemDescription (string): "Large wooden conference table. Severe water damage from ceiling leak."
- category (string): "Fixed"
- status (string): "BAD"
- designatedOwner (string): "Facilities"
- image (string): "https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=400&h=300&fit=crop"
```

### Item 5: Electronics - Good Status

```
Document ID: item-005

Fields:
- assetNumber (string): "AST-005"
- itemName (string): "MacBook Pro 16 inch"
- itemDescription (string): "Apple MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Development laptop."
- category (string): "Electronics"
- status (string): "Good"
- designatedOwner (string): "Mike Chen"
- image (string): "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
```

## Step-by-Step Instructions

### Adding a Single Document

1. **Open Firestore Database**
   - Firebase Console → Firestore Database

2. **Click "Add document"**
   - Or click the **+** button

3. **Set Document ID**
   - Click **Auto-ID** for automatic ID
   - Or type custom ID like `item-001`

4. **Add Fields**
   - Click **Add field**
   - Enter field name (e.g., `assetNumber`)
   - Select type (string)
   - Enter value (e.g., `AST-001`)
   - Repeat for all required fields

5. **Save Document**
   - Click **Save**

### Adding Multiple Documents

Repeat the above steps for each item. You can add all 5 sample items above.

## Field Types Reference

| Type | When to Use | Example |
|------|-------------|---------|
| **string** | Text values | `"AST-001"` |
| **number** | Numeric values | `42` |
| **boolean** | True/False | `true` |
| **timestamp** | Date/Time | Auto-generated |
| **array** | List of values | `["tag1", "tag2"]` |
| **map** | Nested object | `{key: "value"}` |
| **null** | Empty value | `null` |
| **geo_point** | Location | `{latitude: 40.7, longitude: -74.0}` |
| **reference** | Document reference | Reference to another doc |

## Valid Values

### Category (Must be exactly one of these)
- `"Electronics"`
- `"Fixed"`

### Status (Must be exactly one of these)
- `"Good"`
- `"Has Defects"`
- `"BAD"`

**⚠️ Important:** These values are case-sensitive and must match exactly!

## Image URLs

Use these free image sources:

### Unsplash (Recommended)
```
https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop
```

### Sample URLs
```
Laptop: https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop
Chair: https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop
Printer: https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop
Monitor: https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop
Server: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop
```

## Testing Your Data

### 1. View in Firestore Console
- Navigate to your collection
- Click on a document to view/edit

### 2. Test in App
- Open your app
- Go to Dashboard
- You should see your items listed

### 3. Test Scanner
- Generate QR code with asset number (e.g., `AST-001`)
- Scan it in the app
- Item details should appear

## Generate QR Codes for Testing

### Online QR Generators
1. [QR Code Generator](https://www.qr-code-generator.com/)
2. [QRCode Monkey](https://www.qrcode-monkey.com/)
3. [QR.io](https://qr.io/)

### What to Encode
Create QR codes with these values:
```
AST-001
AST-002
AST-003
AST-004
AST-005
```

### Testing Steps
1. Generate QR code for `AST-001`
2. Print or display on screen
3. Open app → Scanner
4. Point camera at QR code
5. Item details should appear

## Batch Import (Advanced)

If you want to import many items at once, use the Firebase CLI:

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login
```bash
firebase login
```

### 3. Create JSON File
Create `inventory-data.json`:
```json
{
  "inventory": {
    "item-001": {
      "assetNumber": "AST-001",
      "itemName": "Dell OptiPlex 7090",
      "itemDescription": "Desktop computer",
      "category": "Electronics",
      "status": "Good",
      "designatedOwner": "John Smith",
      "image": "https://example.com/laptop.jpg"
    },
    "item-002": {
      "assetNumber": "AST-002",
      "itemName": "Office Chair",
      "itemDescription": "Ergonomic chair",
      "category": "Fixed",
      "status": "Good",
      "designatedOwner": "Jane Doe",
      "image": "https://example.com/chair.jpg"
    }
  }
}
```

### 4. Import Data
```bash
firebase firestore:delete inventory --recursive
# Then use a script to import from JSON
```

## Troubleshooting

### Issue: Data not showing in app
**Solution:**
- Check Firestore rules allow read access
- Verify collection name is exactly `inventory`
- Check browser console for errors

### Issue: Scanner can't find item
**Solution:**
- Verify `assetNumber` matches QR code exactly
- Check for typos in asset number
- Ensure document exists in Firestore

### Issue: Images not loading
**Solution:**
- Verify image URL is accessible
- Use HTTPS URLs
- Check image URL format

### Issue: Permission denied errors
**Solution:**
- Check Firestore security rules
- For testing, you can temporarily set rules to:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
  **⚠️ Only for testing! Revert to secure rules before production!**

## Data Validation Checklist

Before saving each document, verify:

- ✅ `assetNumber` is a non-empty string
- ✅ `itemName` is a non-empty string
- ✅ `itemDescription` is a non-empty string
- ✅ `category` is exactly `"Electronics"` or `"Fixed"`
- ✅ `status` is exactly `"Good"`, `"Has Defects"`, or `"BAD"`
- ✅ `designatedOwner` is a non-empty string
- ✅ `image` is a valid URL starting with `http://` or `https://`

## Quick Reference Card

### Collection Name
```
inventory
```

### Required Fields
```javascript
{
  assetNumber: "AST-001",        // string
  itemName: "Item Name",         // string
  itemDescription: "Description", // string
  category: "Electronics",       // "Electronics" | "Fixed"
  status: "Good",                // "Good" | "Has Defects" | "BAD"
  designatedOwner: "Owner Name", // string
  image: "https://..."           // string (URL)
}
```

### Valid Categories
- `Electronics`
- `Fixed`

### Valid Statuses
- `Good`
- `Has Defects`
- `BAD`

## Next Steps

1. ✅ Add 5 sample items to Firestore
2. ✅ Test Dashboard displays items
3. ✅ Generate QR codes for each asset number
4. ✅ Test Scanner with QR codes
5. ✅ Test manual search with asset numbers
6. ✅ Verify all item details display correctly

## Support

If you encounter issues:
1. Check Firestore Console for errors
2. Verify data structure matches requirements
3. Check browser console for errors
4. Review Firestore security rules
5. Test with sample data provided above

Happy testing! 🎉
