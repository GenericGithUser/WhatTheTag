import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';

// Mock the inventory data service
jest.mock('../data/inventory', () => ({
  getInventoryItems: jest.fn(),
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

import { getInventoryItems } from '../data/inventory';

const mockGetInventoryItems = getInventoryItems as jest.MockedFunction<typeof getInventoryItems>;

describe('Dashboard Component', () => {
  const mockItems = [
    {
      id: '1',
      assetNumber: 'AST-001',
      itemName: 'Test Laptop',
      itemDescription: 'A test laptop',
      category: 'Electronics' as const,
      status: 'Good' as const,
      designatedOwner: 'John Doe',
      image: 'https://example.com/laptop.jpg',
    },
    {
      id: '2',
      assetNumber: 'AST-002',
      itemName: 'Test Chair',
      itemDescription: 'A test chair',
      category: 'Fixed' as const,
      status: 'Has Defects' as const,
      designatedOwner: 'Jane Smith',
      image: 'https://example.com/chair.jpg',
    },
    {
      id: '3',
      assetNumber: 'AST-003',
      itemName: 'Test Monitor',
      itemDescription: 'A broken monitor',
      category: 'Electronics' as const,
      status: 'BAD' as const,
      designatedOwner: 'Bob Wilson',
      image: 'https://example.com/monitor.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInventoryItems.mockResolvedValue(mockItems);
  });

  it('should render the dashboard title', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ion-title')).toHaveTextContent('WhatTheTag');
    });
  });

  it('should display loading spinner initially', () => {
    mockGetInventoryItems.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Dashboard />);
    
    expect(screen.getByTestId('ion-spinner')).toBeInTheDocument();
  });

  it('should load and display inventory items', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
      expect(screen.getByText('Test Chair')).toBeInTheDocument();
      expect(screen.getByText('Test Monitor')).toBeInTheDocument();
    });
  });

  it('should display item owners', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  it('should display status badges', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const badges = screen.getAllByTestId('ion-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('should display category chips', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const chips = screen.getAllByTestId('ion-chip');
      expect(chips.length).toBeGreaterThan(0);
    });
  });

  it('should render search bar', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ion-searchbar')).toBeInTheDocument();
    });
  });

  it('should render segment filter', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('ion-segment')).toBeInTheDocument();
    });
  });

  it('should render scan FAB button', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const fabButton = document.querySelector('.fixed.bottom-6.right-6');
      expect(fabButton).toBeInTheDocument();
    });
  });

  it('should display correct stats counts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Total items
      expect(screen.getByText('3')).toBeInTheDocument();
      // Good status count
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('should display "No items found" when search returns no results', async () => {
    mockGetInventoryItems.mockResolvedValue([]);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });
  });

  it('should handle empty state gracefully', async () => {
    mockGetInventoryItems.mockResolvedValue([]);
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });
  });

  it('should filter items by search text', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
    });

    const searchbar = screen.getByTestId('ion-searchbar');
    await userEvent.type(searchbar, 'Laptop');

    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument();
      expect(screen.queryByText('Test Chair')).not.toBeInTheDocument();
    });
  });
});
