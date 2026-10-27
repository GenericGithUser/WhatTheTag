export interface InventoryItem {
  id: string;
  qrCode: string;
  name: string;
  image: string;
  ownerName: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  category: string;
  location: string;
  lastUpdated: string;
  description: string;
  serialNumber: string;
  purchaseDate: string;
}
