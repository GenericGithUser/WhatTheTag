import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { InventoryItem, Category, Status, DeletedAssetNumber } from './types';

const INVENTORY_COLLECTION = 'inventory';
const DELETED_ASSETS_COLLECTION = 'deleted_assets';
const COUNTERS_COLLECTION = 'counters';

/**
 * Get all inventory items
 */
export const getAllItems = async (): Promise<InventoryItem[]> => {
  const q = query(collection(db, INVENTORY_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as InventoryItem[];
};

/**
 * Get a single item by ID
 */
export const getItemById = async (id: string): Promise<InventoryItem | null> => {
  const docRef = doc(db, INVENTORY_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as InventoryItem;
  }
  return null;
};

/**
 * Get the next available asset number
 * This fetches the last inserted document and increments the number
 */
export const getNextAssetNumber = async (): Promise<string> => {
  // Get the highest asset number from existing items
  const q = query(
    collection(db, INVENTORY_COLLECTION),
    orderBy('assetNumber', 'desc'),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  
  let nextNumber = 1;
  
  if (!querySnapshot.empty) {
    const lastItem = querySnapshot.docs[0].data() as InventoryItem;
    const lastAssetNumber = lastItem.assetNumber;
    
    // Extract the number from asset number (e.g., "AST-001" -> 1)
    const match = lastAssetNumber.match(/AST-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  // Also check the counter document for the next number
  const counterRef = doc(db, COUNTERS_COLLECTION, 'asset_counter');
  const counterSnap = await getDoc(counterRef);
  
  if (counterSnap.exists()) {
    const counterData = counterSnap.data();
    const counterNumber = counterData.nextNumber || 1;
    nextNumber = Math.max(nextNumber, counterNumber);
  }
  
  // Format as AST-001, AST-002, etc.
  return `AST-${String(nextNumber).padStart(3, '0')}`;
};

/**
 * Update the asset counter after creating a new item
 */
export const updateAssetCounter = async (assetNumber: string): Promise<void> => {
  const match = assetNumber.match(/AST-(\d+)/);
  if (match) {
    const nextNumber = parseInt(match[1], 10) + 1;
    const counterRef = doc(db, COUNTERS_COLLECTION, 'asset_counter');
    await setDoc(counterRef, { nextNumber, updatedAt: new Date().toISOString() });
  }
};

/**
 * Add a new inventory item
 */
export const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'assetNumber'>): Promise<string> => {
  // Get the next asset number
  const assetNumber = await getNextAssetNumber();
  
  const now = new Date().toISOString();
  const newItem = {
    ...item,
    assetNumber,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), newItem);
  
  // Update the counter
  await updateAssetCounter(assetNumber);
  
  return docRef.id;
};

/**
 * Update an existing inventory item
 */
export const updateItem = async (id: string, updates: Partial<Omit<InventoryItem, 'id' | 'createdAt' | 'assetNumber'>>): Promise<void> => {
  const docRef = doc(db, INVENTORY_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Delete an inventory item and preserve its asset number
 */
export const deleteItem = async (id: string, reason?: string): Promise<void> => {
  // Get the item first to preserve its asset number
  const item = await getItemById(id);
  
  if (item) {
    // Store the deleted asset number
    const deletedAsset: DeletedAssetNumber = {
      assetNumber: item.assetNumber,
      deletedAt: new Date().toISOString(),
      reason: reason || 'No reason provided',
    };
    
    await addDoc(collection(db, DELETED_ASSETS_COLLECTION), deletedAsset);
  }
  
  // Delete the item
  const docRef = doc(db, INVENTORY_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Get all deleted asset numbers
 */
export const getDeletedAssetNumbers = async (): Promise<DeletedAssetNumber[]> => {
  const q = query(collection(db, DELETED_ASSETS_COLLECTION), orderBy('deletedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data()) as DeletedAssetNumber[];
};

/**
 * Check if an asset number has been deleted (and should not be reused)
 */
export const isAssetNumberDeleted = async (assetNumber: string): Promise<boolean> => {
  const q = query(
    collection(db, DELETED_ASSETS_COLLECTION),
    where('assetNumber', '==', assetNumber)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

/**
 * Get item count by status
 */
export const getItemCountByStatus = async (): Promise<Record<Status, number>> => {
  const items = await getAllItems();
  return {
    'Good': items.filter(item => item.status === 'Good').length,
    'Has Defects': items.filter(item => item.status === 'Has Defects').length,
    'BAD': items.filter(item => item.status === 'BAD').length,
  };
};

/**
 * Get item count by category
 */
export const getItemCountByCategory = async (): Promise<Record<Category, number>> => {
  const items = await getAllItems();
  return {
    'Fixed': items.filter(item => item.category === 'Fixed').length,
    'Electronics': items.filter(item => item.category === 'Electronics').length,
  };
};
