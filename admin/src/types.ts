export type Category = 'Fixed' | 'Electronics';
export type Status = 'Good' | 'Has Defects' | 'BAD';

export interface InventoryItem {
  id: string;
  assetNumber: string;
  itemName: string;
  itemDescription: string;
  category: Category;
  status: Status;
  designatedOwner: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeletedAssetNumber {
  assetNumber: string;
  deletedAt: string;
  reason?: string;
}
