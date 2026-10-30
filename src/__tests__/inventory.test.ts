import {
  getInventoryItems,
  getInventoryItemById,
  getInventoryItemByAssetNumber,
  getStatusColor,
  getStatusHexColor,
  getStatusIcon,
  getCategoryHexColor,
  getCategoryIcon,
} from '../data/inventory';
import { InventoryItem, Status, Category } from '../types';

// Mock the firebase config module
jest.mock('../firebase/config', () => ({
  getInventoryItems: jest.fn(),
  getInventoryItemById: jest.fn(),
  getInventoryItemByAssetNumber: jest.fn(),
}));

describe('Inventory Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Demo Data', () => {
    it('should return demo items when Firebase is not configured', async () => {
      const items = await getInventoryItems();
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should have all required fields in demo items', async () => {
      const items = await getInventoryItems();
      items.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('assetNumber');
        expect(item).toHaveProperty('itemName');
        expect(item).toHaveProperty('itemDescription');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('designatedOwner');
        expect(item).toHaveProperty('image');
      });
    });

    it('should only have valid categories in demo data', async () => {
      const items = await getInventoryItems();
      const validCategories: Category[] = ['Fixed', 'Electronics'];
      
      items.forEach((item) => {
        expect(validCategories).toContain(item.category);
      });
    });

    it('should only have valid statuses in demo data', async () => {
      const items = await getInventoryItems();
      const validStatuses: Status[] = ['Good', 'Has Defects', 'BAD'];
      
      items.forEach((item) => {
        expect(validStatuses).toContain(item.status);
      });
    });

    it('should have valid image URLs in demo data', async () => {
      const items = await getInventoryItems();
      
      items.forEach((item) => {
        expect(item.image).toMatch(/^https?:\/\/.+/);
      });
    });
  });

  describe('getInventoryItemById', () => {
    it('should return an item by ID', async () => {
      const items = await getInventoryItems();
      const firstItem = items[0];
      
      const result = await getInventoryItemById(firstItem.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(firstItem.id);
    });

    it('should return null for non-existent ID', async () => {
      const result = await getInventoryItemById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getInventoryItemByAssetNumber', () => {
    it('should return an item by asset number', async () => {
      const items = await getInventoryItems();
      const firstItem = items[0];
      
      const result = await getInventoryItemByAssetNumber(firstItem.assetNumber);
      expect(result).toBeDefined();
      expect(result?.assetNumber).toBe(firstItem.assetNumber);
    });

    it('should be case-insensitive', async () => {
      const items = await getInventoryItems();
      const firstItem = items[0];
      
      const result = await getInventoryItemByAssetNumber(firstItem.assetNumber.toLowerCase());
      expect(result).toBeDefined();
    });

    it('should return null for non-existent asset number', async () => {
      const result = await getInventoryItemByAssetNumber('NON-EXISTENT');
      expect(result).toBeNull();
    });
  });

  describe('getStatusColor', () => {
    it('should return "success" for Good status', () => {
      expect(getStatusColor('Good')).toBe('success');
    });

    it('should return "warning" for Has Defects status', () => {
      expect(getStatusColor('Has Defects')).toBe('warning');
    });

    it('should return "danger" for BAD status', () => {
      expect(getStatusColor('BAD')).toBe('danger');
    });

    it('should return "medium" for unknown status', () => {
      expect(getStatusColor('Unknown' as Status)).toBe('medium');
    });
  });

  describe('getStatusHexColor', () => {
    it('should return green (#98971a) for Good status', () => {
      expect(getStatusHexColor('Good')).toBe('#98971a');
    });

    it('should return yellow (#d79921) for Has Defects status', () => {
      expect(getStatusHexColor('Has Defects')).toBe('#d79921');
    });

    it('should return red (#cc241d) for BAD status', () => {
      expect(getStatusHexColor('BAD')).toBe('#cc241d');
    });

    it('should return medium gray for unknown status', () => {
      expect(getStatusHexColor('Unknown' as Status)).toBe('#7c6f64');
    });
  });

  describe('getStatusIcon', () => {
    it('should return "checkmark-circle" for Good status', () => {
      expect(getStatusIcon('Good')).toBe('checkmark-circle');
    });

    it('should return "warning" for Has Defects status', () => {
      expect(getStatusIcon('Has Defects')).toBe('warning');
    });

    it('should return "close-circle" for BAD status', () => {
      expect(getStatusIcon('BAD')).toBe('close-circle');
    });

    it('should return "help-circle" for unknown status', () => {
      expect(getStatusIcon('Unknown' as Status)).toBe('help-circle');
    });
  });

  describe('getCategoryHexColor', () => {
    it('should return aqua (#689d6a) for Fixed category', () => {
      expect(getCategoryHexColor('Fixed')).toBe('#689d6a');
    });

    it('should return blue (#458588) for Electronics category', () => {
      expect(getCategoryHexColor('Electronics')).toBe('#458588');
    });

    it('should return gray for unknown category', () => {
      expect(getCategoryHexColor('Unknown' as Category)).toBe('#7c6f64');
    });
  });

  describe('getCategoryIcon', () => {
    it('should return "business" for Fixed category', () => {
      expect(getCategoryIcon('Fixed')).toBe('business');
    });

    it('should return "hardware-chip" for Electronics category', () => {
      expect(getCategoryIcon('Electronics')).toBe('hardware-chip');
    });

    it('should return "cube" for unknown category', () => {
      expect(getCategoryIcon('Unknown' as Category)).toBe('cube');
    });
  });
});
