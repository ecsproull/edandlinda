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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'; // Import from @mui/lab instead
import {
  School,
  Work,
  Engineering,
  Computer,
  Build,
  TwoWheeler,
  MenuBook,
  EmojiEvents,
  Transform
} from '@mui/icons-material';
import PageLayout from '../../layouts/pagelayout';

// Rest of your component stays the same...

export default function Education() {
  const educationMilestones = [
    {
      year: '1992-1993',
      institution: 'Barstow College',
      degree: 'AS in Mathematics',
      honor: 'Summa Cum Laude',
      icon: <School color="primary" />
    },
    {
      year: '1998',
      institution: 'Case Western Reserve University',
      degree: 'BS in Computer Engineering',
      honor: 'Magna Cum Laude',
      icon: <Engineering color="primary" />
    },
    {
      year: '1999',
      institution: 'Case Western Reserve University',
      degree: 'MS in Computer Engineering',
      honor: 'Cum Laude',
      icon: <Computer color="primary" />
    }
  ];

  const careerHighlights = [
    'Shipyard helper to skilled welder and fabricator',
    'Motorcycle mechanic and engine rebuilder',
    'College student while incarcerated',
    '17 years as Software Engineer at Microsoft',
    'Multiple degrees earned through determination'
  ];

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Hero Section */}
        <Paper variant='gradient' elevation={6} sx={{ p: 4, mb: 4}}>
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            A Lifelong Journey of Learning
          </Typography>
          <Typography variant="h5" align="center" sx={{ opacity: 0.9, mb: 3 }}>
            From Adversity to Achievement: My Educational Transformation
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Transform />} label="Transformation" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<School />} label="Education" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip icon={<EmojiEvents />} label="Achievement" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
        </Paper>

        {/* Introduction */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook /> My Learning Addiction
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            I've always been addicted to learning, and my entire life reflects this. Unfortunately, at times I was learning all the wrong stuff. 
            After dropping out of the University of Pittsburgh in the early 70's due to legal issues, I migrated to Florida where I was hired 
            as a helper in a shipyard. I would get my work done as fast as possible so I could spend time learning to weld and fabricate steel. 
            I love building stuff.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            From the shipyards in Florida to another shipyard in Ohio, I continued to learn several trades. Eventually migrating to California 
            and taking my welding skills to a machine shop. I was also fascinated with Harleys, and it wasn't long until I was working at a 
            private motorcycle shop and learning to rebuild engines.
          </Typography>
        </Paper>

        {/* The Turning Point */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Transform /> The Turning Point
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            On the downside, that lifestyle provided opportunities to get involved with drugs and motorcycle gangs. In 1981, while drinking 
            heavily, I lost my left leg in a motorcycle accident. In 1991, I lost my freedom for trafficking drugs.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            While in federal prison, I began to take college courses. Dr. Zaddock Reid was doing time for a slight mistake on his taxes. 
            He held a PhD in mathematics, and he loved to teach. I loved to learn, and the rest is history.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            I could fill a book with the crazy stuff I did to get into and graduate college. I was sneaking out of a halfway house to attend 
            CWRU in Cleveland and got caught. I interviewed to go to their college while on a furlough from prison. I graduated three times 
            and then spent seventeen years working as a software engineer at Microsoft.
          </Typography>
        </Paper>

        {/* Educational Achievements */}
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          <EmojiEvents sx={{ mr: 1 }} /> Educational Achievements
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {educationMilestones.map((milestone, index) => (
            <Grid size={{xs: 12, md: 4}} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'translateY(-4px)' } 
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {milestone.icon}
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {milestone.year}
                  </Typography>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', minHeight: '3rem' }}>
                    {milestone.institution}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {milestone.degree}
                  </Typography>
                  <Chip 
                    label={milestone.honor} 
                    color="success" 
                    variant="outlined" 
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Career Highlights */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Work /> Career Evolution
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 4}}>
              <Typography variant="h6" gutterBottom>From Manual Labor to Technology</Typography>
              <List>
                {careerHighlights.map((highlight, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Build fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={highlight} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Typography variant="h6" gutterBottom>The Microsoft Years</Typography>
              <Typography variant="body1" paragraph>
                After completing my education, I spent seventeen years as a software engineer at Microsoft. This represented the culmination 
                of an incredible journey from someone who had lost everything to becoming a successful professional in the technology industry.
              </Typography>
              <Typography variant="body1" paragraph>
                The skills I learned working with my hands in shipyards and machine shops, combined with the analytical thinking developed 
                through my mathematics and engineering education, made me uniquely suited for solving complex software problems.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Lessons Learned */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Lessons from the Journey
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><School color="primary" /></ListItemIcon>
              <ListItemText 
                primary="It's never too late to learn" 
                secondary="Education can transform your life at any age and in any circumstance."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Transform color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Adversity can be a teacher" 
                secondary="Sometimes our biggest mistakes become our greatest motivators for change."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><MenuBook color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Passion for learning is powerful" 
                secondary="When you truly love to learn, you'll find a way to overcome any obstacle."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><EmojiEvents color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Every skill has value" 
                secondary="Manual labor, academic study, and life experience all contribute to who you become."
              />
            </ListItem>
          </List>
        </Paper>

        {/* Closing Thoughts */}
        <Paper 
          elevation={6} 
          variant='gradient'
          sx={{ 
            p: 4,  
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            The Learning Never Stops
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            My educational journey taught me that learning is not just about degrees or credentials – it's about transformation, 
            growth, and the endless pursuit of becoming better than you were yesterday. Whether in a shipyard, a prison classroom, 
            or a corporate office, every experience is an opportunity to learn something new.
          </Typography>
          <Typography variant="body1" align="center" sx={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
            Education is the key that can unlock any door, no matter how many times life has locked you out.
          </Typography>
        </Paper>
      </Box>
    </PageLayout>
  );
}