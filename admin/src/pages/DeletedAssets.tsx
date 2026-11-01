import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getDeletedAssetNumbers } from '../inventoryService';
import { DeletedAssetNumber } from '../types';

export default function DeletedAssets() {
  const [deletedAssets, setDeletedAssets] = useState<DeletedAssetNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeletedAssets();
  }, []);

  const loadDeletedAssets = async () => {
    try {
      setLoading(true);
      const data = await getDeletedAssetNumbers();
      setDeletedAssets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load deleted assets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Deleted Assets
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        These asset numbers have been deleted and will not be reused. This ensures data integrity and prevents confusion.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Deleted: {deletedAssets.length}
          </Typography>

          {deletedAssets.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No deleted assets yet
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Number</TableCell>
                    <TableCell>Deleted At</TableCell>
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deletedAssets.map((asset, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="error.main">
                          {asset.assetNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(asset.deletedAt)}
                      </TableCell>
                      <TableCell>
                        {asset.reason || 'No reason provided'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
