// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link as MuiLink,
    IconButton,
    Stack,
    Divider,
} from '@mui/material';
import {
    FitnessCenter,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn,
} from '@mui/icons-material';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Platform: [
            { label: 'Home', path: '/' },
            { label: 'Articles', path: '/content' },
            { label: 'Consultations', path: '/consultations' },
        ],
        Resources: [
            { label: 'Nutrition Guide', path: '/content?category=nutrition' },
            { label: 'Fitness Tips', path: '/content?category=fitness' },
            { label: 'Mental Wellness', path: '/content?category=mindfulness' },
        ],
        Company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms of Service', path: '/terms' },
        ],
        Support: [
            { label: 'Help Center', path: '/help' },
            { label: 'FAQ', path: '/faq' },
            { label: 'Community Forum', path: '/forum' },
        ],
    };

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primary.dark',
                color: 'white',
                py: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FitnessCenter sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" fontWeight="bold">
                                WellnessHub
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                            Your journey to better health starts here. Join thousands of users
                            transforming their lives through our wellness platform.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton color="inherit" size="small">
                                <Facebook fontSize="small" />
                            </IconButton>
                            <IconButton color="inherit" size="small">
                                <Twitter fontSize="small" />
                            </IconButton>
                            <IconButton color="inherit" size="small">
                                <Instagram fontSize="small" />
                            </IconButton>
                            <IconButton color="inherit" size="small">
                                <LinkedIn fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Grid item xs={6} sm={3} key={category}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                {category}
                            </Typography>
                            <Stack spacing={1}>
                                {links.map((link) => (
                                    <MuiLink
                                        key={link.label}
                                        component={Link}
                                        to={link.path}
                                        color="inherit"
                                        variant="body2"
                                        sx={{
                                            opacity: 0.8,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                opacity: 1,
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </MuiLink>
                                ))}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email fontSize="small" />
                                <Typography variant="body2">
                                    support@wellnesshub.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone fontSize="small" />
                                <Typography variant="body2">
                                    +1 (555) 123-4567
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn fontSize="small" />
                                <Typography variant="body2">
                                    123 Wellness St, Health City
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ textAlign: { md: 'right' }, opacity: 0.8 }}>
                            © {currentYear} WellnessHub. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;