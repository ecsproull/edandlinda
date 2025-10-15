import React from 'react';
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
  Divider
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  Thermostat,
  RvHookup,
  Landscape,
  WaterDrop,
  SportsScore,
  PhotoCamera
} from '@mui/icons-material';
import PageLayout from "../../layouts/pagelayout";

export default function Home() {
  const summerPlan = [
    {
      location: "Coeur d'Alene, Idaho",
      duration: "Mid-May through July",
      highlights: ["IMCda 70.3 Triathlon", "Lake activities", "Cool lake air", "Biking around the lake"],
      icon: <SportsScore color="primary" />
    },
    {
      location: "Anacortes, Washington",
      duration: "August through September",
      highlights: ["Pacific Northwest beauty", "Ocean breezes", "Fidalgo Bay wildlife", "Seaside culture"],
      icon: <WaterDrop color="primary" />
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section with Images */}
      <Paper variant='gradientLight' elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              component="img"
              src="/MyBike2.png"
              alt="Ed's Bike"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              component="img"
              src="/dabus.png"
              alt="Our RV Home"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              component="img"
              src="/dogs.png"
              alt="Our Travel Companions"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Summer 2025 Adventure
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Chip icon={<Thermostat />} label="Escaping AZ Heat" color="primary" />
          <Chip icon={<RvHookup />} label="RV Life" color="secondary" />
          <Chip icon={<Landscape />} label="Pacific Northwest" color="success" />
        </Box>

        <Typography variant="h5" gutterBottom color="text.secondary" align="center" sx={{ mb: 4 }}>
          Our Journey from Desert Heat to Mountain Cool and Coastal Beauty
        </Typography>

        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          As the temperatures in Arizona start to climb in April, it's time to pack up the RV and head to cooler climates. 
          This year's summer adventure promises to be one of our most exciting yet, with two incredible destinations that showcase 
          the diverse beauty of the Pacific Northwest.
        </Typography>

        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Our summer escape plan takes us from the desert heat of Arizona to the refreshing mountain air of Idaho, and then 
          to the stunning coastal landscapes of Washington. It's a journey that combines athletic challenge, natural beauty, 
          and the freedom of the open road that we've come to love so much.
        </Typography>
      </Paper>

      {/* Summer Destinations */}
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonth /> Our Summer Destinations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summerPlan.map((destination, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {destination.icon}
                  <Typography variant="h5" component="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {destination.location}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {destination.duration}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom color="text.primary">
                  Planned Highlights:
                </Typography>
                <List dense>
                  {destination.highlights.map((highlight, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <LocationOn fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={highlight} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Plans */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          What We're Looking Forward To
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Coeur d'Alene Adventures
            </Typography>
            <Typography variant="body1" paragraph>
              Our first stop brings us to the beautiful lake town of Coeur d'Alene, Idaho. Ed will be training for and competing 
              in the IMCda 70.3 triathlon, which means plenty of swimming in the pristine lake, cycling through scenic mountain 
              roads, and running along tree-lined trails.
            </Typography>
            <Typography variant="body1" paragraph>
              Beyond the athletic pursuits, we're excited to explore the charming downtown area, take advantage of the numerous 
              biking opportunities in the surrounding mountains, and enjoy the perfect summer weather that makes this region so 
              popular with RV travelers.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Anacortes Island Life
            </Typography>
            <Typography variant="body1" paragraph>
              August will find us in Anacortes, Washington, where we'll experience true Pacific Northwest coastal living. 
              This charming island town serves as the gateway to the San Juan Islands, offering endless opportunities for 
              ferry rides, island hopping, and coastal exploration.
            </Typography>
            <Typography variant="body1" paragraph>
              We're planning to take advantage of the area's wildlife watching opportunities, explore the numerous 
              state parks, and enjoy the cooler coastal temperatures. The region's famous seafood, local markets, and 
              maritime culture will provide a perfect contrast to our mountain lake experience in Idaho.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Return Journey */}
      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom color="primary">
          The Journey Home
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          As autumn colors begin to paint the Pacific Northwest, we'll start our journey back to Arizona. The fall return trip 
          is always bittersweet – we'll miss the cool mountain air and coastal breezes, but we're always excited to see what 
          new adventures await us back in the desert.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          This annual migration has become one of our favorite aspects of RV life – the ability to follow good weather, 
          experience diverse landscapes, and create new memories while always having the comfort of home with us wherever we go.
        </Typography>
      </Paper>

      {/* Call to Action */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Follow Our Summer Adventure
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          Check back regularly for updates, photos, and stories from our summer travels through 
          Idaho and Washington. The journey begins soon!
        </Typography>
      </Paper>
    </PageLayout>
  );
}