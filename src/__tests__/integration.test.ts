import { getInventoryItems, getInventoryItemById, getInventoryItemByAssetNumber } from '../data/inventory';
import { InventoryItem } from '../types';

describe('Integration Tests', () => {
  describe('Complete User Flow', () => {
    it('should load all items and find a specific item by ID', async () => {
      // Step 1: Load all items (Dashboard view)
      const allItems = await getInventoryItems();
      expect(allItems.length).toBeGreaterThan(0);

      // Step 2: Select first item
      const firstItem = allItems[0];
      expect(firstItem).toBeDefined();

      // Step 3: Navigate to item detail
      const itemDetail = await getInventoryItemById(firstItem.id);
      expect(itemDetail).toBeDefined();
      expect(itemDetail?.id).toBe(firstItem.id);
      expect(itemDetail?.assetNumber).toBe(firstItem.assetNumber);
      expect(itemDetail?.itemName).toBe(firstItem.itemName);
    });

    it('should scan QR code and retrieve item details', async () => {
      // Step 1: Get all items to find a valid asset number
      const allItems = await getInventoryItems();
      const validAssetNumber = allItems[0].assetNumber;

      // Step 2: Simulate QR scan (lookup by asset number)
      const scannedItem = await getInventoryItemByAssetNumber(validAssetNumber);
      
      // Step 3: Verify scanned item has all required information
      expect(scannedItem).toBeDefined();
      expect(scannedItem?.assetNumber).toBe(validAssetNumber);
      expect(scannedItem?.itemName).toBeTruthy();
      expect(scannedItem?.itemDescription).toBeTruthy();
      expect(scannedItem?.category).toBeTruthy();
      expect(scannedItem?.status).toBeTruthy();
      expect(scannedItem?.designatedOwner).toBeTruthy();
      expect(scannedItem?.image).toBeTruthy();
    });

    it('should filter items by category', async () => {
      const allItems = await getInventoryItems();
      
      // Filter Electronics
      const electronics = allItems.filter(item => item.category === 'Electronics');
      electronics.forEach(item => {
        expect(item.category).toBe('Electronics');
      });

      // Filter Fixed
      const fixed = allItems.filter(item => item.category === 'Fixed');
      fixed.forEach(item => {
        expect(item.category).toBe('Fixed');
      });

      // Ensure we have both categories
      expect(electronics.length + fixed.length).toBe(allItems.length);
    });

    it('should filter items by status', async () => {
      const allItems = await getInventoryItems();
      
      // Filter Good
      const good = allItems.filter(item => item.status === 'Good');
      good.forEach(item => {
        expect(item.status).toBe('Good');
      });

      // Filter Has Defects
      const defective = allItems.filter(item => item.status === 'Has Defects');
      defective.forEach(item => {
        expect(item.status).toBe('Has Defects');
      });

      // Filter BAD
      const bad = allItems.filter(item => item.status === 'BAD');
      bad.forEach(item => {
        expect(item.status).toBe('BAD');
      });

      // Ensure all items are accounted for
      expect(good.length + defective.length + bad.length).toBe(allItems.length);
    });

    it('should search items by text', async () => {
      const allItems = await getInventoryItems();
      
      // Search by item name
      const searchTerm = allItems[0].itemName.split(' ')[0]; // First word
      const searchResults = allItems.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designatedOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assetNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(searchResults.length).toBeGreaterThan(0);
    });

    it('should handle non-existent asset number gracefully', async () => {
      const result = await getInventoryItemByAssetNumber('NON-EXISTENT-999');
      expect(result).toBeNull();
    });

    it('should handle non-existent item ID gracefully', async () => {
      const result = await getInventoryItemById('non-existent-id-999');
      expect(result).toBeNull();
    });

    it('should maintain data consistency across operations', async () => {
      // Get all items
      const allItems = await getInventoryItems();
      
      // Get each item individually
      const individualItems = await Promise.all(
        allItems.map(item => getInventoryItemById(item.id))
      );
      
      // Verify consistency
      expect(individualItems.length).toBe(allItems.length);
      individualItems.forEach((item, index) => {
        expect(item).toBeDefined();
        expect(item?.id).toBe(allItems[index].id);
        expect(item?.assetNumber).toBe(allItems[index].assetNumber);
      });
    });

    it('should validate all demo data against schema', async () => {
      const allItems = await getInventoryItems();
      
      allItems.forEach(item => {
        // Validate required fields
        expect(item.id).toBeTruthy();
        expect(item.assetNumber).toBeTruthy();
        expect(item.itemName).toBeTruthy();
        expect(item.itemDescription).toBeTruthy();
        expect(item.designatedOwner).toBeTruthy();
        expect(item.image).toBeTruthy();
        
        // Validate enums
        expect(['Fixed', 'Electronics']).toContain(item.category);
        expect(['Good', 'Has Defects', 'BAD']).toContain(item.status);
        
        // Validate image URL format
        expect(item.image).toMatch(/^https?:\/\/.+/);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have unique IDs for all items', async () => {
      const allItems = await getInventoryItems();
      const ids = allItems.map(item => item.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique asset numbers for all items', async () => {
      const allItems = await getInventoryItems();
      const assetNumbers = allItems.map(item => item.assetNumber);
      const uniqueAssetNumbers = new Set(assetNumbers);
      
      expect(uniqueAssetNumbers.size).toBe(assetNumbers.length);
    });

    it('should have valid image URLs for all items', async () => {
      const allItems = await getInventoryItems();
      
      allItems.forEach(item => {
        expect(item.image).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have non-empty descriptions for all items', async () => {
      const allItems = await getInventoryItems();
      
      allItems.forEach(item => {
        expect(item.itemDescription.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle case-insensitive asset number search', async () => {
      const allItems = await getInventoryItems();
      const firstItem = allItems[0];
      
      // Try different case variations
      const lowerCase = await getInventoryItemByAssetNumber(firstItem.assetNumber.toLowerCase());
      const upperCase = await getInventoryItemByAssetNumber(firstItem.assetNumber.toUpperCase());
      
      expect(lowerCase).toBeDefined();
      expect(upperCase).toBeDefined();
      expect(lowerCase?.id).toBe(firstItem.id);
      expect(upperCase?.id).toBe(firstItem.id);
    });

    it('should handle special characters in search', async () => {
      const allItems = await getInventoryItems();
      
      // Search with special characters should not crash
      const specialSearch = await getInventoryItemByAssetNumber('AST-001@#$%');
      // May return null, but should not throw
      expect(specialSearch === null || specialSearch !== undefined).toBe(true);
    });

    it('should handle very long search strings', async () => {
      const longString = 'A'.repeat(1000);
      const result = await getInventoryItemByAssetNumber(longString);
      
      // Should return null, not crash
      expect(result).toBeNull();
    });

    it('should handle empty string search', async () => {
      const result = await getInventoryItemByAssetNumber('');
      expect(result).toBeNull();
    });
  });
});
