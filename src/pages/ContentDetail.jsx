// frontend/src/pages/ContentDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Card,
    CardContent,
    CardMedia,
    Grid,
} from '@mui/material';
import {
    ArrowBack,
    Bookmark,
    BookmarkBorder,
    AccessTime,
    Person,
    Category,
    Share,
    Print,
    Facebook,
    Twitter,
    LinkedIn,
    Email,
} from '@mui/icons-material';
import API from '../api/axiosInstance';

const ContentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [content, setContent] = useState(null);
    const [relatedContent, setRelatedContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        fetchContent();
    }, [id]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/content/${id}`);
            if (response.data.success) {
                setContent(response.data.data.content);
                setRelatedContent(response.data.data.related || []);
                setIsBookmarked(response.data.data.isBookmarked || false);
            }
        } catch (err) {
            console.error('Fetch content error:', err);
            setError('Failed to load content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isBookmarked) {
                await API.delete(`/content/${id}/bookmark`);
            } else {
                await API.post(`/content/${id}/bookmark`);
            }
            setIsBookmarked(!isBookmarked);
        } catch (err) {
            console.error('Bookmark error:', err);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: content?.title,
                text: content?.excerpt,
                url: window.location.href,
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !content) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Content not found'}
                </Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/content')}>
                    Back to Articles
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Back button and actions */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/content')}
                    sx={{ mb: 2 }}
                >
                    Back to Articles
                </Button>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Chip
                            label={content.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            icon={<Category fontSize="small" />}
                            sx={{ mr: 1 }}
                        />
                        <Chip
                            label={content.content_type}
                            size="small"
                            sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                        />
                    </Box>
                    
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={handleBookmark} color={isBookmarked ? 'primary' : 'default'}>
                            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                        <IconButton onClick={handleShare}>
                            <Share />
                        </IconButton>
                        <IconButton onClick={() => window.print()}>
                            <Print />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>

            {/* Main content */}
            <Paper sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    {content.title}
                </Typography>

                {/* Meta info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {content.author || 'Wellness Team'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {content.read_time || '5'} min read
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(content.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {content.view_count} views
                    </Typography>
                </Box>

                {/* Featured image */}
                {content.thumbnail_url && (
                    <CardMedia
                        component="img"
                        image={content.thumbnail_url}
                        alt={content.title}
                        sx={{
                            width: '100%',
                            maxHeight: 400,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mb: 4,
                        }}
                    />
                )}

                {/* Excerpt */}
                {content.excerpt && (
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            bgcolor: 'primary.50',
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Key Takeaways
                        </Typography>
                        <Typography variant="body1">
                            {content.excerpt}
                        </Typography>
                    </Paper>
                )}

                {/* Main content */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {content.content}
                    </Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Share section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Share this article
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            startIcon={<Facebook />}
                            variant="outlined"
                            size="small"
                            onClick={() => window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                                '_blank'
                            )}
                        >
                            Facebook
                        </Button>
                        <Button
                            startIcon={<Twitter />}
                            variant="outlined"
                            size="small"
                            onClick={() => window.open(
                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(content.title)}`,
                                '_blank'
                            )}
                        >
                            Twitter
                        </Button>
                        <Button
                            startIcon={<LinkedIn />}
                            variant="outlined"
                            size="small"
                            onClick={() => window.open(
                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                                '_blank'
                            )}
                        >
                            LinkedIn
                        </Button>
                        <Button
                            startIcon={<Email />}
                            variant="outlined"
                            size="small"
                            onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(`${content.excerpt}\n\nRead more: ${window.location.href}`)}`}
                        >
                            Email
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Related content */}
            {relatedContent.length > 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Related Articles
                    </Typography>
                    <Grid container spacing={3}>
                        {relatedContent.slice(0, 3).map((item) => (
                            <Grid item xs={12} md={4} key={item.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => navigate(`/content/${item.id}`)}
                                >
                                    {item.thumbnail_url && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={item.thumbnail_url}
                                            alt={item.title}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {item.excerpt?.slice(0, 100)}...
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                                            <AccessTime fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {item.read_time} min read
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default ContentDetail;