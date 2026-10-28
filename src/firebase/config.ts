import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { InventoryItem } from '../types';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection name
const INVENTORY_COLLECTION = 'inventory';

/**
 * Get all inventory items from Firestore
 */
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
    const items: InventoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem);
    });
    
    return items;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

/**
 * Get a single inventory item by ID
 */
export const getInventoryItemById = async (id: string): Promise<InventoryItem | null> => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as InventoryItem;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }
};

/**
 * Get inventory item by asset number
 */
export const getInventoryItemByAssetNumber = async (assetNumber: string): Promise<InventoryItem | null> => {
  try {
    const q = query(
      collection(db, INVENTORY_COLLECTION),
      where('assetNumber', '==', assetNumber)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as InventoryItem;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching inventory item by asset number:', error);
    throw error;
  }
};

/**
 * Add a new inventory item to Firestore
 */
export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), item);
    return docRef.id;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

/**
 * Update an existing inventory item
 */
export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<void> => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, id);
    await updateDoc(docRef, item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

/**
 * Delete an inventory item
 */
export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

/**
 * Get items by category
 */
export const getItemsByCategory = async (category: 'Fixed' | 'Electronics'): Promise<InventoryItem[]> => {
  try {
    const q = query(
      collection(db, INVENTORY_COLLECTION),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const items: InventoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem);
    });
    
    return items;
  } catch (error) {
    console.error('Error fetching items by category:', error);
    throw error;
  }
};

/**
 * Get items by status
 */
export const getItemsByStatus = async (status: 'Good' | 'Has Defects' | 'BAD'): Promise<InventoryItem[]> => {
  try {
    const q = query(
      collection(db, INVENTORY_COLLECTION),
      where('status', '==', status)
    );
    
    const querySnapshot = await getDocs(q);
    const items: InventoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem);
    });
    
    return items;
  } catch (error) {
    console.error('Error fetching items by status:', error);
    throw error;
  }
};
