import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getAllItems, getItemCountByStatus, getItemCountByCategory, deleteItem } from '../inventoryService';
import { InventoryItem, Status, Category } from '../types';

const statusColors: Record<Status, 'success' | 'warning' | 'error'> = {
  'Good': 'success',
  'Has Defects': 'warning',
  'BAD': 'error',
};

const categoryColors: Record<Category, 'info' | 'primary'> = {
  'Fixed': 'info',
  'Electronics': 'primary',
};

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<Status, number>>({
    'Good': 0,
    'Has Defects': 0,
    'BAD': 0,
  });
  const [categoryCounts, setCategoryCounts] = useState<Record<Category, number>>({
    'Fixed': 0,
    'Electronics': 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, statusData, categoryData] = await Promise.all([
        getAllItems(),
        getItemCountByStatus(),
        getItemCountByCategory(),
      ]);
      setItems(itemsData);
      setStatusCounts(statusData);
      setCategoryCounts(categoryData);
      setError(null);
    } catch (err) {
      setError('Failed to load inventory data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, assetNumber: string) => {
    if (window.confirm(`Are you sure you want to delete asset ${assetNumber}? This action cannot be undone.`)) {
      try {
        await deleteItem(id);
        loadData();
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Inventory Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add')}
        >
          Add New Asset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Assets
              </Typography>
              <Typography variant="h3" component="div">
                {items.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Good Condition
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                {statusCounts['Good']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Has Defects
              </Typography>
              <Typography variant="h3" component="div" color="warning.main">
                {statusCounts['Has Defects']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                BAD Condition
              </Typography>
              <Typography variant="h3" component="div" color="error.main">
                {statusCounts['BAD']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fixed Assets
              </Typography>
              <Typography variant="h4" component="div" color="info.main">
                {categoryCounts['Fixed']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Electronics
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {categoryCounts['Electronics']}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inventory Table */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        All Assets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Number</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {item.assetNumber}
                  </Typography>
                </TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>
                  <Chip
                    label={item.category}
                    color={categoryColors[item.category]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={statusColors[item.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.designatedOwner}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/edit/${item.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.id, item.assetNumber)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
