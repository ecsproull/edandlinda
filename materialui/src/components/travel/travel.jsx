import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  RvHookup as RvIcon,
  LocationOn,
  CalendarMonth,
  Route,
  Star,
  Pets,
  CameraAlt,
  LocalGasStation,
  Terrain
} from '@mui/icons-material';
import PageLayout from '../../layouts/pagelayout';

export default function Travel() {
  const destinations = [
    { year: '2016', location: 'Bellevue WA', miles: 2850, highlight: 'Travel for Work' },
    { year: '2017', location: 'Retirement Trip', miles: 2900, highlight: 'Last Travel for Work' },
    { year: '2018', location: 'Lap around country', miles: 6900, highlight: 'AZ, Fl, OH, MI, WA, AZ' },
    { year: '2019', location: 'Flagstaff, Then North', miles: 3000, highlight: 'Ironman Training at 7000ft' },
    { year: '2020', location: 'Glacier National Park', miles: 3200, highlight: 'Amazing Views.' },
    { year: '2021', location: 'Pueblo CO Chile Fest', miles: 3600, highlight: 'Discovery Owners Meetup' },
    { year: '2022', location: 'Short Lap Around the USA', miles: 5500, highlight: 'Caught covid' },
    { year: '2023-2025', location: 'Northwest Loop', miles: 7500, highlight: 'Escaping the AZ Heat' },
  ];

  const rvStats = {
    totalMiles: 35180,
    states: 35,
    nationalParks: 4,
    campgrounds: 120,
    breakdowns: 1,
    newFriends: 'Countless'
  };

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, minHeight: '150vh' }}>
        {/* Hero Section */}
        <Paper variant='gradient' elevation={6} sx={{ p: 4, mb: 4}}>
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            A Decade on the Road
          </Typography>
          <Typography variant="h5" align="center" sx={{ opacity: 0.9, mb: 3 }}>
            10-Years of RV Adventure Across North America
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Route />} label={`${rvStats.totalMiles.toLocaleString()} Miles`} sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<LocationOn />} label={`${rvStats.states} States`} sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<Star />} label={`${rvStats.nationalParks} National Parks`} sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
        </Paper>

        {/* Introduction Story */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RvIcon /> The Journey Begins
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            It all started in 2016 when we bought our first RV – a 40-foot Class A motorhome that would become our home away from home for the next decade.
            What began as a simple retirement dream quickly evolved into an epic adventure spanning over 35,000 miles across North America.
            In 2020 we upgraded to a new 44-foot Fleetwood Discover LXE, which offered even more comfort and amenities for our travels.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            We sold our house in Bellevue WA in 2016 and moved into our hose in AZ, but I remained employed by Microsoft. We lived in the RV while I completed my final year of work.
            Linda had already retired in 2016. In 2018 we were free to travel. After visiting friends and family from Arizona to Florida to Atlanta to Ohio and Michigan we headed out west.
            We stopped to see the Black Hills and Mount Rushmore on the way. It was our first big trip.
          </Typography>
        </Paper>

        {/* Yearly Adventures */}
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          <CalendarMonth sx={{ mr: 1 }} /> Year by Year Adventures
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {destinations.map((dest, index) => (
            <Grid size={{xs: 12, md: 6, lg: 4}} key={index}>
              <Card elevation={3} sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {dest.year}
                  </Typography>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', minHeight: '3rem' }}>
                    {dest.location}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocalGasStation color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {dest.miles.toLocaleString()} miles
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{dest.highlight}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Memorable Experiences */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CameraAlt /> Unforgettable Moments
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 6}}>
              <Typography variant="h6" gutterBottom>The Lap Around the Country (2018)</Typography>
              <Typography variant="body1" paragraph>
                This was a long, fun trip. We started by visiting the Texas Rangers ballpark with the Mariners in town. Then we spent 7 days at a Corps of Engineers park with awesome lake views.
                We then headed to Houston, TX to visit an old college friend and his family. After that we headed to Florida to visit a family friend.
                Next stop was Atlanta to visit my aunt and uncle. Then on to Nashville where we went honky tonking on Broadway. Then up to Cleveland to visit another aunt and uncle and several cousins.
                We then headed to Michigan and saw Dierks Bentley, Brothers Osborne, and Lobo at Pine Knob. After leaving there we went to Decatur, Illinois to have some warranty work done on our RV.
                We then headed over to Wisconsin to visit Linda's niece and her husband.
                On the way back to Coeur d'Alene, Idaho we stopped to see the Black Hills and Mount Rushmore. We spent the remainder of the summer in Idaho and Washington.
              </Typography>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <Typography variant="h6" gutterBottom>The Breakdown Chronicles</Typography>
              <Typography variant="body1" paragraph>
                Most of our travels have been smooth sailing. Our first coach, a 2017 Fleetwood Discover LXE was a nightmare. It leaked water everywhere.
                As I mentioned that was all taken care of at the factory in Decatur Illinois. Dealing with RV repairs is a nightmare so I've mostly learned to  do it myself.
                Our new coach, a 2020 Fleetwood Discover LXE has been much better. The only major issue we had was with the 2017 when a water pump went out.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* RV Community */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h4" gutterBottom color="primary">
            The RV Community
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            Perhaps the greatest discovery of our decade on the road has been the incredible RV community. From impromptu barbecues to organized rallies with hundreds of fellow travelers, we've forged friendships that span the continent. The unwritten rules
            of RV etiquette – always help a neighbor, share your tools, and never leave without saying goodbye – have restored our faith in human kindness.
          </Typography>
        </Paper>

        {/* By the Numbers */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            A Decade by the Numbers
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {rvStats.totalMiles.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">Miles Traveled</Typography>
              </Box>
            </Grid>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {rvStats.states}
                </Typography>
                <Typography variant="body2" color="text.secondary">States Visited</Typography>
              </Box>
            </Grid>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {rvStats.nationalParks}
                </Typography>
                <Typography variant="body2" color="text.secondary">National Parks</Typography>
              </Box>
            </Grid>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {rvStats.campgrounds}
                </Typography>
                <Typography variant="body2" color="text.secondary">Campgrounds</Typography>
              </Box>
            </Grid>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {rvStats.breakdowns}
                </Typography>
                <Typography variant="body2" color="text.secondary">Major Breakdowns</Typography>
              </Box>
            </Grid>
            <Grid size={{xs: 6, sm: 4, md: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  ∞
                </Typography>
                <Typography variant="body2" color="text.secondary">New Friends</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Lessons Learned */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Lessons from the Road
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Star color="primary" /></ListItemIcon>
              <ListItemText
                primary="Home is where you park it"
                secondary="We learned that comfort and contentment come from experiences, not square footage."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Pets color="primary" /></ListItemIcon>
              <ListItemText
                primary="Simple pleasures are the greatest"
                secondary="A perfect sunset, a crackling campfire, and good company are worth more than any luxury."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Terrain color="primary" /></ListItemIcon>
              <ListItemText
                primary="Nature is the ultimate healer"
                secondary="Every national park, forest, and scenic overlook reminded us of the world's incredible beauty."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Route color="primary" /></ListItemIcon>
              <ListItemText
                primary="The journey matters more than the destination"
                secondary="Some of our best memories happened during unexpected detours and spontaneous stops."
              />
            </ListItem>
          </List>
        </Paper>

        {/* Looking Forward */}
        <Paper variant='gradient' elevation={6} sx={{ p: 4}}>
          <Typography variant="h4" gutterBottom align="center">
            The Road Ahead
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            As we look back on this incredible decade, we're filled with gratitude for every mile, every sunrise, every new friend, and every challenge
            that helped us grow. The road has taught us that life is meant to be lived fully, that adventure is always just around the next curve,
            and that the best stories come from saying "yes" to the unknown.
          </Typography>
          <Typography variant="body1" align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
            Here's to the next ten years of adventure, discovery, and life on the open road!
          </Typography>
        </Paper>
      </Box>
    </PageLayout>
  );
}