import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  CalendarToday,
  Restaurant,
  FitnessCenter,
  Psychology,
  WaterDrop,
  Bedtime,
  MoreVert,
  ArrowForward,
  CheckCircle,
  AccessTime,
  Assignment,
  Bookmark,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { user, goals, content, consultations } from '../api';
import { Article as ArticleIcon } from '@mui/icons-material';

const Dashboard = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, goalsRes, contentRes, consultationsRes] = await Promise.all([
        user.getDashboard(),
        goals.getStatistics(),
        content.getFeatured(),
        consultations.getAll({ limit: 3 }),
      ]);

      setDashboardData({
        ...dashboardRes.data.data.dashboard,
        statistics: goalsRes.data.data.statistics,
        featuredContent: contentRes.data.data.featured,
        recentContent: contentRes.data.data.popular,
        consultations: consultationsRes.data.data.consultations,
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'nutrition':
        return <Restaurant />;
      case 'exercise':
        return <FitnessCenter />;
      case 'mindfulness':
        return <Psychology />;
      case 'hydration':
        return <WaterDrop />;
      case 'sleep':
        return <Bedtime />;
      default:
        return <Assignment />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'nutrition':
        return 'success';
      case 'exercise':
        return 'primary';
      case 'mindfulness':
        return 'secondary';
      case 'hydration':
        return 'info';
      case 'sleep':
        return 'warning';
      default:
        return 'default';
    }
  };

  const progressChartData = [
    { name: 'Jan', progress: 45 },
    { name: 'Feb', progress: 52 },
    { name: 'Mar', progress: 61 },
    { name: 'Apr', progress: 68 },
    { name: 'May', progress: 74 },
    { name: 'Jun', progress: 82 },
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
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {currentUser?.username || 'Wellness Warrior'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {dashboardData?.statistics?.activeGoals > 0
            ? `You have ${dashboardData.statistics.activeGoals} active goals. Keep up the great work!`
            : 'Start your wellness journey by setting your first goal!'}
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
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom>
              {dashboardData?.statistics?.totalGoals || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Goals
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" gutterBottom>
              {dashboardData?.statistics?.completedGoals || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Goals
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary.main" gutterBottom>
              {dashboardData?.consultations?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming Consultations
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" gutterBottom>
              {dashboardData?.statistics?.averageProgress || 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Progress
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Goals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Active Goals"
              action={
                <Button
                  component={RouterLink}
                  to="/goals"
                  endIcon={<ArrowForward />}
                  size="small"
                >
                  View All
                </Button>
              }
            />
            <CardContent>
              {dashboardData?.goals?.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary" gutterBottom>
                    No active goals
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/goals/new"
                    variant="contained"
                  >
                    Set Your First Goal
                  </Button>
                </Box>
              ) : (
                <List>
                  {dashboardData?.goals?.slice(0, 3).map((goal) => (
                    <ListItem
                      key={goal.id}
                      secondaryAction={
                        <IconButton edge="end">
                          <MoreVert />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${getCategoryColor(goal.category)}.light` }}>
                          {getCategoryIcon(goal.category)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {goal.title || 'Untitled Goal'}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={goal.progress || 0}
                              sx={{ height: 6, borderRadius: 3, mb: 1 }}
                            />
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                {goal.progress || 0}% Complete
                              </Typography>
                              {goal.target_date && (
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(goal.target_date).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Progress Trend"
              subheader="Last 6 months"
              avatar={<TrendingUp color="primary" />}
            />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Progress']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Consultations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Upcoming Consultations"
              action={
                <Button
                  component={RouterLink}
                  to="/consultations"
                  endIcon={<ArrowForward />}
                  size="small"
                >
                  View All
                </Button>
              }
            />
            <CardContent>
              {dashboardData?.consultations?.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary" gutterBottom>
                    No upcoming consultations
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/consultations/new"
                    variant="contained"
                  >
                    Book a Consultation
                  </Button>
                </Box>
              ) : (
                <List>
                  {dashboardData?.consultations?.map((consult) => (
                    <ListItem
                      key={consult.id}
                      secondaryAction={
                        <Chip
                          label={consult.status || 'pending'}
                          size="small"
                          color={
                            consult.status === 'confirmed'
                              ? 'success'
                              : consult.status === 'pending'
                                ? 'warning'
                                : 'default'
                          }
                          variant="outlined"
                        />
                      }
                    >
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={consult.consultation_type?.replace('_', ' ') || 'General Consultation'}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {new Date(consult.preferred_date || Date.now()).toLocaleDateString()} •{' '}
                              {consult.preferred_time || 'Anytime'}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {consult.notes?.slice(0, 50) || 'No notes provided'}...
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Featured Content */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recommended Reads"
              avatar={<Bookmark color="primary" />}
              action={
                <Button
                  component={RouterLink}
                  to="/content"
                  endIcon={<ArrowForward />}
                  size="small"
                >
                  Explore More
                </Button>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                {dashboardData?.featuredContent?.slice(0, 3).map((article) => (
                  <Paper
                    key={article.id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    component={RouterLink}
                    to={`/content/${article.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      }}
                    >
                      <ArticleIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {article.title || 'Untitled Article'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {article.read_time || '5'} min read
                        </Typography>
                        <Chip
                          label={article.category || 'General'}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={RouterLink}
                    to="/goals/new"
                    startIcon={<Assignment />}
                    sx={{ py: 2 }}
                  >
                    New Goal
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={RouterLink}
                    to="/consultations/new"
                    startIcon={<CalendarToday />}
                    sx={{ py: 2 }}
                  >
                    Book Consultation
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={RouterLink}
                    to="/content"
                    startIcon={<Restaurant />}
                    sx={{ py: 2 }}
                  >
                    Read Articles
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={RouterLink}
                    to="/profile"
                    startIcon={<Psychology />}
                    sx={{ py: 2 }}
                  >
                    View Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;