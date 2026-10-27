import { InventoryItem } from '../types';

const inventoryData: InventoryItem[] = [
  {
    id: '1',
    qrCode: 'INV-001-LAPTOP',
    name: 'MacBook Pro 16"',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    ownerName: 'John Smith',
    status: 'in-use',
    category: 'Electronics',
    location: 'Office - Floor 3, Desk 12',
    lastUpdated: '2024-12-15',
    description: 'Apple MacBook Pro 16-inch, M3 Max chip, 36GB RAM, 1TB SSD. Assigned to senior development team.',
    serialNumber: 'SN-MBP-2024-001',
    purchaseDate: '2024-01-15',
  },
  {
    id: '2',
    qrCode: 'INV-002-MONITOR',
    name: 'Dell UltraSharp 32"',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    ownerName: 'Sarah Johnson',
    status: 'available',
    category: 'Electronics',
    location: 'Storage Room B',
    lastUpdated: '2024-12-10',
    description: 'Dell UltraSharp 32" 4K USB-C Hub Monitor. Previously used by design team, now available for reassignment.',
    serialNumber: 'SN-DEL-2024-002',
    purchaseDate: '2023-06-20',
  },
  {
    id: '3',
    qrCode: 'INV-003-CHAIR',
    name: 'Herman Miller Aeron',
    image: 'https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop',
    ownerName: 'Mike Chen',
    status: 'in-use',
    category: 'Furniture',
    location: 'Office - Floor 2, Desk 5',
    lastUpdated: '2024-11-28',
    description: 'Herman Miller Aeron Chair, Size B, fully loaded with all adjustments. Ergonomic office seating.',
    serialNumber: 'SN-HM-2023-003',
    purchaseDate: '2023-03-10',
  },
  {
    id: '4',
    qrCode: 'INV-004-PRINTER',
    name: 'HP LaserJet Pro M404',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    ownerName: 'IT Department',
    status: 'maintenance',
    category: 'Equipment',
    location: 'Office - Floor 1, Print Station',
    lastUpdated: '2024-12-01',
    description: 'HP LaserJet Pro M404dn monochrome laser printer. Currently under maintenance for toner replacement and paper jam fix.',
    serialNumber: 'SN-HP-2022-004',
    purchaseDate: '2022-09-05',
  },
  {
    id: '5',
    qrCode: 'INV-005-TABLET',
    name: 'iPad Pro 12.9"',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    ownerName: 'Emily Davis',
    status: 'in-use',
    category: 'Electronics',
    location: 'Conference Room A',
    lastUpdated: '2024-12-12',
    description: 'Apple iPad Pro 12.9-inch, M2 chip, 256GB, Wi-Fi + Cellular. Used for presentations and client meetings.',
    serialNumber: 'SN-IPD-2024-005',
    purchaseDate: '2024-02-28',
  },
  {
    id: '6',
    qrCode: 'INV-006-DESK',
    name: 'Standing Desk - Uplift V2',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    ownerName: 'Alex Turner',
    status: 'available',
    category: 'Furniture',
    location: 'Storage Room A',
    lastUpdated: '2024-12-08',
    description: 'Uplift V2 Commercial Standing Desk, 60"x30", bamboo top with programmable memory keypad.',
    serialNumber: 'SN-UP-2023-006',
    purchaseDate: '2023-11-15',
  },
  {
    id: '7',
    qrCode: 'INV-007-PROJECTOR',
    name: 'Epson PowerLite 4K',
    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=400&h=300&fit=crop',
    ownerName: 'AV Department',
    status: 'available',
    category: 'Equipment',
    location: 'AV Storage',
    lastUpdated: '2024-12-05',
    description: 'Epson PowerLite 4K Pro laser projector, 5000 lumens. Available for booking for events and presentations.',
    serialNumber: 'SN-EP-2023-007',
    purchaseDate: '2023-08-22',
  },
  {
    id: '8',
    qrCode: 'INV-008-KEYBOARD',
    name: 'Logitech MX Keys',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    ownerName: 'Lisa Wong',
    status: 'retired',
    category: 'Accessories',
    location: 'Disposal Queue',
    lastUpdated: '2024-11-20',
    description: 'Logitech MX Keys wireless keyboard. Retired due to key malfunction. Scheduled for replacement.',
    serialNumber: 'SN-LG-2021-008',
    purchaseDate: '2021-04-12',
  },
  {
    id: '9',
    qrCode: 'INV-009-CAMERA',
    name: 'Sony A7 IV',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    ownerName: 'Marketing Team',
    status: 'in-use',
    category: 'Equipment',
    location: 'Photo Studio',
    lastUpdated: '2024-12-14',
    description: 'Sony Alpha A7 IV mirrorless camera with 28-70mm kit lens. Used for product photography and marketing content.',
    serialNumber: 'SN-SNY-2024-009',
    purchaseDate: '2024-03-01',
  },
  {
    id: '10',
    qrCode: 'INV-010-SERVER',
    name: 'Dell PowerEdge R750',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    ownerName: 'IT Infrastructure',
    status: 'in-use',
    category: 'Infrastructure',
    location: 'Server Room - Rack 3',
    lastUpdated: '2024-12-13',
    description: 'Dell PowerEdge R750 rack server, dual Xeon Gold, 256GB RAM, 4x 1TB NVMe. Hosts production databases.',
    serialNumber: 'SN-DE-2023-010',
    purchaseDate: '2023-05-18',
  },
  {
    id: '11',
    qrCode: 'INV-011-HEADSET',
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    ownerName: 'David Park',
    status: 'available',
    category: 'Accessories',
    location: 'IT Closet - Floor 2',
    lastUpdated: '2024-12-11',
    description: 'Sony WH-1000XM5 wireless noise-canceling headphones. Available for checkout by employees.',
    serialNumber: 'SN-SNY-2024-011',
    purchaseDate: '2024-04-10',
  },
  {
    id: '12',
    qrCode: 'INV-012-WHITEBOARD',
    name: 'Smart Board 75"',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    ownerName: 'Training Room',
    status: 'in-use',
    category: 'Equipment',
    location: 'Training Room - Floor 1',
    lastUpdated: '2024-12-09',
    description: 'Smart Board MX75 interactive display, 75-inch 4K touchscreen. Used for training sessions and team meetings.',
    serialNumber: 'SN-SB-2023-012',
    purchaseDate: '2023-07-30',
  },
];

// Simulated database service
export const getInventoryItems = (): Promise<InventoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inventoryData);
    }, 500);
  });
};

export const getInventoryItemByQR = (qrCode: string): Promise<InventoryItem | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = inventoryData.find(
        (i) => i.qrCode.toLowerCase() === qrCode.toLowerCase()
      );
      resolve(item || null);
    }, 300);
  });
};

export const getInventoryItemById = (id: string): Promise<InventoryItem | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = inventoryData.find((i) => i.id === id);
      resolve(item || null);
    }, 200);
  });
};

export const getStatusColor = (status: InventoryItem['status']): string => {
  switch (status) {
    case 'available':
      return 'success';
    case 'in-use':
      return 'primary';
    case 'maintenance':
      return 'warning';
    case 'retired':
      return 'danger';
    default:
      return 'medium';
  }
};

export const getStatusIcon = (status: InventoryItem['status']): string => {
  switch (status) {
    case 'available':
      return 'checkmark-circle';
    case 'in-use':
      return 'person-circle';
    case 'maintenance':
      return 'construct';
    case 'retired':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};
