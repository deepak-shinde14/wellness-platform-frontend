// frontend/src/pages/ContentPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchContent } from '../api/wellnessApi';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  Person,
  Category,
} from '@mui/icons-material';

const ContentPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchContent();
        setArticles(res.data || res);
      } catch (err) {
        console.error(err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Nutrition & Wellness Articles
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {articles.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No articles available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {articles.map((article) => (
            <Grid item xs={12} md={6} key={article.id}>
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
                {article.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                  />
                )}
                <CardHeader
                  title={
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {article.title}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {article.author || 'Admin'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {article.read_time || '5 min read'}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph sx={{ fontWeight: 'medium' }}>
                    {article.summary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.body}
                  </Typography>
                  
                  {article.category && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={article.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={<Category fontSize="small" />}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ContentPage;