// Mock Firebase modules BEFORE any other imports
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock the data/inventory module to avoid ESM issues
jest.mock('../data/inventory', () => ({
  getInventoryItems: jest.fn().mockResolvedValue([]),
  getInventoryItemById: jest.fn().mockResolvedValue(null),
  getInventoryItemByAssetNumber: jest.fn().mockResolvedValue(null),
  getStatusColor: jest.fn((status: string) => 'medium'),
  getStatusHexColor: jest.fn((status: string) => '#7c6f64'),
  getStatusIcon: jest.fn((status: string) => 'help-circle'),
  getCategoryHexColor: jest.fn((category: string) => '#7c6f64'),
  getCategoryIcon: jest.fn((category: string) => 'cube'),
}));

import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    
    expect(screen.getByTestId('ion-app')).toBeInTheDocument();
  });

  it('should render the router', () => {
    render(<App />);
    
    expect(screen.getByTestId('ion-react-router')).toBeInTheDocument();
  });

  it('should have setupIonicReact called', () => {
    const { setupIonicReact } = require('@ionic/react');
    expect(setupIonicReact).toHaveBeenCalledWith({
      mode: 'md',
    });
  });
});
