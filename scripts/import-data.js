/**
 * Firestore Data Import Script
 * 
 * This script imports sample inventory data into Firestore.
 * 
 * Usage:
 * 1. Install dependencies: npm install firebase dotenv
 * 2. Create .env file with your Firebase config
 * 3. Run: node scripts/import-data.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample inventory data
const inventoryData = [
  {
    assetNumber: 'AST-001',
    itemName: 'Dell OptiPlex 7090',
    itemDescription: 'Desktop computer with Intel i7, 16GB RAM, 512GB SSD. Assigned to finance department for accounting tasks.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'John Smith',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-002',
    itemName: 'Herman Miller Aeron Chair',
    itemDescription: 'Ergonomic office chair, size B, fully adjustable. Used in executive office.',
    category: 'Fixed',
    status: 'Good',
    designatedOwner: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1589364231943-fcd8cef0e97a?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-003',
    itemName: 'HP LaserJet Pro M404',
    itemDescription: 'Monochrome laser printer for office use. Currently experiencing paper feed issues.',
    category: 'Electronics',
    status: 'Has Defects',
    designatedOwner: 'IT Department',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-004',
    itemName: 'Conference Table - 12 Seater',
    itemDescription: 'Large wooden conference table for meeting room A. Severe water damage from ceiling leak.',
    category: 'Fixed',
    status: 'BAD',
    designatedOwner: 'Facilities',
    image: 'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-005',
    itemName: 'MacBook Pro 16"',
    itemDescription: 'Apple MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Development laptop for engineering team.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'Mike Chen',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-006',
    itemName: 'Standing Desk - Uplift V2',
    itemDescription: 'Electric height-adjustable desk with bamboo top. Motor malfunction, stuck at standing height.',
    category: 'Fixed',
    status: 'Has Defects',
    designatedOwner: 'Alex Turner',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-007',
    itemName: 'Sony 65" 4K TV',
    itemDescription: 'Display screen for presentation room. Screen has dead pixels and backlight bleeding.',
    category: 'Electronics',
    status: 'BAD',
    designatedOwner: 'AV Department',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-008',
    itemName: 'iPad Pro 12.9"',
    itemDescription: 'Apple iPad Pro for client presentations and field work. M2 chip, 256GB.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-009',
    itemName: 'Office Partition System',
    itemDescription: 'Modular office partition panels for workspace separation. Minor scratches on surface.',
    category: 'Fixed',
    status: 'Has Defects',
    designatedOwner: 'Facilities',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetNumber: 'AST-010',
    itemName: 'Network Switch - Cisco 48-Port',
    itemDescription: 'Managed network switch for server room. Fully operational, recently firmware updated.',
    category: 'Electronics',
    status: 'Good',
    designatedOwner: 'IT Infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function importData() {
  console.log('🚀 Starting data import...\n');

  try {
    const collectionRef = collection(db, 'inventory');
    
    for (let i = 0; i < inventoryData.length; i++) {
      const item = inventoryData[i];
      const docId = `item-${String(i + 1).padStart(3, '0')}`;
      
      console.log(`📝 Importing: ${item.itemName} (${item.assetNumber})`);
      
      // Use setDoc with specific document ID
      await setDoc(doc(collectionRef, docId), item);
      
      console.log(`✅ Successfully imported: ${docId}\n`);
    }

    console.log('🎉 Import completed successfully!');
    console.log(`📊 Total items imported: ${inventoryData.length}`);
    console.log('\n📱 You can now test the app with this data.');
    console.log('🔍 Try scanning QR codes with these asset numbers:');
    inventoryData.forEach(item => {
      console.log(`   - ${item.assetNumber}`);
    });

  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

// Run the import
importData();
