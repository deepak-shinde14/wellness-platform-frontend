// frontend/src/pages/ContentPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress,
  Alert,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  Bookmark,
  BookmarkBorder,
  AccessTime,
  Person,
  Category,
  TrendingUp,
  Sort,
  GridView,
  ViewList,
} from '@mui/icons-material';
import { content } from '../api';

const ContentPage = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState(new Set());

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [view, setView] = useState('grid');

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchContent();
    fetchBookmarks();
  }, [searchParams]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams);
      const response = await content.getAll(params);

      if (response.data.success) {
        setContentList(response.data.data.content);
        setCategories(response.data.data.filters.categories);
        setTypes(response.data.data.filters.types);
        setTotalPages(response.data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Fetch content error:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const response = await content.getBookmarks();
      if (response.data.success) {
        const bookmarkIds = response.data.data.bookmarks.map(b => b.id);
        setBookmarks(new Set(bookmarkIds));
      }
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchParams({ search, page: 1 });
  };

  const handleFilterChange = (filter, value) => {
    updateSearchParams({ [filter]: value, page: 1 });
  };

  const handlePageChange = (event, value) => {
    updateSearchParams({ page: value });
  };

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const handleBookmark = async (contentId, isBookmarked) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        await content.removeBookmark(contentId);
        setBookmarks(prev => {
          const newSet = new Set(prev);
          newSet.delete(contentId);
          return newSet;
        });
      } else {
        await content.bookmark(contentId);
        setBookmarks(prev => new Set(prev).add(contentId));
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return '📝';
      case 'video':
        return '🎬';
      case 'recipe':
        return '🍳';
      case 'workout':
        return '💪';
      case 'tip':
        return '💡';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Wellness Content
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover articles, recipes, workouts, and tips for your wellness journey
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Stack spacing={3}>
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              placeholder="Search articles, recipes, tips..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="contained">
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </form>

          {/* Filters */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  startAdornment={<FilterList fontSize="small" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {types.map((type) => (
                    <MenuItem key={type} value={type}>
                      {getContentTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sort}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  startAdornment={<Sort fontSize="small" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="created_at">Newest</MenuItem>
                  <MenuItem value="view_count">Most Viewed</MenuItem>
                  <MenuItem value="read_time">Reading Time</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <ToggleButtonGroup
                value={order}
                exclusive
                onChange={(e, newOrder) => handleFilterChange('order', newOrder)}
                size="small"
                fullWidth
              >
                <ToggleButton value="desc">
                  <TrendingUp sx={{ mr: 1 }} />
                  Descending
                </ToggleButton>
                <ToggleButton value="asc">
                  Ascending
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {/* View Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {contentList.length} items found
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => setView(newView)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridView />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content Grid/List */}
      {contentList.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Try adjusting your filters or search term
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearch('');
              setCategory('');
              setType('');
              updateSearchParams({});
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {contentList.map((item) => {
              const isBookmarked = bookmarks.has(item.id);

              return (
                <Grid item xs={12} sm={view === 'grid' ? 6 : 12} md={view === 'grid' ? 4 : 12} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: view === 'list' ? 'row' : 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {item.thumbnail_url && view === 'grid' && (
                      <CardMedia
                        component="img"
                        height="160"
                        image={item.thumbnail_url}
                        alt={item.title}
                      />
                    )}
                    {item.thumbnail_url && view === 'list' && (
                      <CardMedia
                        component="img"
                        sx={{ width: 200 }}
                        image={item.thumbnail_url}
                        alt={item.title}
                      />
                    )}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip
                            icon={<Category fontSize="small" />}
                            label={item.category}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={item.content_type}
                            size="small"
                            sx={{
                              bgcolor: 'primary.50',
                              color: 'primary.main',
                            }}
                          />
                        </Box>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.excerpt}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {item.author || 'Wellness Team'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {item.read_time || '5'} min read
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {item.view_count} views
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          onClick={() => navigate(`/content/${item.id}`)}
                        >
                          Read More
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleBookmark(item.id, isBookmarked)}
                          color={isBookmarked ? 'primary' : 'default'}
                        >
                          {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ContentPage;