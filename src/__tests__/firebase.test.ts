// Mock Firebase modules BEFORE any other imports
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: (...args: any[]) => mockCollection(...args),
  doc: (...args: any[]) => mockDoc(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  query: (...args: any[]) => mockQuery(...args),
  where: (...args: any[]) => mockWhere(...args),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
}));

// Import after mocks are set up
import {
  getInventoryItems,
  getInventoryItemById,
  getInventoryItemByAssetNumber,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getItemsByCategory,
  getItemsByStatus,
} from '../firebase/config';
import { InventoryItem } from '../types';

// Helper function to create mock document
const createMockDoc = (id: string, itemData: any) => ({
  id,
  data: () => itemData,
});

describe('Firebase Firestore Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInventoryItems', () => {
    it('should fetch all inventory items from Firestore', async () => {
      const mockItems = [
        { id: '1', assetNumber: 'AST-001', itemName: 'Item 1', itemDescription: 'Desc 1', category: 'Electronics', status: 'Good', designatedOwner: 'Owner 1', image: 'https://example.com/1.jpg' },
        { id: '2', assetNumber: 'AST-002', itemName: 'Item 2', itemDescription: 'Desc 2', category: 'Fixed', status: 'BAD', designatedOwner: 'Owner 2', image: 'https://example.com/2.jpg' },
      ];

      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {
          mockItems.forEach((item) => {
            callback(createMockDoc(item.id, item));
          });
        },
      });

      const items = await getInventoryItems();
      expect(items).toHaveLength(2);
      expect(items[0].assetNumber).toBe('AST-001');
      expect(items[1].assetNumber).toBe('AST-002');
    });

    it('should return empty array when no items exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: jest.fn(),
      });

      const items = await getInventoryItems();
      expect(items).toHaveLength(0);
    });

    it('should throw error when Firestore fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));

      await expect(getInventoryItems()).rejects.toThrow('Firestore error');
    });
  });

  describe('getInventoryItemById', () => {
    it('should fetch a single item by ID', async () => {
      const mockItem = {
        id: 'test-id',
        assetNumber: 'AST-001',
        itemName: 'Test Item',
        itemDescription: 'Test Description',
        category: 'Electronics',
        status: 'Good',
        designatedOwner: 'Test Owner',
        image: 'https://example.com/test.jpg',
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: mockItem.id,
        data: () => mockItem,
      });

      const item = await getInventoryItemById('test-id');
      expect(item).toBeDefined();
      expect(item?.assetNumber).toBe('AST-001');
      expect(item?.itemName).toBe('Test Item');
    });

    it('should return null when item does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const item = await getInventoryItemById('non-existent');
      expect(item).toBeNull();
    });

    it('should throw error when Firestore fails', async () => {
      mockGetDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(getInventoryItemById('test-id')).rejects.toThrow('Firestore error');
    });
  });

  describe('getInventoryItemByAssetNumber', () => {
    it('should fetch item by asset number', async () => {
      const mockItem = {
        assetNumber: 'AST-001',
        itemName: 'Test Item',
        itemDescription: 'Test Description',
        category: 'Electronics',
        status: 'Good',
        designatedOwner: 'Test Owner',
        image: 'https://example.com/test.jpg',
      };

      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [createMockDoc('test-id', mockItem)],
      });

      const item = await getInventoryItemByAssetNumber('AST-001');
      expect(item).toBeDefined();
      expect(item?.assetNumber).toBe('AST-001');
    });

    it('should return null when asset number not found', async () => {
      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });

      const item = await getInventoryItemByAssetNumber('NON-EXISTENT');
      expect(item).toBeNull();
    });
  });

  describe('addInventoryItem', () => {
    it('should add a new item to Firestore', async () => {
      const newItem: Omit<InventoryItem, 'id'> = {
        assetNumber: 'AST-NEW',
        itemName: 'New Item',
        itemDescription: 'New Description',
        category: 'Electronics',
        status: 'Good',
        designatedOwner: 'New Owner',
        image: 'https://example.com/new.jpg',
      };

      mockAddDoc.mockResolvedValue({ id: 'new-id' });

      const id = await addInventoryItem(newItem);
      expect(id).toBe('new-id');
      expect(mockAddDoc).toHaveBeenCalled();
    });

    it('should throw error when add fails', async () => {
      mockAddDoc.mockRejectedValue(new Error('Add failed'));

      const newItem: Omit<InventoryItem, 'id'> = {
        assetNumber: 'AST-NEW',
        itemName: 'New Item',
        itemDescription: 'New Description',
        category: 'Electronics',
        status: 'Good',
        designatedOwner: 'New Owner',
        image: 'https://example.com/new.jpg',
      };

      await expect(addInventoryItem(newItem)).rejects.toThrow('Add failed');
    });
  });

  describe('updateInventoryItem', () => {
    it('should update an existing item', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);

      await expect(updateInventoryItem('test-id', { itemName: 'Updated Name' })).resolves.not.toThrow();
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it('should throw error when update fails', async () => {
      mockUpdateDoc.mockRejectedValue(new Error('Update failed'));

      await expect(updateInventoryItem('test-id', { itemName: 'Updated' })).rejects.toThrow('Update failed');
    });
  });

  describe('deleteInventoryItem', () => {
    it('should delete an item', async () => {
      mockDeleteDoc.mockResolvedValue(undefined);

      await expect(deleteInventoryItem('test-id')).resolves.not.toThrow();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });

    it('should throw error when delete fails', async () => {
      mockDeleteDoc.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteInventoryItem('test-id')).rejects.toThrow('Delete failed');
    });
  });

  describe('getItemsByCategory', () => {
    it('should fetch items by category', async () => {
      const mockItems = [
        { assetNumber: 'AST-001', itemName: 'Item 1', itemDescription: 'Desc 1', category: 'Electronics', status: 'Good', designatedOwner: 'Owner 1', image: 'https://example.com/1.jpg' },
      ];

      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {
          mockItems.forEach((item, index) => {
            callback(createMockDoc(`id-${index}`, item));
          });
        },
      });

      const items = await getItemsByCategory('Electronics');
      expect(items).toHaveLength(1);
      expect(items[0].category).toBe('Electronics');
    });
  });

  describe('getItemsByStatus', () => {
    it('should fetch items by status', async () => {
      const mockItems = [
        { assetNumber: 'AST-001', itemName: 'Item 1', itemDescription: 'Desc 1', category: 'Electronics', status: 'Good', designatedOwner: 'Owner 1', image: 'https://example.com/1.jpg' },
      ];

      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {
          mockItems.forEach((item, index) => {
            callback(createMockDoc(`id-${index}`, item));
          });
        },
      });

      const items = await getItemsByStatus('Good');
      expect(items).toHaveLength(1);
      expect(items[0].status).toBe('Good');
    });
  });
});
