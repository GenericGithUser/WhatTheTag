# Camera Testing Guide

## Quick Reference

### ✅ Camera Works On:
- `http://localhost:*` (development)
- `https://*` (production, Firebase Hosting)

### ❌ Camera Does NOT Work On:
- `http://192.168.x.x:*` (local network without HTTPS)
- `http://your-domain.com` (non-HTTPS)

## Testing Steps

### 1. Local Development (Desktop/Laptop)

```bash
npm run dev
```

Access: `http://localhost:3000`

**Expected Behavior:**
- Click "Start Scanning"
- Browser prompts for camera permission
- Allow access
- Camera view appears
- Point at QR code to scan

**If Camera Not Available:**
- Use manual entry: Type asset number (e.g., `AST-001`)
- Click "Search"
- Item details will display

### 2. Mobile Testing (Recommended)

```bash
npm run build
firebase deploy
```

Access the Firebase URL on your phone.

**Expected Behavior:**
- Full camera functionality
- Best QR scanning experience
- Responsive mobile UI

### 3. Generate Test QR Codes

Use an online QR generator:
- https://www.qr-code-generator.com/
- https://qr-code-generator.com/

Create QR codes with these values:
```
AST-001
AST-002
AST-003
AST-004
AST-005
```

Print or display on another screen, then scan with the app.

## Troubleshooting

### "Unable to access camera"

**Check:**
1. Are you on HTTPS or localhost?
2. Did you allow camera permission?
3. Does your device have a camera?
4. Is another app using the camera?

**Solutions:**
- Click address bar camera icon → Allow
- Close other apps using camera
- Try a different browser
- Use manual entry instead

### "No camera found"

**Check:**
1. Device has a camera
2. Camera is not disabled in system settings
3. Browser has camera access

**Solutions:**
- Connect external USB webcam
- Check system preferences/settings
- Try different browser

### QR Code Not Detected

**Check:**
1. QR code is well-lit
2. QR code is within frame
3. QR code is not damaged
4. Camera is steady

**Solutions:**
- Improve lighting
- Hold camera steady
- Move closer/further
- Ensure QR code is at least 2x2 cm
- Clean camera lens

## Browser Support

| Browser | Version | Camera Support |
|---------|---------|----------------|
| Chrome | 53+ | ✅ Full |
| Firefox | 36+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| IE | Any | ❌ None |

## Development Tips

### For Desktop Testing Without Camera

1. **Use Manual Entry**
   - Type asset number directly
   - Faster for development
   - No camera needed

2. **Use Quick Demo Buttons**
   - Click AST-001, AST-002, etc.
   - Simulates scanning
   - Great for UI testing

3. **Browser DevTools**
   - Test responsive design
   - Simulate mobile devices
   - Check console for errors

### For Production Testing

1. **Deploy to Firebase**
   ```bash
   npm run build
   firebase deploy
   ```

2. **Test on Multiple Devices**
   - iPhone (Safari)
   - Android (Chrome)
   - Desktop (Chrome/Firefox)

3. **Test Different Lighting**
   - Bright light
   - Dim light
   - Outdoor light

## Performance Tips

### Optimize QR Scanning

1. **QR Code Quality**
   - High contrast (black on white)
   - Minimum 2x2 cm size
   - No damage or wrinkles
   - Quiet zone (white border) around QR

2. **Scanning Environment**
   - Good lighting
   - Steady camera
   - Clean lens
   - Proper distance (15-30 cm)

3. **App Performance**
   - Scanner runs at 10 FPS
   - Scanning box is 250x250 pixels
   - Supports multiple barcode formats

## Security Notes

### Camera Permissions

- Browser always asks for permission
- User can revoke anytime
- Permission is per-site
- HTTPS is required (except localhost)

### Data Privacy

- Camera data stays on device
- No images are uploaded
- Only QR code text is processed
- No persistent camera access

## Next Steps

1. ✅ Test on localhost (camera should work)
2. ✅ Deploy to Firebase (HTTPS)
3. ✅ Test on mobile device
4. ✅ Generate and scan test QR codes
5. ✅ Test manual entry fallback
6. ✅ Test on different browsers

## Support

If camera still doesn't work:

1. Check browser console for errors
2. Verify HTTPS or localhost
3. Check browser permissions
4. Try different browser
5. Use manual entry as workaround

For production issues:
- Check Firebase Hosting URL is HTTPS
- Verify custom domain has SSL certificate
- Test on multiple devices
- Check browser compatibility
