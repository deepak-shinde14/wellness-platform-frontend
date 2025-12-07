import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
} from '@mui/material';
import {
    People,
    Article,
    CalendarToday,
    TrendingUp,
    ArrowForward,
    PersonAdd,
    NewReleases,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../api/axiosInstance';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [recentSignups, setRecentSignups] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await API.get('/admin/stats');
            if (response.data.success) {
                setStats(response.data.data.statistics);
                setRecentSignups(response.data.data.recentSignups || []);
            }
        } catch (err) {
            console.error('Fetch admin stats error:', err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const userGrowthData = [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 150 },
        { month: 'Mar', users: 180 },
        { month: 'Apr', users: 210 },
        { month: 'May', users: 250 },
        { month: 'Jun', users: 300 },
    ];

    const contentPerformanceData = [
        { name: 'Nutrition', views: 1200 },
        { name: 'Fitness', views: 800 },
        { name: 'Mindfulness', views: 600 },
        { name: 'Recipes', views: 900 },
        { name: 'Tips', views: 700 },
    ];

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
                    Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Welcome back, {user?.username || 'Admin'}. Here's what's happening with your platform.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Users
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats?.users?.total_users || 0}
                                    </Typography>
                                </Box>
                                <People sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Active Goals
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats?.goals?.total_goals || 0}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Consultations
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats?.consultations?.total_consultations || 0}
                                    </Typography>
                                </Box>
                                <CalendarToday sx={{ fontSize: 40, color: 'secondary.main' }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Content Items
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats?.content?.total_content || 0}
                                    </Typography>
                                </Box>
                                <Article sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            User Growth
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            Content Performance
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={contentPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Signups */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Recent Signups
                            </Typography>
                            <Button
                                endIcon={<ArrowForward />}
                                size="small"
                                href="/admin/users"
                            >
                                View All Users
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Joined</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentSignups.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <NewReleases sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                                <Typography color="text.secondary">
                                                    No recent signups
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentSignups.map((userItem) => (
                                            <TableRow key={userItem.id}>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <People fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            {userItem.username || 'Unknown User'}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {userItem.email || 'No email'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={userItem.is_admin ? 'Admin' : 'User'}
                                                        size="small"
                                                        color={userItem.is_admin ? 'primary' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(userItem.created_at || Date.now()).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd />}
                                fullWidth
                                href="/admin/users"
                            >
                                Manage Users
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Article />}
                                fullWidth
                                href="/admin/content"
                            >
                                Manage Content
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarToday />}
                                fullWidth
                                href="/admin/consultations"
                            >
                                View Consultations
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<TrendingUp />}
                                fullWidth
                                onClick={fetchDashboardData}
                            >
                                Refresh Data
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;