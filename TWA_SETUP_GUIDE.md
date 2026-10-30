# Trusted Web Activity (TWA) Setup Guide

## 🎯 What is TWA?

**Trusted Web Activity (TWA)** allows your PWA to be installed as a native Android app that:
- ✅ Runs in full-screen mode (no browser bar/URL bar)
- ✅ Appears as a native app in the app drawer
- ✅ Uses Chrome's rendering engine under the hood
- ✅ Provides a native app experience
- ✅ Can be distributed via Google Play Store

## 📋 What You Need

1. **Android App Package Name** (e.g., `com.whatthetag.app`)
2. **SHA256 Fingerprint** of your signing certificate
3. **Firebase Hosting** with HTTPS (already configured ✅)
4. **assetlinks.json** file (created ✅)

## 🔧 Configuration Steps

### Step 1: Update assetlinks.json

Edit `public/.well-known/assetlinks.json` and replace the placeholders:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.whatthetag.app",  // ← Change this
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"  // ← Change this
    ]
  }
}]
```

### Step 2: Get Your SHA256 Fingerprint

#### Option A: Using Android Studio (Recommended)

1. Open Android Studio
2. Go to **Build > Generate Signed Bundle / APK**
3. Select **Android App Bundle** or **APK**
4. Choose your keystore file (`.jks` or `.keystore`)
5. Run this command to get the fingerprint:

```bash
keytool -list -v -keystore your-keystore.jks -alias your-key-alias
```

Look for **SHA256:** in the output. It will look like:
```
SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A6:2E:97:65:5D:37:EC:EC:32
```

#### Option B: Using PWABuilder

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. Click **Package for stores**
4. Select **Android**
5. PWABuilder will generate a keystore and provide the SHA256 fingerprint

#### Option C: Using Debug Keystore (For Testing)

If you don't have a keystore yet, you can use the debug keystore:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**⚠️ Note:** Debug keystore is for testing only. Use a proper keystore for production.

#### Option D: Generate a New Keystore

```bash
keytool -genkey -v -keystore whatthetag-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias whatthetag
```

Then get the fingerprint:

```bash
keytool -list -v -keystore whatthetag-release.jks -alias whatthetag
```

### Step 3: Choose Your Package Name

Your package name should follow Android conventions:
- Format: `com.yourcompany.appname`
- Must be unique (reverse domain name notation)
- Examples:
  - `com.whatthetag.app`
  - `com.yourcompany.whatthetag`
  - `io.github.username.whatthetag`

**⚠️ Important:** Once you publish to Google Play, you cannot change the package name!

### Step 4: Update assetlinks.json with Your Values

Example:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.whatthetag.app",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A6:2E:97:65:5D:37:EC:EC:32"
    ]
  }
}]
```

### Step 5: Deploy to Firebase

```bash
npm run build
firebase deploy
```

### Step 6: Verify assetlinks.json is Accessible

Test that the file is accessible:

```bash
curl https://your-domain.web.app/.well-known/assetlinks.json
```

You should see your JSON file.

## 🧪 Testing TWA

### Test 1: Verify assetlinks.json

Use Google's Digital Asset Links API:

```bash
curl "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://your-domain.web.app"
```

Or use the online tool:
https://developers.google.com/digital-asset-links/tools/generator

### Test 2: Test with Android Device

1. Install Chrome on your Android device
2. Navigate to your PWA URL
3. If TWA is configured correctly, you can install it as an app
4. The app should open without browser UI

### Test 3: Use TWA Tester

1. Install the **TWA Tester** app from Google Play
2. Enter your PWA URL
3. It will verify your TWA configuration

## 📦 Building the Android App

### Option A: Using PWABuilder (Easiest)

1. Go to https://www.pwabuilder.com/
2. Enter your PWA URL
3. Click **Package for stores**
4. Select **Android**
5. Configure:
   - Package name: `com.whatthetag.app`
   - Signing key: Upload your keystore or let PWABuilder generate one
   - Host: Your Firebase URL
6. Click **Generate**
7. Download the APK/AAB file

### Option B: Using Bubblewrap (Advanced)

Bubblewrap is Google's official TWA tool:

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize the project
bubblewrap init --manifest=https://your-domain.web.app/manifest.json

# Build the APK
bubblewrap build
```

### Option C: Using Android Studio (Manual)

1. Create a new Android project
2. Add TWA dependencies:

```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.4.0'
}
```

3. Configure the TWA in your Activity:

```java
new TwaLauncher(this).launch(
    new CustomTabsIntent.Builder().build(),
    Uri.parse("https://your-domain.web.app")
);
```

4. Build and sign the APK

## 🔍 Common Issues

### Issue 1: Browser Bar Still Shows

**Cause:** assetlinks.json is not configured correctly

**Solution:**
1. Verify package name matches exactly
2. Verify SHA256 fingerprint is correct
3. Ensure assetlinks.json is accessible at `/.well-known/assetlinks.json`
4. Check that the file is valid JSON

### Issue 2: App Won't Install

**Cause:** Digital Asset Links verification failed

**Solution:**
1. Test with Google's verification tool:
   https://developers.google.com/digital-asset-links/tools/generator
2. Ensure HTTPS is enabled
3. Verify the file is publicly accessible
4. Check for typos in package name or fingerprint

### Issue 3: Wrong SHA256 Fingerprint

**Cause:** Using the wrong keystore or alias

**Solution:**
1. Make sure you're using the same keystore for signing
2. Verify the alias name is correct
3. Run `keytool -list -v -keystore your-keystore.jks` to see all aliases
4. Use the correct alias in the keytool command

### Issue 4: Package Name Conflict

**Cause:** Package name already exists on Google Play

**Solution:**
1. Choose a different package name
2. Use reverse domain notation: `com.yourcompany.appname`
3. Make sure it's unique

## 📋 Checklist

Before publishing to Google Play:

- [ ] assetlinks.json is configured with correct package name
- [ ] SHA256 fingerprint is correct
- [ ] assetlinks.json is accessible at `/.well-known/assetlinks.json`
- [ ] PWA is working correctly on mobile
- [ ] All icons are present (192x192, 512x512)
- [ ] Manifest is valid
- [ ] Service worker is registered
- [ ] HTTPS is enabled
- [ ] TWA tested on Android device
- [ ] App is signed with release keystore (not debug)

## 🔐 Security Notes

### Keep Your Keystore Safe

- **Never commit keystore files to Git**
- Store keystore in a secure location
- Backup your keystore (you need it for updates)
- Use strong passwords for keystore and keys

### Add to .gitignore

```gitignore
# Keystore files
*.jks
*.keystore
*.key

# Android build files
local.properties
```

### Use Environment Variables

For CI/CD, store keystore password in environment variables:

```bash
export KEYSTORE_PASSWORD="your-password"
export KEY_PASSWORD="your-key-password"
```

## 📚 Additional Resources

- **Google TWA Documentation:** https://developer.chrome.com/docs/android/trusted-web-activity/
- **Digital Asset Links:** https://developers.google.com/digital-asset-links/
- **PWABuilder:** https://www.pwabuilder.com/
- **Bubblewrap:** https://github.com/GoogleChromeLabs/bubblewrap
- **Android App Signing:** https://developer.android.com/studio/publish/app-signing

## 🎯 Next Steps

1. ✅ Get your SHA256 fingerprint
2. ✅ Choose your package name
3. ✅ Update `public/.well-known/assetlinks.json`
4. ✅ Deploy to Firebase
5. ✅ Test with PWABuilder
6. ✅ Generate Android app with PWABuilder
7. ✅ Test on Android device
8. ✅ Publish to Google Play (optional)

## 🆘 Need Help?

### Verify Your Setup

Use Google's verification tool:
https://developers.google.com/digital-asset-links/tools/generator

Enter:
- **Hosting site domain:** `your-domain.web.app`
- **App package name:** `com.whatthetag.app`

It will tell you if your setup is correct.

### Test assetlinks.json

```bash
# Test locally
curl http://localhost:3000/.well-known/assetlinks.json

# Test on Firebase
curl https://your-domain.web.app/.well-known/assetlinks.json
```

### Debug TWA Issues

1. Enable Chrome flags on Android:
   - `chrome://flags/#enable-twa-desktop-support`
2. Check Chrome logs:
   - `adb logcat | grep -i twa`
3. Use Chrome DevTools to inspect the app

---

**Summary:** TWA allows your PWA to run as a native Android app without browser UI. Configure `assetlinks.json` with your package name and SHA256 fingerprint, deploy to Firebase, and use PWABuilder to generate the Android app. 🚀
