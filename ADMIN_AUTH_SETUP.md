# Admin Authentication Setup Guide

## 🔐 Overview

The admin site now includes email/password authentication to protect CRUD operations. Only authenticated users can add, edit, or delete inventory assets.

## 📋 Prerequisites

- Firebase project with Authentication enabled
- Admin site deployed or running locally
- Access to Firebase Console

## 🚀 Setup Steps

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

### Step 2: Create Admin Users

#### Option A: Using Firebase Console (Recommended for initial setup)

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Add user**
5. Repeat for each admin user

**Note:** These users can now log in to the admin site.

#### Option B: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create user via Firebase Admin SDK (requires a script)
```

#### Option C: Custom Registration Page (Advanced)

You can create a registration page if you want users to self-register. However, for admin access, it's recommended to create users manually in the Firebase Console.

### Step 3: (Optional) Assign Admin Roles

If you want to implement role-based access control (admin vs. regular user):

1. In Firebase Console, go to **Firestore Database**
2. Create a `users` collection
3. Add a document with the user's UID as the document ID
4. Add fields:
   ```json
   {
     "email": "admin@example.com",
     "role": "admin"
   }
   ```

**Note:** The current Firestore rules allow any authenticated user to perform CRUD operations. Role-based restrictions can be added later if needed.

### Step 4: Test Authentication

1. Start the admin site:
   ```bash
   cd admin
   npm run dev
   ```

2. Open `http://localhost:3001`
3. You should be redirected to the login page
4. Enter the email and password you created
5. You should be logged in and see the dashboard

## 🔒 Security Features

### Authentication Flow

1. User visits admin site
2. `ProtectedRoute` component checks if user is authenticated
3. If not authenticated, redirect to `/login`
4. User enters credentials
5. Firebase Authentication validates credentials
6. On success, user is redirected to dashboard
7. Auth state is maintained across page refreshes

### Protected Routes

All routes except `/login` are protected:
- `/` - Dashboard
- `/add` - Add Asset
- `/edit/:id` - Edit Asset
- `/deleted` - Deleted Assets

### Firestore Rules

The Firestore rules have been updated to require authentication:

```javascript
// Inventory collection
match /inventory/{itemId} {
  // Public read access (for main app scanning)
  allow read: if true;
  
  // Authenticated users can create, update, delete (admin site)
  allow create: if isAuthenticated();
  allow update: if isAuthenticated();
  allow delete: if isAuthenticated();
}

// Deleted assets - authenticated users only
match /deleted_assets/{documentId} {
  allow read, write: if isAuthenticated();
}

// Counters - authenticated users only
match /counters/{documentId} {
  allow read, write: if isAuthenticated();
}
```

### Error Handling

The login page handles various authentication errors:
- Invalid email format
- Account not found
- Incorrect password
- Account disabled
- Too many login attempts
- Invalid credentials

## 🎨 UI Features

### Login Page

- Clean, centered login form
- Email and password fields
- Error messages with dismiss button
- Loading state during authentication
- User-friendly error messages

### Dashboard Header

- User avatar with first letter of email
- User email display
- Logout button with icon
- Responsive design (email hidden on mobile)

### Logout Functionality

- Click logout icon in header
- Signs out from Firebase Authentication
- Redirects to login page
- Clears authentication state

## 🔧 Configuration

### Environment Variables

No additional environment variables are needed. The admin site uses the same Firebase configuration as before.

### Firebase Configuration

Ensure your `.env.local` file has the correct Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🚢 Deployment

### Deploy Updated Rules

After setting up authentication, deploy the updated Firestore rules:

```bash
firebase deploy --only firestore:rules
```

### Deploy Admin Site

```bash
cd admin
npm run build
cd ..
firebase deploy --only hosting:admin
```

## 🧪 Testing

### Test Login Flow

1. Visit admin site
2. Should redirect to login page
3. Enter wrong credentials → Should show error
4. Enter correct credentials → Should redirect to dashboard
5. Refresh page → Should stay logged in

### Test Logout Flow

1. Click logout button
2. Should redirect to login page
3. Try accessing dashboard directly → Should redirect to login
4. Auth state should be cleared

### Test Protected Routes

1. Logout
2. Try accessing `/add` directly → Should redirect to login
3. Login
4. Access `/add` → Should work

### Test Firestore Rules

1. Logout
2. Try to add asset via API → Should fail
3. Login
4. Add asset → Should succeed

## 🔍 Troubleshooting

### Can't Login

**Problem:** Login fails with "Invalid email or password"

**Solutions:**
1. Verify user exists in Firebase Console → Authentication → Users
2. Check email is correct (case-sensitive)
3. Reset password if needed
4. Check Firebase Authentication is enabled

### Redirect Loop

**Problem:** Page keeps redirecting between login and dashboard

**Solutions:**
1. Clear browser cache and cookies
2. Check AuthContext is properly wrapped in App.tsx
3. Verify Firebase configuration is correct
4. Check browser console for errors

### Can't Perform CRUD Operations

**Problem:** Logged in but can't add/edit/delete assets

**Solutions:**
1. Check Firestore rules are deployed
2. Verify user is authenticated (check auth state)
3. Check browser console for permission errors
4. Ensure Firestore rules allow authenticated users

### Session Expires Too Quickly

**Problem:** User gets logged out frequently

**Solutions:**
1. Firebase Authentication sessions last until explicitly logged out
2. Check if browser is clearing cookies
3. Verify `onAuthStateChanged` is working correctly
4. Check for multiple Firebase instances

## 📊 User Management

### View All Users

In Firebase Console:
1. Go to **Authentication** → **Users**
2. See all registered users
3. View user details (email, creation date, last sign-in)

### Disable a User

1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Disable user**
4. User can no longer log in

### Delete a User

1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Delete user**
4. User is permanently removed

### Reset Password

1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Reset password**
4. Enter new password
5. User can log in with new password

## 🔐 Best Practices

### For Production

1. **Use Strong Passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, and symbols
   - Firebase enforces minimum 6 characters

2. **Limit Admin Access**
   - Only create accounts for trusted users
   - Regularly review user list
   - Remove inactive users

3. **Enable Additional Security**
   - Consider adding reCAPTCHA
   - Implement rate limiting
   - Monitor authentication logs

4. **Backup User Data**
   - Export user list regularly
   - Document admin accounts
   - Keep password reset procedures

### For Development

1. **Use Test Accounts**
   - Create separate test accounts
   - Don't use production credentials
   - Test edge cases (wrong password, disabled account)

2. **Test Authentication Flow**
   - Login with correct credentials
   - Login with wrong credentials
   - Logout and verify redirect
   - Test session persistence

3. **Verify Firestore Rules**
   - Test unauthenticated access (should fail)
   - Test authenticated access (should succeed)
   - Verify data validation rules

## 📚 Related Documentation

- **Admin Setup**: `ADMIN_SETUP_GUIDE.md`
- **Admin Quick Start**: `ADMIN_QUICK_START.md`
- **Firestore Rules**: `firestore.rules`
- **Main App**: `README.md`

## ✅ Checklist

Before deploying:

- [ ] Enable Email/Password authentication in Firebase Console
- [ ] Create at least one admin user
- [ ] Test login with correct credentials
- [ ] Test login with wrong credentials
- [ ] Verify logout works
- [ ] Test protected routes
- [ ] Deploy updated Firestore rules
- [ ] Test CRUD operations while authenticated
- [ ] Verify unauthenticated users can't perform CRUD
- [ ] Test session persistence (refresh page)

## 🎉 Success!

Your admin site now has:

- ✅ Email/password authentication
- ✅ Protected routes
- ✅ Logout functionality
- ✅ User-friendly login page
- ✅ Secure Firestore rules
- ✅ Session persistence
- ✅ Error handling

---

**Need help?** Check the troubleshooting section or refer to Firebase Authentication documentation.
