import { InventoryItem, Category, Status } from '../types';

describe('Type Definitions', () => {
  describe('Category Type', () => {
    it('should accept "Fixed" as valid category', () => {
      const category: Category = 'Fixed';
      expect(category).toBe('Fixed');
    });

    it('should accept "Electronics" as valid category', () => {
      const category: Category = 'Electronics';
      expect(category).toBe('Electronics');
    });

    it('should only accept two valid categories', () => {
      const validCategories: Category[] = ['Fixed', 'Electronics'];
      expect(validCategories).toHaveLength(2);
      expect(validCategories).toContain('Fixed');
      expect(validCategories).toContain('Electronics');
    });
  });

  describe('Status Type', () => {
    it('should accept "Good" as valid status', () => {
      const status: Status = 'Good';
      expect(status).toBe('Good');
    });

    it('should accept "Has Defects" as valid status', () => {
      const status: Status = 'Has Defects';
      expect(status).toBe('Has Defects');
    });

    it('should accept "BAD" as valid status', () => {
      const status: Status = 'BAD';
      expect(status).toBe('BAD');
    });

    it('should only accept three valid statuses', () => {
      const validStatuses: Status[] = ['Good', 'Has Defects', 'BAD'];
      expect(validStatuses).toHaveLength(3);
      expect(validStatuses).toContain('Good');
      expect(validStatuses).toContain('Has Defects');
      expect(validStatuses).toContain('BAD');
    });
  });

  describe('InventoryItem Interface', () => {
    it('should create a valid inventory item with all required fields', () => {
      const item: InventoryItem = {
        id: 'test-id-123',
        assetNumber: 'AST-001',
        itemName: 'Test Laptop',
        itemDescription: 'A test laptop for development',
        category: 'Electronics',
        status: 'Good',
        designatedOwner: 'John Doe',
        image: 'https://example.com/image.jpg',
      };

      expect(item.id).toBe('test-id-123');
      expect(item.assetNumber).toBe('AST-001');
      expect(item.itemName).toBe('Test Laptop');
      expect(item.itemDescription).toBe('A test laptop for development');
      expect(item.category).toBe('Electronics');
      expect(item.status).toBe('Good');
      expect(item.designatedOwner).toBe('John Doe');
      expect(item.image).toBe('https://example.com/image.jpg');
    });

    it('should create an inventory item with optional timestamps', () => {
      const item: InventoryItem = {
        id: 'test-id-456',
        assetNumber: 'AST-002',
        itemName: 'Test Chair',
        itemDescription: 'A test chair',
        category: 'Fixed',
        status: 'Has Defects',
        designatedOwner: 'Jane Smith',
        image: 'https://example.com/chair.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z',
      };

      expect(item.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(item.updatedAt).toBe('2024-12-01T00:00:00Z');
    });

    it('should accept all valid category and status combinations', () => {
      const categories: Category[] = ['Fixed', 'Electronics'];
      const statuses: Status[] = ['Good', 'Has Defects', 'BAD'];

      const combinations: InventoryItem[] = [];

      categories.forEach((category) => {
        statuses.forEach((status) => {
          combinations.push({
            id: `test-${category}-${status}`,
            assetNumber: `AST-${category}-${status}`,
            itemName: `Test Item ${category} ${status}`,
            itemDescription: `Description for ${category} ${status}`,
            category,
            status,
            designatedOwner: 'Test Owner',
            image: 'https://example.com/test.jpg',
          });
        });
      });

      expect(combinations).toHaveLength(6); // 2 categories * 3 statuses
    });

    it('should validate image URL format', () => {
      const validUrls = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        'https://cdn.example.com/path/to/image.webp',
      ];

      validUrls.forEach((url) => {
        const item: InventoryItem = {
          id: 'test-id',
          assetNumber: 'AST-001',
          itemName: 'Test',
          itemDescription: 'Test',
          category: 'Electronics',
          status: 'Good',
          designatedOwner: 'Test',
          image: url,
        };
        expect(item.image).toMatch(/^https?:\/\/.+/);
      });
    });
  });
});
