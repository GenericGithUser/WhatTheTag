# WhatTheTag - Test Documentation

This document provides comprehensive information about the test suite for the WhatTheTag application.

## Test Structure

The test suite is organized into the following categories:

### 1. Type Tests (`src/__tests__/types.test.ts`)
Tests for TypeScript type definitions and interfaces.

**Coverage:**
- Category type validation (Fixed, Electronics)
- Status type validation (Good, Has Defects, BAD)
- InventoryItem interface structure
- Required and optional fields validation
- Image URL format validation

**Run:** `npm test -- types.test.ts`

### 2. Data Service Tests (`src/__tests__/inventory.test.ts`)
Tests for the inventory data service layer.

**Coverage:**
- Demo data generation and validation
- getInventoryItems() function
- getInventoryItemById() function
- getInventoryItemByAssetNumber() function
- Status color mapping (getStatusColor, getStatusHexColor, getStatusIcon)
- Category color mapping (getCategoryHexColor, getCategoryIcon)
- Case-insensitive asset number search
- Error handling for non-existent items

**Run:** `npm test -- inventory.test.ts`

### 3. Firebase Tests (`src/__tests__/firebase.test.ts`)
Tests for Firebase Firestore configuration and operations.

**Coverage:**
- Firebase initialization
- getInventoryItems() - fetch all items
- getInventoryItemById() - fetch single item
- getInventoryItemByAssetNumber() - query by asset number
- addInventoryItem() - create new item
- updateInventoryItem() - update existing item
- deleteInventoryItem() - delete item
- getItemsByCategory() - filter by category
- getItemsByStatus() - filter by status
- Error handling for all operations

**Run:** `npm test -- firebase.test.ts`

### 4. Component Tests

#### Dashboard Tests (`src/__tests__/Dashboard.test.tsx`)
Tests for the main dashboard component.

**Coverage:**
- Component rendering
- Loading state display
- Inventory items display
- Status badges rendering
- Category chips rendering
- Search functionality
- Segment filter functionality
- Stats counts display
- Empty state handling
- FAB button rendering
- Search filtering

**Run:** `npm test -- Dashboard.test.tsx`

#### Scanner Tests (`src/__tests__/Scanner.test.tsx`)
Tests for the QR/barcode scanner component.

**Coverage:**
- Component rendering
- Scan instructions display
- Manual entry section
- Quick demo buttons
- Search button enable/disable
- Scanned item details display
- Loading state during lookup
- Asset not found alert
- View Details and Scan Again buttons
- Asset number display
- Status and category badges
- Manual search with Enter key
- Reset to scan view

**Run:** `npm test -- Scanner.test.tsx`

#### ItemDetail Tests (`src/__tests__/ItemDetail.test.tsx`)
Tests for the item detail view component.

**Coverage:**
- Loading spinner display
- Item information display (name, asset number, description)
- Designated owner display
- Category and status display
- Status badge with correct color
- Category badge with correct color
- Last updated date formatting
- QR code representation
- Asset information section
- Asset not found state
- Different category handling (Fixed, Electronics)
- Different status handling (Good, Has Defects, BAD)
- Image display and error handling
- All asset information fields
- Items without timestamps

**Run:** `npm test -- ItemDetail.test.tsx`

### 5. App Component Tests (`src/__tests__/App.test.tsx`)
Tests for the main App component.

**Coverage:**
- App rendering without crashing
- Router rendering
- Ionic setup configuration

**Run:** `npm test -- App.test.tsx`

### 6. Firestore Rules Tests (`src/__tests__/firestore-rules.test.ts`)
Tests for Firestore security rules validation.

**Coverage:**
- Rules file structure validation
- Helper functions (isAuthenticated, isAdmin)
- Inventory collection rules
  - Public read access
  - Authentication requirements for create
  - Required fields validation
  - Category values validation
  - Status values validation
  - Field type and format validation
  - Admin-only update and delete
- Users collection rules
  - User self-access
  - Admin access to other users
  - User creation validation
  - Role validation
  - Role change prevention
- Valid data scenarios
- Invalid data scenarios
- Authentication scenarios

**Run:** `npm test -- firestore-rules.test.ts`

### 7. Integration Tests (`src/__tests__/integration.test.ts`)
End-to-end integration tests for complete user flows.

**Coverage:**
- Complete user flow (load items → select item → view details)
- QR scan flow (scan → retrieve item → display details)
- Category filtering
- Status filtering
- Text search functionality
- Non-existent item handling
- Data consistency across operations
- Demo data schema validation
- Data integrity (unique IDs, unique asset numbers, valid URLs)
- Edge cases (case-insensitive search, special characters, long strings, empty strings)

**Run:** `npm test -- integration.test.ts`

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Tests in CI Mode
```bash
npm run test:ci
```

### Run Specific Test File
```bash
npm test -- <test-file-name>
```

Examples:
```bash
npm test -- types.test.ts
npm test -- Dashboard.test.tsx
npm test -- integration.test.ts
```

### Run Specific Test Suite
```bash
npm test -- -t "test suite name"
```

Example:
```bash
npm test -- -t "Category Type"
npm test -- -t "Dashboard Component"
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- **Preset:** ts-jest
- **Environment:** jsdom
- **Test Match Pattern:** `**/__tests__/**/*.test.ts?(x)`
- **Coverage Collection:** All TypeScript files in src/
- **Module Mapping:** CSS files mocked, path aliases configured
- **Transform:** TypeScript files transformed with ts-jest
- **Setup Files:** `src/setupTests.tsx`

### Test Setup (`src/setupTests.tsx`)
- Imports @testing-library/jest-dom for extended matchers
- Mocks browser APIs (matchMedia, IntersectionObserver, ResizeObserver)
- Mocks Ionic React components
- Mocks Ionic React Router
- Mocks react-router-dom hooks
- Mocks html5-qrcode library
- Mocks ionicons
- Mocks Firebase modules

## Test Coverage Goals

The test suite aims to cover:

1. **Unit Tests (70%)**
   - Type definitions
   - Utility functions
   - Data service functions
   - Helper functions

2. **Component Tests (20%)**
   - Rendering
   - User interactions
   - State management
   - Error handling

3. **Integration Tests (10%)**
   - Complete user flows
   - Data consistency
   - Edge cases

## Mocking Strategy

### Firebase Mocking
Firebase modules are mocked to avoid actual database calls during testing. This allows:
- Fast test execution
- Deterministic test results
- No external dependencies
- Easy testing of error scenarios

### Ionic Component Mocking
Ionic components are mocked to simple HTML elements to:
- Avoid complex Ionic setup
- Focus on application logic
- Speed up test execution
- Enable easier assertions

### Router Mocking
React Router hooks are mocked to:
- Test navigation logic
- Verify route parameters
- Control navigation in tests

## Continuous Integration

The test suite is designed to run in CI environments with:

```bash
npm run test:ci
```

This command:
- Runs all tests
- Generates coverage report
- Uses CI-optimized settings
- Fails on any test failure

## Troubleshooting

### Tests Not Running
1. Ensure all dependencies are installed: `npm install`
2. Check Jest configuration in `jest.config.js`
3. Verify setup file exists: `src/setupTests.tsx`

### Mock Not Working
1. Check mock file path in jest.config.js
2. Ensure mock is in setupTests.tsx
3. Verify mock syntax

### Coverage Report Missing
1. Run with coverage flag: `npm run test:coverage`
2. Check coverage configuration in jest.config.js
3. View report in `coverage/` directory

## Test Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Test user-facing functionality

2. **Use Descriptive Test Names**
   - Clear, concise descriptions
   - Explain expected behavior

3. **Keep Tests Independent**
   - Each test should be isolated
   - Use beforeEach for setup
   - Clean up after tests

4. **Test Edge Cases**
   - Empty inputs
   - Invalid data
   - Error scenarios
   - Boundary conditions

5. **Maintain Test Data**
   - Use consistent test data
   - Document test fixtures
   - Update when data model changes

## Future Test Improvements

Potential areas for additional testing:

1. **Performance Tests**
   - Load time measurements
   - Render performance
   - Memory usage

2. **Accessibility Tests**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader compatibility

3. **Visual Regression Tests**
   - Screenshot comparisons
   - UI consistency checks

4. **End-to-End Tests**
   - Full user journey testing
   - Cross-browser testing
   - Mobile device testing

5. **Security Tests**
   - Input validation
   - XSS prevention
   - Authentication flows
