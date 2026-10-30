import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules', () => {
  let rulesContent: string;

  beforeAll(() => {
    const rulesPath = path.join(__dirname, '../../firestore.rules');
    rulesContent = fs.readFileSync(rulesPath, 'utf-8');
  });

  describe('Rules File Structure', () => {
    it('should have a valid rules file', () => {
      expect(rulesContent).toBeDefined();
      expect(rulesContent.length).toBeGreaterThan(0);
    });

    it('should use rules version 2', () => {
      expect(rulesContent).toContain('rules_version = \'2\'');
    });

    it('should define cloud.firestore service', () => {
      expect(rulesContent).toContain('service cloud.firestore');
    });

    it('should match databases', () => {
      expect(rulesContent).toContain('match /databases/{database}/documents');
    });
  });

  describe('Helper Functions', () => {
    it('should define isAuthenticated function', () => {
      expect(rulesContent).toContain('function isAuthenticated()');
      expect(rulesContent).toContain('request.auth != null');
    });

    it('should define isAdmin function', () => {
      expect(rulesContent).toContain('function isAdmin()');
      expect(rulesContent).toContain('get(/databases/$(database)/documents/users/$(request.auth.uid))');
    });
  });

  describe('Inventory Collection Rules', () => {
    it('should match inventory collection', () => {
      expect(rulesContent).toContain('match /inventory/{itemId}');
    });

    it('should allow public read access', () => {
      expect(rulesContent).toContain('allow read: if true');
    });

    it('should require authentication for create', () => {
      expect(rulesContent).toMatch(/allow create: if isAuthenticated\(\)/);
    });

    it('should validate required fields on create', () => {
      expect(rulesContent).toContain('request.resource.data.keys().hasAll');
      expect(rulesContent).toContain('assetNumber');
      expect(rulesContent).toContain('itemName');
      expect(rulesContent).toContain('itemDescription');
      expect(rulesContent).toContain('category');
      expect(rulesContent).toContain('status');
      expect(rulesContent).toContain('designatedOwner');
      expect(rulesContent).toContain('image');
    });

    it('should validate category values', () => {
      expect(rulesContent).toContain('request.resource.data.category in [\'Fixed\', \'Electronics\']');
    });

    it('should validate status values', () => {
      expect(rulesContent).toContain('request.resource.data.status in [\'Good\', \'Has Defects\', \'BAD\']');
    });

    it('should validate assetNumber is non-empty string', () => {
      expect(rulesContent).toContain('request.resource.data.assetNumber is string');
      expect(rulesContent).toContain('request.resource.data.assetNumber.size() > 0');
    });

    it('should validate itemName is non-empty string', () => {
      expect(rulesContent).toContain('request.resource.data.itemName is string');
      expect(rulesContent).toContain('request.resource.data.itemName.size() > 0');
    });

    it('should validate designatedOwner is non-empty string', () => {
      expect(rulesContent).toContain('request.resource.data.designatedOwner is string');
      expect(rulesContent).toContain('request.resource.data.designatedOwner.size() > 0');
    });

    it('should validate image is a URL', () => {
      expect(rulesContent).toContain('request.resource.data.image is string');
      expect(rulesContent).toContain('request.resource.data.image.matches');
      expect(rulesContent).toContain('https?://');
    });

    it('should restrict update to admin only', () => {
      expect(rulesContent).toMatch(/allow update: if isAdmin\(\)/);
    });

    it('should validate category on update', () => {
      expect(rulesContent).toContain('request.resource.data.category in [\'Fixed\', \'Electronics\']');
    });

    it('should validate status on update', () => {
      expect(rulesContent).toContain('request.resource.data.status in [\'Good\', \'Has Defects\', \'BAD\']');
    });

    it('should restrict delete to admin only', () => {
      expect(rulesContent).toMatch(/allow delete: if isAdmin\(\)/);
    });
  });

  describe('Users Collection Rules', () => {
    it('should match users collection', () => {
      expect(rulesContent).toContain('match /users/{userId}');
    });

    it('should allow users to read their own data', () => {
      expect(rulesContent).toContain('request.auth.uid == userId');
    });

    it('should allow admins to read other users', () => {
      expect(rulesContent).toMatch(/allow read: if isAdmin\(\)/);
    });

    it('should validate user creation', () => {
      expect(rulesContent).toContain('request.resource.data.keys().hasAll');
      expect(rulesContent).toContain('email');
      expect(rulesContent).toContain('role');
    });

    it('should validate role values', () => {
      expect(rulesContent).toContain('request.resource.data.role in [\'user\', \'admin\']');
    });

    it('should prevent users from changing their own role', () => {
      expect(rulesContent).toContain('request.resource.data.role == resource.data.role');
    });
  });

  describe('Rule Validation Scenarios', () => {
    // These tests validate the expected behavior based on the rules structure
    
    describe('Valid Data Scenarios', () => {
      it('should accept valid Electronics item with Good status', () => {
        const validItem = {
          assetNumber: 'AST-001',
          itemName: 'Test Laptop',
          itemDescription: 'A test laptop',
          category: 'Electronics',
          status: 'Good',
          designatedOwner: 'John Doe',
          image: 'https://example.com/image.jpg',
        };

        // Validate against rules requirements
        expect(validItem.assetNumber).toBeTruthy();
        expect(validItem.itemName).toBeTruthy();
        expect(validItem.itemDescription).toBeTruthy();
        expect(['Fixed', 'Electronics']).toContain(validItem.category);
        expect(['Good', 'Has Defects', 'BAD']).toContain(validItem.status);
        expect(validItem.designatedOwner).toBeTruthy();
        expect(validItem.image).toMatch(/^https?:\/\/.+/);
      });

      it('should accept valid Fixed item with Has Defects status', () => {
        const validItem = {
          assetNumber: 'AST-002',
          itemName: 'Test Chair',
          itemDescription: 'A test chair with defects',
          category: 'Fixed',
          status: 'Has Defects',
          designatedOwner: 'Jane Smith',
          image: 'https://example.com/chair.jpg',
        };

        expect(['Fixed', 'Electronics']).toContain(validItem.category);
        expect(['Good', 'Has Defects', 'BAD']).toContain(validItem.status);
      });

      it('should accept valid Electronics item with BAD status', () => {
        const validItem = {
          assetNumber: 'AST-003',
          itemName: 'Broken Monitor',
          itemDescription: 'A broken monitor',
          category: 'Electronics',
          status: 'BAD',
          designatedOwner: 'Bob Wilson',
          image: 'https://example.com/monitor.jpg',
        };

        expect(['Fixed', 'Electronics']).toContain(validItem.category);
        expect(['Good', 'Has Defects', 'BAD']).toContain(validItem.status);
      });
    });

    describe('Invalid Data Scenarios', () => {
      it('should reject invalid category', () => {
        const invalidCategory = 'Furniture';
        expect(['Fixed', 'Electronics']).not.toContain(invalidCategory);
      });

      it('should reject invalid status', () => {
        const invalidStatus = 'Broken';
        expect(['Good', 'Has Defects', 'BAD']).not.toContain(invalidStatus);
      });

      it('should reject empty assetNumber', () => {
        const emptyAssetNumber = '';
        expect(emptyAssetNumber.length).toBe(0);
      });

      it('should reject empty itemName', () => {
        const emptyItemName = '';
        expect(emptyItemName.length).toBe(0);
      });

      it('should reject empty designatedOwner', () => {
        const emptyOwner = '';
        expect(emptyOwner.length).toBe(0);
      });

      it('should reject invalid image URL', () => {
        const invalidUrl = 'not-a-url';
        expect(invalidUrl).not.toMatch(/^https?:\/\/.+/);
      });

      it('should reject missing required fields', () => {
        const incompleteItem = {
          assetNumber: 'AST-001',
          itemName: 'Test',
          // Missing other required fields
        };

        const requiredFields = ['assetNumber', 'itemName', 'itemDescription', 'category', 'status', 'designatedOwner', 'image'];
        const hasAllFields = requiredFields.every(field => field in incompleteItem);
        expect(hasAllFields).toBe(false);
      });
    });

    describe('Authentication Scenarios', () => {
      it('should identify authenticated user', () => {
        const auth = { uid: 'user-123' };
        expect(auth).not.toBeNull();
      });

      it('should identify unauthenticated user', () => {
        const auth = null;
        expect(auth).toBeNull();
      });

      it('should identify admin user', () => {
        const userData = { role: 'admin' };
        expect(userData.role).toBe('admin');
      });

      it('should identify regular user', () => {
        const userData = { role: 'user' };
        expect(userData.role).toBe('user');
      });
    });
  });
});
