import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Container,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function EditPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.places.getAll();
      setPlaces(response.data);
    } catch (err) {
      console.error('Error loading places:', err);
      setError('Failed to load places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const editHandler = (place) => {
    navigate('/add-place', { state: { place } });
  };

  const deleteHandler = async (placeId) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await api.places.delete(placeId);
        setPlaces(places.filter(place => place.id !== placeId));
        console.log('Place deleted successfully');
      } catch (err) {
        console.error('Error deleting place:', err);
        setError('Failed to delete place. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Places
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Place Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Arrival Date</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No places found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  places.map((place) => (
                    <TableRow key={place.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {place.place_name || 'Unnamed Place'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {place.place_address || 'No address provided'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatDate(place.place_arrive)}
                          size="small"
                          variant="outlined"
                          color={place.place_arrive_date ? "primary" : "default"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => editHandler(place)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteHandler(place.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

export default EditPlaces;