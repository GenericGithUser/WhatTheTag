# TWA Quick Start Guide

## 🎯 What is TWA?

**Trusted Web Activity (TWA)** makes your PWA run as a native Android app with **no browser bar**.

## 📋 What You Need

1. ✅ **Package Name** (e.g., `com.whatthetag.app`)
2. ✅ **SHA256 Fingerprint** from your signing certificate
3. ✅ **assetlinks.json** (already created at `public/.well-known/assetlinks.json`)

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get SHA256 Fingerprint

```bash
# If you have a keystore:
keytool -list -v -keystore your-keystore.jks -alias your-key-alias

# If using debug keystore (for testing):
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# If you need to create a keystore:
keytool -genkey -v -keystore whatthetag.jks -keyalg RSA -keysize 2048 -validity 10000 -alias whatthetag
```

Copy the **SHA256:** value (looks like: `14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:...`)

### Step 2: Update assetlinks.json

Edit `public/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.whatthetag.app",  // ← Your package name
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A6:2E:97:65:5D:37:EC:EC:32"
    ]
  }
}]
```

### Step 3: Deploy

```bash
npm run build
firebase deploy
```

### Step 4: Verify

```bash
# Check the file is accessible:
curl https://your-domain.web.app/.well-known/assetlinks.json

# Test with Google's tool:
# https://developers.google.com/digital-asset-links/tools/generator
```

### Step 5: Generate Android App

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. Click **Package for stores** → **Android**
4. Enter your package name and upload keystore
5. Download the APK/AAB

## 🧪 Test TWA

### On Android Device

1. Install Chrome
2. Navigate to your PWA URL
3. Tap **Add to Home Screen**
4. The app should open without browser UI

### Using TWA Tester

Install **TWA Tester** from Google Play and enter your PWA URL to verify.

## 🔍 Troubleshooting

### Browser Bar Still Shows?

- ✅ Verify package name matches exactly
- ✅ Verify SHA256 fingerprint is correct
- ✅ Ensure assetlinks.json is accessible
- ✅ Check JSON is valid

### App Won't Install?

- ✅ Test with Google's verification tool
- ✅ Ensure HTTPS is enabled
- ✅ Verify file is publicly accessible

### Wrong SHA256?

- ✅ Make sure you're using the correct keystore
- ✅ Verify the alias name
- ✅ Run `keytool -list -v -keystore your-keystore.jks`

## 📦 Alternative: Use PWABuilder

PWABuilder can generate the SHA256 for you:

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. Click **Package for stores** → **Android**
4. PWABuilder will generate a keystore and provide the SHA256
5. Copy the SHA256 to your assetlinks.json
6. Redeploy

## 📚 Need More Help?

See the full guide: **TWA_SETUP_GUIDE.md**

## ✅ Checklist

- [ ] Get SHA256 fingerprint
- [ ] Choose package name
- [ ] Update assetlinks.json
- [ ] Deploy to Firebase
- [ ] Verify assetlinks.json is accessible
- [ ] Test on Android device
- [ ] Generate Android app with PWABuilder

---

**That's it!** Your PWA will now run as a native Android app without browser UI. 🎉
