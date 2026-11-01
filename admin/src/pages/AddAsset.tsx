import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { addItem, getNextAssetNumber } from '../inventoryService';
import { Category, Status } from '../types';

export default function AddAsset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nextAssetNumber, setNextAssetNumber] = useState<string>('');
  
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    category: '' as Category | '',
    status: '' as Status | '',
    designatedOwner: '',
    image: '',
  });

  useEffect(() => {
    loadNextAssetNumber();
  }, []);

  const loadNextAssetNumber = async () => {
    try {
      const assetNumber = await getNextAssetNumber();
      setNextAssetNumber(assetNumber);
    } catch (err) {
      console.error('Failed to get next asset number:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.itemName.trim()) {
      setError('Item name is required');
      return;
    }
    if (!formData.itemDescription.trim()) {
      setError('Item description is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.status) {
      setError('Status is required');
      return;
    }
    if (!formData.designatedOwner.trim()) {
      setError('Designated owner is required');
      return;
    }
    if (!formData.image.trim()) {
      setError('Image URL is required');
      return;
    }

    try {
      setLoading(true);
      await addItem({
        itemName: formData.itemName,
        itemDescription: formData.itemDescription,
        category: formData.category as Category,
        status: formData.status as Status,
        designatedOwner: formData.designatedOwner,
        image: formData.image,
      });
      
      setSuccess(`Asset ${nextAssetNumber} added successfully!`);
      
      // Reset form
      setFormData({
        itemName: '',
        itemDescription: '',
        category: '',
        status: '',
        designatedOwner: '',
        image: '',
      });
      
      // Load next asset number
      await loadNextAssetNumber();
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to add asset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Add New Asset
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Next Asset Number:
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {nextAssetNumber || 'Loading...'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Item Description"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <MenuItem value="Fixed">Fixed</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Has Defects">Has Defects</MenuItem>
                  <MenuItem value="BAD">BAD</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Designated Owner"
                  name="designatedOwner"
                  value={formData.designatedOwner}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Adding...' : 'Add Asset'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
