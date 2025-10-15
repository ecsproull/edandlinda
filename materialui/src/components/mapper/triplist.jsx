import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Collapse
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Phone,
  Email,
  Language,
  Info,
  ExpandMore,
  ExpandLess,
  RvHookup,
  Home,
  LocalGasStation,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import PageLayout from '../../layouts/pagelayout';

export default function TripList({ tripPoints = [] }) { // Receive as props
  const [expandedItems, setExpandedItems] = useState({});

  const sortedTripPoints = [...tripPoints].sort((a, b) => {
    const dateA = new Date(a.place_arrive);
    const dateB = new Date(b.place_arrive);
    return dateA - dateB; // Ascending order (oldest first)
    // return dateB - dateA; // For descending order (newest first)
  });

  const getIconType = (iconType) => {
    switch (iconType) {
      case 1:
        return { icon: <RvHookup />, label: 'RV Park', color: 'success' };
      case 2:
        return { icon: <Home />, label: 'Home', color: 'primary' };
      case 3:
        return { icon: <LocalGasStation />, label: 'Rest Area', color: 'warning' };
      default:
        return { icon: <LocationOn />, label: 'Location', color: 'default' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCurrentLocation = (arriveDate, departDate) => {
    const today = new Date();
    const arrive = new Date(arriveDate);
    const depart = new Date(departDate);
    
    today.setHours(0, 0, 0, 0);
    arrive.setHours(0, 0, 0, 0);
    depart.setHours(0, 0, 0, 0);
    
    return today >= arrive && today <= depart;
  };

  const handleExpandClick = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (tripPoints.length === 0) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6">Loading trip points...</Typography>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper variant='gradient' elevation={3} sx={{ p: 4, mb: 4}}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Trip Points
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
            All destinations from our travels
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Chip 
              icon={<LocationOn />} 
              label={`${tripPoints.length} Locations`} 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
            />
          </Box>
        </Paper>

        {/* Trip Points List */}
        <Grid container spacing={3}>
          {sortedTripPoints.map((point, index) => {
            const iconInfo = getIconType(point.place_icon_type);
            const isCurrent = isCurrentLocation(point.place_arrive, point.place_depart);
            const isExpanded = expandedItems[index];

            return (
              <Grid size={{xs: 12,  md: 6, lg: 4 }} key={point.place_id || index}>
                <Card 
                  elevation={isCurrent ? 6 : 2}
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s',
                    border: isCurrent ? '2px solid #4caf50' : 'none',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Header with icon and name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: `${iconInfo.color}.main` }}>
                        {iconInfo.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                          {point.place_name}
                          {isCurrent && (
                            <Chip 
                              label="CURRENT" 
                              size="small" 
                              color="success" 
                              sx={{ ml: 1, fontSize: '0.75rem' }}
                            />
                          )}
                        </Typography>
                        <Chip 
                          label={iconInfo.label} 
                          size="small" 
                          color={iconInfo.color}
                          variant="outlined"
                        />
                      </Box>
                      <IconButton 
                        onClick={() => handleExpandClick(index)}
                        size="small"
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    {/* Basic Info */}
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CalendarToday fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${formatDate(point.place_arrive)} - ${formatDate(point.place_depart)}`}
                          secondary="Stay dates"
                        />
                      </ListItem>
                      
                      {!point.place_hide_info && point.place_address && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <LocationOn fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={point.place_address}
                            secondary="Address"
                          />
                        </ListItem>
                      )}

                      {point.place_hide_info && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <VisibilityOff fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Private location"
                            secondary="Address hidden"
                          />
                        </ListItem>
                      )}
                    </List>

                    {/* Expanded Details */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Divider sx={{ my: 2 }} />
                      <List dense>
                        {!point.place_hide_info && point.place_phone && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Phone fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={point.place_phone} secondary="Phone" />
                          </ListItem>
                        )}

                        {!point.place_hide_info && point.place_email && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Email fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={point.place_email} secondary="Email" />
                          </ListItem>
                        )}

                        {!point.place_hide_info && point.place_website && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Language fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={point.place_website} secondary="Website" />
                          </ListItem>
                        )}

                        {point.place_info && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Info fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={point.place_info} 
                              secondary="Additional details"
                            />
                          </ListItem>
                        )}

                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <LocationOn fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${point.place_lat}, ${point.place_lng}`}
                            secondary="Coordinates"
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </PageLayout>
  );
}