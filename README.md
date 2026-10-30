# WhatTheTag

A Progressive Web App (PWA) for scanning and managing inventory assets using QR codes and barcodes. Built with Ionic React, Firebase Firestore, and styled with the Gruvbox Light theme.

## Features

- 📱 **QR/Barcode Scanner** - Scan asset tags with your device camera
- 🔍 **Manual Search** - Enter asset numbers manually
- 📊 **Dashboard** - View all inventory items with filtering and search
- 📋 **Asset Details** - View comprehensive information for each asset
- 🔥 **Firebase Integration** - Real-time data sync with Firestore
- 🎨 **Gruvbox Theme** - Beautiful, eye-friendly color scheme
- 📲 **PWA Support** - Install on mobile devices for offline access

## Data Model

Each inventory item contains:

- **AssetNumber** - Unique identifier (e.g., AST-001)
- **ItemName** - Name of the asset
- **ItemDescription** - Detailed description
- **Category** - Either "Fixed" or "Electronics"
- **Status** - One of: "Good", "Has Defects", or "BAD"
- **DesignatedOwner** - Person responsible for the asset
- **Image** - URL link to asset image

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a Web app and copy the configuration
6. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

7. Update `.env.local` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Deploy Firestore Rules

Deploy the security rules to Firestore:

```bash
firebase deploy --only firestore:rules
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or deploy everything (hosting + firestore rules):

```bash
firebase deploy
```

## Project Structure

```
├── src/
│   ├── firebase/
│   │   └── config.ts          # Firebase initialization and Firestore operations
│   ├── data/
│   │   └── inventory.ts       # Data service with fallback demo data
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard with stats and item list
│   │   ├── Scanner.tsx        # QR/Barcode scanner page
│   │   └── ItemDetail.tsx     # Individual asset detail view
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles with Gruvbox theme
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── favicon.svg            # App icon
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── firebase.json              # Firebase configuration
├── .env.example               # Environment variables template
└── .env.local                 # Local environment variables (gitignored)
```

## Firestore Security Rules

The app includes comprehensive security rules that:

- Allow public read access to inventory items (for scanning)
- Require authentication for creating items
- Validate data structure and field values
- Restrict updates/deletes to admin users
- Include role-based access control

## Demo Mode

If Firebase is not configured, the app automatically falls back to demo data with 12 sample assets. This allows you to test the UI without setting up Firebase.

## Color Scheme (Gruvbox Light)

- **Background**: Light brown (#fbf1c7, #ebdbb2, #d5c4a1)
- **Functions/Good**: Green (#98971a)
- **Information/Defects**: Yellow (#d79921)
- **Identifiers**: Blue (#458588)
- **Warnings/BAD**: Red (#cc241d)
- **Emphasis**: Orange (#d65d0e)
- **Constants/Fixed**: Aqua (#689d6a)

## Testing

The app includes a comprehensive test suite covering types, data services, Firebase operations, components, Firestore rules, and integration flows.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Categories

- **Type Tests** - TypeScript type definitions validation
- **Data Service Tests** - Inventory data service functions
- **Firebase Tests** - Firestore operations and CRUD
- **Component Tests** - Dashboard, Scanner, ItemDetail components
- **Firestore Rules Tests** - Security rules validation
- **Integration Tests** - End-to-end user flows

See [TESTING.md](./TESTING.md) for detailed test documentation.

## License

MIT
