import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import { api, apiHelpers } from '../api/api';
import { useAuth } from '../contexts/authentication';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../layouts/pagelayout';

const GEOLOCATION_API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;

function PlaceForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  // Get place data from navigation state (for editing)
  const placeToEdit = location.state?.place;
  const isEditing = Boolean(placeToEdit);

  const [formData, setFormData] = useState({
    place_id: 2,
    place_name: '',
    place_info: '',
    place_lat: 0,
    place_lng: 0,
    place_icon_type: 1,
    place_address: '',
    place_phone: '',
    place_email: '',
    place_website: '',
    place_arrive: '',
    place_depart: '',
    place_hide_info: false
  });

  // Populate form with place data when editing
  useEffect(() => {
    if (isEditing && placeToEdit) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          return new Date(dateString).toISOString().split('T')[0];
        } catch (err) {
          return '';
        }
      };

      setFormData({
        place_id: placeToEdit.id || placeToEdit.place_id || 2,
        place_name: placeToEdit.place_name || '',
        place_info: placeToEdit.place_info || '',
        place_lat: placeToEdit.place_lat || 0,
        place_lng: placeToEdit.place_lng || 0,
        place_icon_type: placeToEdit.place_icon_type || 1,
        place_address: placeToEdit.place_address || '',
        place_phone: placeToEdit.place_phone || '',
        place_email: placeToEdit.place_email || '',
        place_website: placeToEdit.place_website || '',
        place_arrive: formatDateForInput(placeToEdit.place_arrive || placeToEdit.place_arrive_date),
        place_depart: formatDateForInput(placeToEdit.place_depart || placeToEdit.place_depart_date),
        place_hide_info: placeToEdit.place_hide_info || 0
      });
    }
  }, [isEditing, placeToEdit]);

  if (!GEOLOCATION_API_KEY) {
    console.error('MAP_API_KEY is not defined in environment variables');
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">
          GEOLOCATION_API_KEY key is not configured. Please check your environment variables.
        </Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'place_icon_type') {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === 'place_hide_info') {
      setFormData({ ...formData, [name]: checked ? true : false });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = { ...formData };

      // Format dates for submission
      if (submitData.place_arrive) {
        submitData.place_arrive = new Date(submitData.place_arrive).toISOString();
      }
      if (submitData.place_depart) {
        submitData.place_depart = new Date(submitData.place_depart).toISOString();
      }

      let response;
      if (isEditing) {
        // Update existing place
        response = await api.places.update(placeToEdit.id, submitData);
        console.log('Place updated successfully:', response.data);
      } else {
        // Create new place
        response = await api.places.create(submitData);
        console.log('Place added successfully:', response.data);
      }

      // Navigate to map or places list on success
      navigate('/map');

    } catch (error) {
      console.error('Error saving place:', error);
      setError(isEditing ? 'Failed to update place' : 'Failed to create place');
      apiHelpers.handleError(error);
    }
  };

  const updateLatLng = async () => {
    try {
      const address = formData.place_address.replaceAll(' ', '+');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GEOLOCATION_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;

      setFormData({
        ...formData,
        place_lat: lat,
        place_lng: lng
      });
    } catch (error) {
      setError('Failed to lookup coordinates ' + error.message);
    }
  };

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isEditing ? 'Edit Place' : 'Add New Place'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Place Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Place Name"
                  name="place_name"
                  value={formData.place_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Phone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="place_phone"
                  value={formData.place_phone}
                  onChange={handleChange}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="place_email"
                  type="email"
                  value={formData.place_email}
                  onChange={handleChange}
                />
              </Grid>

              {/* Website */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Website"
                  name="place_website"
                  value={formData.place_website}
                  onChange={handleChange}
                />
              </Grid>

              {/* Address with Lookup Button */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Full Address"
                    name="place_address"
                    value={formData.place_address}
                    onChange={handleChange}
                  />
                  <Button
                    variant="contained"
                    onClick={updateLatLng}
                    sx={{ minWidth: 120 }}
                  >
                    Lookup
                  </Button>
                </Box>
              </Grid>

              {/* Pin Icon Type */}
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Pin Icon Type</InputLabel>
                  <Select
                    name="place_icon_type"
                    value={formData.place_icon_type}
                    onChange={handleChange}
                    label="Pin Icon Type"
                  >
                    <MenuItem value={1}>RV Park</MenuItem>
                    <MenuItem value={2}>Home</MenuItem>
                    <MenuItem value={3}>Rest Area</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Arrive Date */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Arrive"
                  name="place_arrive"
                  type="date"
                  value={formData.place_arrive}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Depart Date */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Depart"
                  name="place_depart"
                  type="date"
                  value={formData.place_depart}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Latitude */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Latitude"
                  name="place_lat"
                  type="number"
                  value={formData.place_lat}
                  onChange={handleChange}
                  inputProps={{ step: "any" }}
                />
              </Grid>

              {/* Longitude */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Longitude"
                  name="place_lng"
                  type="number"
                  value={formData.place_lng}
                  onChange={handleChange}
                  inputProps={{ step: "any" }}
                />
              </Grid>

              {/* Additional Details */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  name="place_info"
                  value={formData.place_info}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Additional details go here"
                />
              </Grid>

              {/* Private Checkbox */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="place_hide_info"
                        checked={formData.place_hide_info === true}
                        onChange={handleChange}
                      />
                    }
                    label="Private"
                  />
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #00bcd4 30%, #0097a7 90%)',
                      px: 4,
                      py: 1.5
                    }}
                  >
                    {isEditing ? 'Update Place' : 'Add Place'}
                  </Button>
                </Box>
              </Grid>

              {/* Error Display */}
              {error && (
                <Grid size={12}>
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                </Grid>
              )}
            </Grid>

            {/* Hidden ID field */}
            <input type="hidden" name="place_id" value={formData.place_id} />
          </Box>
        </Paper>
      </Box >
    </PageLayout >
  );
}

export default PlaceForm;