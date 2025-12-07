// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Paper,
  Stack,
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  Psychology,
  CalendarToday,
  Article,
} from '@mui/icons-material';

const HomePage = () => {
  const features = [
    {
      icon: <Restaurant fontSize="large" color="primary" />,
      title: 'Nutrition Guidance',
      description: 'Expert advice on healthy eating habits and meal planning.',
      link: '/content',
      linkText: 'Read Articles',
    },
    {
      icon: <FitnessCenter fontSize="large" color="primary" />,
      title: 'Fitness Tracking',
      description: 'Set and track your fitness goals with personalized plans.',
      link: '/dashboard',
      linkText: 'View Goals',
    },
    {
      icon: <Psychology fontSize="large" color="primary" />,
      title: 'Mental Wellness',
      description: 'Resources for stress management and mental health.',
      link: '/content',
      linkText: 'Explore',
    },
    {
      icon: <CalendarToday fontSize="large" color="primary" />,
      title: 'Professional Consultations',
      description: 'Book sessions with certified wellness experts.',
      link: '/signup',
      linkText: 'Book Now',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.main',
          color: '#fff',
          mb: 4,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: { xs: 3, md: 6 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'white' }}
          >
            New Year Wellness
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: 'white', maxWidth: 800, mx: 'auto' }}>
            Resolve to be healthier this year. Explore nutrition tips, book consultations, 
            and track your goals with our comprehensive wellness platform.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              component={Link}
              to="/content"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              startIcon={<Article />}
            >
              Read Nutrition Articles
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              startIcon={<CalendarToday />}
            >
              Book a Consultation
            </Button>
          </Stack>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Your Complete Wellness Journey
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    component={Link}
                    to={feature.link}
                    size="small"
                    color="primary"
                  >
                    {feature.linkText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper sx={{ p: 4, bgcolor: 'primary.light' }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" gutterBottom color="white">
            Start Your Wellness Journey Today
          </Typography>
          <Typography align="center" paragraph color="white">
            Join thousands of others who have transformed their health with our platform.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            >
              Sign Up Free
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Existing User? Login
            </Button>
          </Stack>
        </Container>
      </Paper>
    </Box>
  );
};

export default HomePage;