// Mock Firebase modules BEFORE importing anything else
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
