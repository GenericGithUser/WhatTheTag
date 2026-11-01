# Firebase Configuration & Authentication Quick Reference

## 🔧 Firebase.json Configuration

### Multi-Site Hosting Setup

The `firebase.json` file has been updated to support both the main app and admin site:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": [
    {
      "target": "app",
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "/sw.js",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache"
            }
          ]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000"
            }
          ]
        }
      ]
    },
    {
      "target": "admin",
      "public": "admin/dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000"
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Changes

1. **Array-based hosting configuration** - Now supports multiple sites
2. **Target names** - `app` for main site, `admin` for admin site
3. **Separate public directories** - `dist` for app, `admin/dist` for admin
4. **Preserved headers** - Service worker caching and image caching for main app
5. **Admin headers** - Image caching for admin site

### Deployment Commands

```bash
# Add hosting targets (one-time setup)
firebase target:apply hosting app whatthetag-app
firebase target:apply hosting admin whatthetag-admin

# Deploy both sites
firebase deploy --only hosting

# Deploy only main app
firebase deploy --only hosting:app

# Deploy only admin site
firebase deploy --only hosting:admin
```

### URLs After Deployment

- **Main App**: `https://your-project.web.app` or custom domain
- **Admin Site**: `https://your-project-admin.web.app` or custom domain

## 🔐 Authentication Setup

### Quick Setup (5 Minutes)

#### 1. Enable Authentication

```bash
# Go to Firebase Console
# Authentication → Sign-in method → Email/Password → Enable
```

#### 2. Create Admin User

```bash
# Firebase Console → Authentication → Users → Add user
# Enter email and password
```

#### 3. Test Login

```bash
cd admin
npm run dev
# Open http://localhost:3001
# Login with your credentials
```

### Authentication Features

✅ **Email/Password Login**
- Secure Firebase Authentication
- Error handling for invalid credentials
- Session persistence across page refreshes

✅ **Protected Routes**
- All routes except `/login` require authentication
- Automatic redirect to login if not authenticated
- Loading state while checking auth

✅ **User Interface**
- Clean login page with error messages
- User avatar in header
- Email display
- Logout button

✅ **Security**
- Firestore rules require authentication for CRUD operations
- Public read access maintained for main app scanning
- Admin operations protected

### Firestore Rules

Updated to require authentication:

```javascript
// Inventory - public read, authenticated write
match /inventory/{itemId} {
  allow read: if true;  // Main app can scan
  allow create, update, delete: if isAuthenticated();  // Admin site requires auth
}

// Deleted assets - authenticated only
match /deleted_assets/{documentId} {
  allow read, write: if isAuthenticated();
}

// Counters - authenticated only
match /counters/{documentId} {
  allow read, write: if isAuthenticated();
}
```

### Deploy Updated Rules

```bash
firebase deploy --only firestore:rules
```

## 🚀 Complete Deployment Workflow

### 1. Build Both Sites

```bash
# Build main app
npm run build

# Build admin site
cd admin
npm run build
cd ..
```

### 2. Deploy Everything

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy both hosting targets
firebase deploy --only hosting
```

### 3. Verify Deployment

```bash
# Test main app
curl https://your-project.web.app

# Test admin site
curl https://your-project-admin.web.app

# Test authentication
# Open admin site in browser and login
```

## 📋 Checklist

### Firebase.json

- [ ] Updated to array-based hosting configuration
- [ ] Both targets configured (app and admin)
- [ ] Headers preserved for both sites
- [ ] Hosting targets applied

### Authentication

- [ ] Email/Password authentication enabled
- [ ] At least one admin user created
- [ ] Login page tested
- [ ] Logout functionality tested
- [ ] Protected routes verified

### Firestore Rules

- [ ] Updated to require authentication for writes
- [ ] Public read access maintained
- [ ] Rules deployed to Firebase

### Deployment

- [ ] Both sites built successfully
- [ ] Firestore rules deployed
- [ ] Both hosting targets deployed
- [ ] Main app accessible
- [ ] Admin site accessible
- [ ] Login works on deployed admin site

## 🔍 Troubleshooting

### Firebase.json Issues

**Problem:** Headers not being applied

**Solution:**
- Verify JSON syntax is valid
- Check target names match exactly
- Reapply targets: `firebase target:apply hosting app whatthetag-app`

**Problem:** Admin site not deploying

**Solution:**
- Ensure `admin/dist` directory exists
- Run `cd admin && npm run build` first
- Check `firebase.json` has correct public path

### Authentication Issues

**Problem:** Can't login

**Solution:**
- Verify user exists in Firebase Console
- Check Email/Password authentication is enabled
- Verify Firebase configuration in `.env.local`

**Problem:** Redirect loop

**Solution:**
- Clear browser cache and cookies
- Check AuthContext is properly wrapped
- Verify Firebase configuration

**Problem:** Can't perform CRUD operations

**Solution:**
- Deploy updated Firestore rules
- Verify user is authenticated
- Check browser console for errors

## 📚 Related Documentation

- **Admin Auth Setup**: `ADMIN_AUTH_SETUP.md` - Detailed authentication guide
- **Admin Setup**: `ADMIN_SETUP_GUIDE.md` - Complete admin setup
- **Admin Quick Start**: `ADMIN_QUICK_START.md` - Fast reference
- **Main App**: `README.md` - Main app documentation

## ✅ Summary

### What Changed

1. **firebase.json** - Updated to support multi-site hosting with proper headers
2. **Authentication** - Added email/password login with protected routes
3. **Firestore Rules** - Updated to require authentication for admin operations
4. **UI** - Added login page, user display, and logout functionality

### What You Need to Do

1. ✅ Enable Email/Password authentication in Firebase Console
2. ✅ Create admin user(s)
3. ✅ Deploy updated Firestore rules
4. ✅ Deploy both sites with new firebase.json
5. ✅ Test login and CRUD operations

### Result

- ✅ Main app continues to work (public read access)
- ✅ Admin site requires authentication
- ✅ Both sites deploy to separate URLs
- ✅ Headers properly configured for both sites
- ✅ Secure CRUD operations

---

**Status:** ✅ Ready to deploy! Enable authentication, create users, and deploy.
