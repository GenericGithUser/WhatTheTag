import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock Ionic components
jest.mock('@ionic/react', () => {
  const React = require('react');
  return {
    IonApp: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-app' }, children),
    IonPage: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-page' }, children),
    IonHeader: ({ children }: any) => React.createElement('header', { 'data-testid': 'ion-header' }, children),
    IonToolbar: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-toolbar' }, children),
    IonTitle: ({ children }: any) => React.createElement('h1', { 'data-testid': 'ion-title' }, children),
    IonContent: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-content' }, children),
    IonButton: ({ children, onClick, ...props }: any) =>
      React.createElement('button', { onClick, 'data-testid': props['data-testid'] || 'ion-button', ...props }, children),
    IonCard: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-card' }, children),
    IonCardHeader: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-card-header' }, children),
    IonCardTitle: ({ children }: any) => React.createElement('h2', { 'data-testid': 'ion-card-title' }, children),
    IonCardContent: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-card-content' }, children),
    IonIcon: ({ icon, ...props }: any) => React.createElement('span', { 'data-testid': 'ion-icon', 'data-icon': icon, ...props }),
    IonSpinner: (props: any) => React.createElement('div', { 'data-testid': 'ion-spinner', ...props }),
    IonBadge: ({ children, ...props }: any) => React.createElement('span', { 'data-testid': 'ion-badge', ...props }, children),
    IonSearchbar: ({ onIonInput, ...props }: any) =>
      React.createElement('input', {
        'data-testid': 'ion-searchbar',
        onChange: (e: any) => onIonInput?.({ detail: { value: e.target.value } }),
        ...props,
      }),
    IonSegment: ({ children, value, onIonChange }: any) =>
      React.createElement('div', { 'data-testid': 'ion-segment', 'data-value': value }, children),
    IonSegmentButton: ({ children, value }: any) =>
      React.createElement('button', { 'data-testid': 'ion-segment-button', 'data-value': value }, children),
    IonLabel: ({ children }: any) => React.createElement('span', { 'data-testid': 'ion-label' }, children),
    IonItem: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-item' }, children),
    IonAvatar: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-avatar' }, children),
    IonChip: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-chip' }, children),
    IonBackButton: ({ defaultHref, text, ...props }: any) => 
      React.createElement('button', { 'data-testid': 'ion-back-button', 'data-default-href': defaultHref, ...props }, text),
    IonButtons: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-buttons' }, children),
    IonAlert: ({ isOpen, onDidDismiss }: any) =>
      isOpen ? React.createElement('div', { 'data-testid': 'ion-alert' },
        React.createElement('button', { onClick: onDidDismiss }, 'Close')) : null,
    IonInput: ({ value, onIonInput, placeholder, onKeyDown, ...props }: any) =>
      React.createElement('input', {
        'data-testid': 'ion-input',
        value,
        placeholder,
        onChange: (e: any) => onIonInput?.({ detail: { value: e.target.value } }),
        onKeyDown,
        ...props,
      }),
    setupIonicReact: jest.fn(),
  };
});

// Mock Ionic router
jest.mock('@ionic/react-router', () => {
  const React = require('react');
  return {
    IonReactRouter: ({ children }: any) => React.createElement('div', { 'data-testid': 'ion-react-router' }, children),
  };
});

// Mock ionicons
jest.mock('ionicons/icons', () => ({
  scanOutline: 'scan-outline',
  cubeOutline: 'cube-outline',
  businessOutline: 'business-outline',
  hardwareChipOutline: 'hardware-chip-outline',
  alertCircleOutline: 'alert-circle-outline',
  checkmarkCircle: 'checkmark-circle',
  warning: 'warning',
  closeCircle: 'close-circle',
  personOutline: 'person-outline',
  pricetagOutline: 'pricetag-outline',
  calendarOutline: 'calendar-outline',
  documentTextOutline: 'document-text-outline',
  flashOutline: 'flash-outline',
  flashOffOutline: 'flash-off-outline',
  alertCircle: 'alert-circle',
  helpCircle: 'help-circle',
}));

// Mock html5-qrcode
jest.mock('html5-qrcode', () => ({
  Html5Qrcode: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn(),
  })),
  Html5QrcodeSupportedFormats: {
    QR_CODE: 0,
    CODE_128: 1,
    CODE_39: 2,
    EAN_13: 3,
  },
}));

// Mock firebase
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
