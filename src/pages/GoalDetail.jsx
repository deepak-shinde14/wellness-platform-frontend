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
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Card,
    CardContent,
    LinearProgress,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Delete,
    CalendarToday,
    TrendingUp,
    Flag,
    CheckCircle,
    AccessTime,
    Add,
    MoreVert,
} from '@mui/icons-material';
import API from '../api/axiosInstance';

const GoalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [goal, setGoal] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newProgress, setNewProgress] = useState('');

    useEffect(() => {
        fetchGoal();
    }, [id]);

    const fetchGoal = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/goals/${id}`);
            if (response.data.success) {
                setGoal(response.data.data.goal);
                setActivities(response.data.data.activities || []);
            }
        } catch (err) {
            console.error('Fetch goal error:', err);
            setError('Failed to load goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProgress = async () => {
        if (!newProgress || isNaN(newProgress)) {
            return;
        }

        try {
            await API.put(`/goals/${id}/progress`, {
                current_value: parseFloat(newProgress),
            });
            await fetchGoal();
            setProgressDialogOpen(false);
            setNewProgress('');
        } catch (err) {
            console.error('Update progress error:', err);
            setError('Failed to update progress. Please try again.');
        }
    };

    const handleDeleteGoal = async () => {
        try {
            await API.delete(`/goals/${id}`);
            navigate('/goals');
        } catch (err) {
            console.error('Delete goal error:', err);
            setError('Failed to delete goal. Please try again.');
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'weight':
                return 'error';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'primary';
            case 'abandoned':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !goal) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Goal not found'}
                </Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/goals')}>
                    Back to Goals
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/goals')}
                    sx={{ mb: 2 }}
                >
                    Back to Goals
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                                label={goal.category || 'Uncategorized'}
                                size="small"
                                color={getCategoryColor(goal.category)}
                                variant="outlined"
                            />
                            <Chip
                                label={goal.status || 'active'}
                                size="small"
                                color={getStatusColor(goal.status)}
                                icon={<Flag fontSize="small" />}
                            />
                        </Stack>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {goal.title || 'Untitled Goal'}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            startIcon={<Edit />}
                            variant="outlined"
                            onClick={() => navigate(`/goals/${id}/edit`)}
                        >
                            Edit
                        </Button>
                        <Button
                            startIcon={<Delete />}
                            variant="outlined"
                            color="error"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left column - Goal details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, mb: 4 }}>
                        {/* Description */}
                        {goal.description && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Description
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {goal.description}
                                </Typography>
                            </Box>
                        )}

                        {/* Progress section */}
                        {goal.target_value && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Progress
                                    </Typography>
                                    <Chip
                                        label={`${goal.progress || 0}% Complete`}
                                        color="primary"
                                        icon={<TrendingUp />}
                                    />
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={goal.progress || 0}
                                    sx={{ height: 12, borderRadius: 6, mb: 2 }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Current: {goal.current_value || 0} {goal.unit || ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Target: {goal.target_value || 0} {goal.unit || ''}
                                    </Typography>
                                </Box>

                                {goal.status === 'active' && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setProgressDialogOpen(true)}
                                        fullWidth
                                    >
                                        Update Progress
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Goal info */}
                        <Grid container spacing={3}>
                            {goal.target_date && (
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarToday color="action" />
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Target Date
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6">
                                                {new Date(goal.target_date).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccessTime color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Created
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1">
                                            {new Date(goal.created_at || Date.now()).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Recent Activities */}
                    {activities.length > 0 && (
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                Recent Activities
                            </Typography>
                            <List>
                                {activities.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemIcon>
                                                {activity.activity_type === 'goal_created' ? (
                                                    <Flag color="primary" />
                                                ) : activity.activity_type === 'progress_update' ? (
                                                    <TrendingUp color="success" />
                                                ) : (
                                                    <CheckCircle color="action" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                        {activity.activity_type === 'goal_created'
                                                            ? 'Goal Created'
                                                            : activity.activity_type === 'progress_update'
                                                            ? 'Progress Updated'
                                                            : 'Goal Updated'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span">
                                                            {activity.notes || 'No description provided'}
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(activity.recorded_at || Date.now()).toLocaleString()}
                                                            {activity.value && ` • Value: ${activity.value} ${goal.unit || ''}`}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Grid>

                {/* Right column - Stats and actions */}
                <Grid item xs={12} md={4}>
                    {/* Quick Stats */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Goal Statistics
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Days Active
                                </Typography>
                                <Typography variant="h5">
                                    {Math.ceil((new Date() - new Date(goal.created_at || Date.now())) / (1000 * 60 * 60 * 24))} days
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Progress Rate
                                </Typography>
                                <Typography variant="h5">
                                    {goal.target_date
                                        ? `${Math.round((goal.progress || 0) / Math.max((new Date(goal.target_date) - new Date(goal.created_at || Date.now())) / (1000 * 60 * 60 * 24), 1))}%/day`
                                        : 'N/A'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Activity Count
                                </Typography>
                                <Typography variant="h5">
                                    {activities.length} updates
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Quick Actions */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                            {goal.status === 'active' && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => setProgressDialogOpen(true)}
                                >
                                    Log Progress
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate(`/goals/${id}/edit`)}
                            >
                                Edit Goal
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={() => navigate('/goals')}
                            >
                                View All Goals
                            </Button>
                            {goal.status === 'active' && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    fullWidth
                                    onClick={async () => {
                                        try {
                                            await API.put(`/goals/${id}`, { status: 'completed' });
                                            await fetchGoal();
                                        } catch (err) {
                                            console.error('Complete goal error:', err);
                                        }
                                    }}
                                >
                                    Mark as Complete
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Update Progress Dialog */}
            <Dialog
                open={progressDialogOpen}
                onClose={() => setProgressDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Update Progress</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Update your progress for "{goal.title || 'this goal'}"
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={`Current Value (${goal.unit || ''})`}
                        type="number"
                        fullWidth
                        value={newProgress}
                        onChange={(e) => setNewProgress(e.target.value)}
                        placeholder={goal.current_value?.toString() || '0'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProgressDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateProgress}
                        disabled={!newProgress || isNaN(newProgress)}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Goal</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{goal.title || 'this goal'}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteGoal}
                    >
                        Delete Goal
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default GoalDetail;