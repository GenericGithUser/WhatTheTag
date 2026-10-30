import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Scanner from '../pages/Scanner';

// Mock the inventory data service
jest.mock('../data/inventory', () => ({
  getInventoryItemByAssetNumber: jest.fn(),
  getStatusColor: jest.fn((status: string) => {
    switch (status) {
      case 'Good': return 'success';
      case 'Has Defects': return 'warning';
      case 'BAD': return 'danger';
      default: return 'medium';
    }
  }),
  getCategoryHexColor: jest.fn((category: string) => {
    switch (category) {
      case 'Fixed': return '#689d6a';
      case 'Electronics': return '#458588';
      default: return '#7c6f64';
    }
  }),
}));

import { getInventoryItemByAssetNumber } from '../data/inventory';

const mockGetInventoryItemByAssetNumber = getInventoryItemByAssetNumber as jest.MockedFunction<typeof getInventoryItemByAssetNumber>;

describe('Scanner Component', () => {
  const mockItem = {
    id: '1',
    assetNumber: 'AST-001',
    itemName: 'Test Laptop',
    itemDescription: 'A test laptop for development',
    category: 'Electronics' as const,
    status: 'Good' as const,
    designatedOwner: 'John Doe',
    image: 'https://example.com/laptop.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the scanner title', () => {
    render(<Scanner />);
    
    expect(screen.getByTestId('ion-title')).toHaveTextContent('Scan Asset');
  });

  it('should display scan instructions', () => {
    render(<Scanner />);
    
    expect(screen.getByText('Scan Asset Tag')).toBeInTheDocument();
    expect(screen.getByText(/Point your camera at the QR code or barcode/)).toBeInTheDocument();
  });

  it('should render start scanning button', () => {
    render(<Scanner />);
    
    const scanButton = screen.getByText('Start Scanning');
    expect(scanButton).toBeInTheDocument();
  });

  it('should render manual entry section', () => {
    render(<Scanner />);
    
    expect(screen.getByText(/Or enter asset number manually/)).toBeInTheDocument();
    expect(screen.getByTestId('ion-input')).toBeInTheDocument();
  });

  it('should render search button for manual entry', () => {
    render(<Scanner />);
    
    const searchButton = screen.getByText('Search');
    expect(searchButton).toBeInTheDocument();
  });

  it('should render quick demo buttons', () => {
    render(<Scanner />);
    
    expect(screen.getByText('Quick Demo:')).toBeInTheDocument();
    expect(screen.getByText('AST-001')).toBeInTheDocument();
    expect(screen.getByText('AST-002')).toBeInTheDocument();
    expect(screen.getByText('AST-003')).toBeInTheDocument();
  });

  it('should disable search button when input is empty', () => {
    render(<Scanner />);
    
    const searchButton = screen.getByText('Search');
    expect(searchButton).toBeDisabled();
  });

  it('should enable search button when input has value', async () => {
    render(<Scanner />);
    
    const input = screen.getByTestId('ion-input');
    await userEvent.type(input, 'AST-001');
    
    const searchButton = screen.getByText('Search');
    expect(searchButton).not.toBeDisabled();
  });

  it('should display scanned item details after successful scan', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    // Click on quick demo button
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('A test laptop for development')).toBeInTheDocument();
    });
  });

  it('should display loading state while looking up asset', async () => {
    mockGetInventoryItemByAssetNumber.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockItem), 100))
    );
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText('Looking up asset...')).toBeInTheDocument();
    });
  });

  it('should display alert when asset not found', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(null);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('ion-alert')).toBeInTheDocument();
    });
  });

  it('should display View Details and Scan Again buttons after scan', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Scan Again')).toBeInTheDocument();
    });
  });

  it('should display asset number in scanned item view', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Asset: AST-001/)).toBeInTheDocument();
    });
  });

  it('should display status badge in scanned item view', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      const badges = screen.getAllByTestId('ion-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('should display category badge in scanned item view', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  it('should handle manual search with Enter key', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const input = screen.getByTestId('ion-input');
    await userEvent.type(input, 'AST-001{enter}');
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
    });
  });

  it('should reset to scan view when Scan Again is clicked', async () => {
    mockGetInventoryItemByAssetNumber.mockResolvedValue(mockItem);
    
    render(<Scanner />);
    
    const demoButton = screen.getByText('AST-001');
    await userEvent.click(demoButton);
    
    await waitFor(() => {
      expect(screen.getByText('Scan Again')).toBeInTheDocument();
    });
    
    const scanAgainButton = screen.getByText('Scan Again');
    await userEvent.click(scanAgainButton);
    
    await waitFor(() => {
      expect(screen.getByText('Scan Asset Tag')).toBeInTheDocument();
    });
  });
});
