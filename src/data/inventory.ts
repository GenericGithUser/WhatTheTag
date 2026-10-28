import { InventoryItem, Category, Status } from '../types';
import { 
  getInventoryItems as fetchFromFirestore,
  getInventoryItemById as fetchByIdFromFirestore,
  getInventoryItemByAssetNumber as fetchByAssetNumberFromFirestore
} from '../firebase/config';

// Check if Firebase is properly configured
const isFirebaseConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your-api-key-here'
  );
};

// Fallback demo data for when Firebase is not configured
const demoData: InventoryItem[] = [
  {
    id: 'demo-1',
    assetNumber: 'AST-001',
    itemName: 'Dell OptiPlex 7090',
    itemDescription: 'Desktop computer with Intel i7, 16GB RAM, 512GB SSD. Assigned to finance department for accounting tasks.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'John Smith',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
  },
  {
    id: 'demo-2',
    assetNumber: 'AST-002',
    itemName: 'Herman Miller Aeron Chair',
    itemDescription: 'Ergonomic office chair, size B, fully adjustable. Used in executive office.',
    category: 'Fixed',
    status: 'Good',
    designatedOwner: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop',
    createdAt: '2023-06-20T09:00:00Z',
    updatedAt: '2024-12-10T11:15:00Z',
  },
  {
    id: 'demo-3',
    assetNumber: 'AST-003',
    itemName: 'MacBook Pro 16"',
    itemDescription: 'Apple MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Development laptop for engineering team.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'Mike Chen',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-12-12T16:45:00Z',
  },
  {
    id: 'demo-4',
    assetNumber: 'AST-004',
    itemName: 'HP LaserJet Pro M404',
    itemDescription: 'Monochrome laser printer for office use. Currently experiencing paper feed issues.',
    category: 'Electronics',
    status: 'Has Defects',
    designatedOwner: 'IT Department',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    createdAt: '2022-09-05T13:00:00Z',
    updatedAt: '2024-12-01T09:20:00Z',
  },
  {
    id: 'demo-5',
    assetNumber: 'AST-005',
    itemName: 'Standing Desk - Uplift V2',
    itemDescription: 'Electric height-adjustable desk with bamboo top. Motor malfunction, stuck at standing height.',
    category: 'Fixed',
    status: 'Has Defects',
    designatedOwner: 'Alex Turner',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2024-12-08T15:00:00Z',
  },
  {
    id: 'demo-6',
    assetNumber: 'AST-006',
    itemName: 'Conference Table - 12 Seater',
    itemDescription: 'Large wooden conference table for meeting room A. Severe water damage from ceiling leak.',
    category: 'Fixed',
    status: 'BAD',
    designatedOwner: 'Facilities',
    image: 'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=400&h=300&fit=crop',
    createdAt: '2020-03-10T11:00:00Z',
    updatedAt: '2024-11-20T08:45:00Z',
  },
  {
    id: 'demo-7',
    assetNumber: 'AST-007',
    itemName: 'Sony 65" 4K TV',
    itemDescription: 'Display screen for presentation room. Screen has dead pixels and backlight bleeding.',
    category: 'Electronics',
    status: 'BAD',
    designatedOwner: 'AV Department',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    createdAt: '2021-07-22T14:00:00Z',
    updatedAt: '2024-11-28T10:30:00Z',
  },
  {
    id: 'demo-8',
    assetNumber: 'AST-008',
    itemName: 'iPad Pro 12.9"',
    itemDescription: 'Apple iPad Pro for client presentations and field work. M2 chip, 256GB.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-12-14T13:20:00Z',
  },
  {
    id: 'demo-9',
    assetNumber: 'AST-009',
    itemName: 'Office Partition System',
    itemDescription: 'Modular office partition panels for workspace separation. Minor scratches on surface.',
    category: 'Fixed',
    status: 'Has Defects',
    designatedOwner: 'Facilities',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    createdAt: '2022-05-18T16:00:00Z',
    updatedAt: '2024-12-05T11:10:00Z',
  },
  {
    id: 'demo-10',
    assetNumber: 'AST-010',
    itemName: 'Network Switch - Cisco 48-Port',
    itemDescription: 'Managed network switch for server room. Fully operational, recently firmware updated.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'IT Infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    createdAt: '2023-08-12T07:30:00Z',
    updatedAt: '2024-12-13T17:00:00Z',
  },
  {
    id: 'demo-11',
    assetNumber: 'AST-011',
    itemName: 'Filing Cabinet - 4 Drawer',
    itemDescription: 'Metal filing cabinet for document storage. Lock mechanism broken on top drawer.',
    category: 'Fixed',
    status: 'Has Defects',
    designatedOwner: 'Admin Office',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop',
    createdAt: '2019-11-30T12:00:00Z',
    updatedAt: '2024-12-09T14:15:00Z',
  },
  {
    id: 'demo-12',
    assetNumber: 'AST-012',
    itemName: 'Dell PowerEdge R750 Server',
    itemDescription: 'Rack server hosting production databases. Dual Xeon Gold, 256GB RAM, 4x 1TB NVMe.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'IT Infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    createdAt: '2023-05-18T08:00:00Z',
    updatedAt: '2024-12-13T16:30:00Z',
  },
];

/**
 * Get all inventory items
 * Uses Firestore if configured, otherwise returns demo data
 */
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  if (isFirebaseConfigured()) {
    try {
      return await fetchFromFirestore();
    } catch (error) {
      console.error('Firestore fetch failed, falling back to demo data:', error);
      return demoData;
    }
  }
  // Simulate network delay for demo
  return new Promise((resolve) => {
    setTimeout(() => resolve(demoData), 500);
  });
};

/**
 * Get a single inventory item by ID
 */
export const getInventoryItemById = async (id: string): Promise<InventoryItem | null> => {
  if (isFirebaseConfigured()) {
    try {
      return await fetchByIdFromFirestore(id);
    } catch (error) {
      console.error('Firestore fetch failed, falling back to demo data:', error);
      return demoData.find((item) => item.id === id) || null;
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoData.find((item) => item.id === id) || null);
    }, 200);
  });
};

/**
 * Get inventory item by asset number (for QR scanning)
 */
export const getInventoryItemByAssetNumber = async (assetNumber: string): Promise<InventoryItem | null> => {
  if (isFirebaseConfigured()) {
    try {
      return await fetchByAssetNumberFromFirestore(assetNumber);
    } catch (error) {
      console.error('Firestore fetch failed, falling back to demo data:', error);
      return demoData.find(
        (item) => item.assetNumber.toLowerCase() === assetNumber.toLowerCase()
      ) || null;
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        demoData.find(
          (item) => item.assetNumber.toLowerCase() === assetNumber.toLowerCase()
        ) || null
      );
    }, 300);
  });
};

/**
 * Get the Gruvbox color for a status
 */
export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Good':
      return 'success'; // Green #98971a
    case 'Has Defects':
      return 'warning'; // Yellow #d79921
    case 'BAD':
      return 'danger'; // Red #cc241d
    default:
      return 'medium';
  }
};

/**
 * Get the Gruvbox hex color for a status
 */
export const getStatusHexColor = (status: Status): string => {
  switch (status) {
    case 'Good':
      return '#98971a'; // Green
    case 'Has Defects':
      return '#d79921'; // Yellow
    case 'BAD':
      return '#cc241d'; // Red
    default:
      return '#7c6f64'; // Medium
  }
};

/**
 * Get the icon name for a status
 */
export const getStatusIcon = (status: Status): string => {
  switch (status) {
    case 'Good':
      return 'checkmark-circle';
    case 'Has Defects':
      return 'warning';
    case 'BAD':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

/**
 * Get the Gruvbox color for a category
 */
export const getCategoryHexColor = (category: Category): string => {
  switch (category) {
    case 'Fixed':
      return '#689d6a'; // Aqua
    case 'Electronics':
      return '#458588'; // Blue
    default:
      return '#7c6f64';
  }
};

/**
 * Get the icon name for a category
 */
export const getCategoryIcon = (category: Category): string => {
  switch (category) {
    case 'Fixed':
      return 'business';
    case 'Electronics':
      return 'hardware-chip';
    default:
      return 'cube';
  }
};
