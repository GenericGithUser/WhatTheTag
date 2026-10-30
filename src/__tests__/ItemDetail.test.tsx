import { render, screen, waitFor } from '@testing-library/react';
import ItemDetail from '../pages/ItemDetail';
import { useParams } from 'react-router-dom';

// Mock the inventory data service
jest.mock('../data/inventory', () => ({
  getInventoryItemById: jest.fn(),
  getStatusColor: jest.fn((status: string) => {
    switch (status) {
      case 'Good': return 'success';
      case 'Has Defects': return 'warning';
      case 'BAD': return 'danger';
      default: return 'medium';
    }
  }),
  getStatusHexColor: jest.fn((status: string) => {
    switch (status) {
      case 'Good': return '#98971a';
      case 'Has Defects': return '#d79921';
      case 'BAD': return '#cc241d';
      default: return '#7c6f64';
    }
  }),
  getStatusIcon: jest.fn((status: string) => {
    switch (status) {
      case 'Good': return 'checkmark-circle';
      case 'Has Defects': return 'warning';
      case 'BAD': return 'close-circle';
      default: return 'help-circle';
    }
  }),
  getCategoryHexColor: jest.fn((category: string) => {
    switch (category) {
      case 'Fixed': return '#689d6a';
      case 'Electronics': return '#458588';
      default: return '#7c6f64';
    }
  }),
  getCategoryIcon: jest.fn((category: string) => {
    switch (category) {
      case 'Fixed': return 'business';
      case 'Electronics': return 'hardware-chip';
      default: return 'cube';
    }
  }),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

import { getInventoryItemById } from '../data/inventory';

const mockGetInventoryItemById = getInventoryItemById as jest.MockedFunction<typeof getInventoryItemById>;

describe('ItemDetail Component', () => {
  const mockItem = {
    id: 'test-id-123',
    assetNumber: 'AST-001',
    itemName: 'Test Laptop',
    itemDescription: 'A test laptop for development purposes',
    category: 'Electronics' as const,
    status: 'Good' as const,
    designatedOwner: 'John Doe',
    image: 'https://example.com/laptop.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'test-id-123' });
  });

  it('should render loading spinner initially', () => {
    mockGetInventoryItemById.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ItemDetail />);
    
    expect(screen.getByTestId('ion-spinner')).toBeInTheDocument();
  });

  it('should display item name after loading', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
    });
  });

  it('should display asset number', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('AST-001')).toBeInTheDocument();
    });
  });

  it('should display item description', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('A test laptop for development purposes')).toBeInTheDocument();
    });
  });

  it('should display designated owner', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should display category', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  it('should display status', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('GOOD')).toBeInTheDocument();
    });
  });

  it('should display status badge with correct color', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      const badges = screen.getAllByTestId('ion-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('should display category badge with correct color', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      const chips = screen.getAllByTestId('ion-chip');
      expect(chips.length).toBeGreaterThan(0);
    });
  });

  it('should display last updated date', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/December 1, 2024/)).toBeInTheDocument();
    });
  });

  it('should display QR code representation', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Asset Tag')).toBeInTheDocument();
    });
  });

  it('should display asset information section', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Asset Information')).toBeInTheDocument();
    });
  });

  it('should display "Asset Not Found" when item does not exist', async () => {
    mockGetInventoryItemById.mockResolvedValue(null);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Asset Not Found')).toBeInTheDocument();
      expect(screen.getByText('The requested inventory asset could not be found.')).toBeInTheDocument();
    });
  });

  it('should handle Fixed category correctly', async () => {
    const fixedItem = { ...mockItem, category: 'Fixed' as const };
    mockGetInventoryItemById.mockResolvedValue(fixedItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Fixed')).toBeInTheDocument();
    });
  });

  it('should handle Has Defects status correctly', async () => {
    const defectiveItem = { ...mockItem, status: 'Has Defects' as const };
    mockGetInventoryItemById.mockResolvedValue(defectiveItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('HAS DEFECTS')).toBeInTheDocument();
    });
  });

  it('should handle BAD status correctly', async () => {
    const badItem = { ...mockItem, status: 'BAD' as const };
    mockGetInventoryItemById.mockResolvedValue(badItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('BAD')).toBeInTheDocument();
    });
  });

  it('should display item image', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      const img = screen.getByAltText('Test Laptop');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/laptop.jpg');
    });
  });

  it('should handle image load error gracefully', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      const img = screen.getByAltText('Test Laptop');
      expect(img).toBeInTheDocument();
    });
  });

  it('should display all asset information fields', async () => {
    mockGetInventoryItemById.mockResolvedValue(mockItem);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Asset Number')).toBeInTheDocument();
      expect(screen.getByText('Designated Owner')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });
  });

  it('should handle item without timestamps', async () => {
    const { createdAt, updatedAt, ...itemWithoutTimestamps } = mockItem;
    mockGetInventoryItemById.mockResolvedValue(itemWithoutTimestamps);
    
    render(<ItemDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
      expect(screen.queryByText('Last Updated')).not.toBeInTheDocument();
    });
  });
});
