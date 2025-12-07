import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Chip,
    LinearProgress,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Fab,
    Divider,
} from '@mui/material';
import {
    Add,
    MoreVert,
    Edit,
    Delete,
    TrendingUp,
    CheckCircle,
    PauseCircle,
    Flag,
    CalendarToday,
    FilterList,
    Sort,
} from '@mui/icons-material';
import { goals } from '../api';

const GoalsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [goalsList, setGoalsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statistics, setStatistics] = useState(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('desc');

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    // New goal form
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: 'nutrition',
        target_value: '',
        unit: '',
        target_date: '',
    });

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null);

    useEffect(() => {
        fetchGoals();
    }, [statusFilter, categoryFilter, sortBy, sortOrder]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const params = {
                status: statusFilter !== 'all' ? statusFilter : undefined,
                category: categoryFilter !== 'all' ? categoryFilter : undefined,
                sort: sortBy,
                order: sortOrder,
            };

            const [goalsRes, statsRes] = await Promise.all([
                goals.getAll(params),
                goals.getStatistics(),
            ]);

            if (goalsRes.data.success) {
                setGoalsList(goalsRes.data.data.goals);
                setStatistics(goalsRes.data.data.statistics);
            }

            if (statsRes.data.success) {
                setStatistics(statsRes.data.data.statistics);
            }
        } catch (error) {
            console.error('Fetch goals error:', error);
            setError('Failed to load goals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, goal) => {
        setAnchorEl(event.currentTarget);
        setSelectedGoal(goal);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedGoal(null);
    };

    const handleEdit = () => {
        if (selectedGoal) {
            navigate(`/goals/${selectedGoal.id}/edit`);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setGoalToDelete(selectedGoal);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!goalToDelete) return;

        try {
            await goals.delete(goalToDelete.id);
            await fetchGoals();
            setDeleteDialogOpen(false);
            setGoalToDelete(null);
        } catch (error) {
            console.error('Delete goal error:', error);
            setError('Failed to delete goal. Please try again.');
        }
    };

    const handleCreateGoal = async () => {
        try {
            const goalData = {
                ...newGoal,
                target_value: newGoal.target_value ? parseFloat(newGoal.target_value) : null,
            };

            await goals.create(goalData);
            await fetchGoals();
            setCreateDialogOpen(false);
            setNewGoal({
                title: '',
                description: '',
                category: 'nutrition',
                target_value: '',
                unit: '',
                target_date: '',
            });
        } catch (error) {
            console.error('Create goal error:', error);
            setError('Failed to create goal. Please check your input.');
        }
    };

    const handleUpdateProgress = async (goalId, progress) => {
        try {
            await goals.updateProgress(goalId, { current_value: progress });
            await fetchGoals();
        } catch (error) {
            console.error('Update progress error:', error);
            setError('Failed to update progress. Please try again.');
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

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    My Wellness Goals
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Track your progress and achieve your health objectives
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Statistics */}
            {statistics && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        {statistics.totalGoals || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Goals
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h3" color="success.main" gutterBottom>
                                        {statistics.completedGoals || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Completed
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h3" color="info.main" gutterBottom>
                                        {statistics.activeGoals || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box textAlign="center">
                                    <Typography variant="h3" color="warning.main" gutterBottom>
                                        {statistics.averageProgress || 0}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Average Progress
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card sx={{ mb: 4, p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                startAdornment={<FilterList fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="abandoned">Abandoned</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                <MenuItem value="weight">Weight</MenuItem>
                                <MenuItem value="nutrition">Nutrition</MenuItem>
                                <MenuItem value="exercise">Exercise</MenuItem>
                                <MenuItem value="mindfulness">Mindfulness</MenuItem>
                                <MenuItem value="hydration">Hydration</MenuItem>
                                <MenuItem value="sleep">Sleep</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                startAdornment={<Sort fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="updated_at">Recently Updated</MenuItem>
                                <MenuItem value="created_at">Date Created</MenuItem>
                                <MenuItem value="target_date">Due Date</MenuItem>
                                <MenuItem value="progress">Progress</MenuItem>
                                <MenuItem value="title">Title</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <ToggleButtonGroup
                            value={sortOrder}
                            exclusive
                            onChange={(e, value) => setSortOrder(value)}
                            size="small"
                            fullWidth
                        >
                            <ToggleButton value="desc">
                                <TrendingUp sx={{ mr: 1 }} />
                                Desc
                            </ToggleButton>
                            <ToggleButton value="asc">Asc</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Card>

            {/* Goals Grid */}
            {goalsList.length === 0 ? (
                <Card sx={{ py: 8, textAlign: 'center' }}>
                    <Flag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No goals found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {statusFilter !== 'all' || categoryFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Start by creating your first wellness goal'}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Create Your First Goal
                    </Button>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {goalsList.map((goal) => (
                        <Grid item xs={12} md={6} lg={4} key={goal.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Chip
                                                label={goal.category || 'Uncategorized'}
                                                size="small"
                                                color={getCategoryColor(goal.category)}
                                                variant="outlined"
                                                sx={{ mb: 1 }}
                                            />
                                            <Chip
                                                label={goal.status || 'active'}
                                                size="small"
                                                color={getStatusColor(goal.status)}
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, goal)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {goal.title || 'Untitled Goal'}
                                    </Typography>

                                    {goal.description && (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {goal.description}
                                        </Typography>
                                    )}

                                    {goal.target_value && (
                                        <Box sx={{ mt: 3, mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">
                                                    Progress: {goal.progress || 0}%
                                                </Typography>
                                                <Typography variant="body2">
                                                    {(goal.current_value || 0)} / {goal.target_value} {goal.unit || ''}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={goal.progress || 0}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </Box>
                                    )}

                                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                        {goal.target_date && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarToday fontSize="small" color="action" />
                                                <Typography variant="caption" color="text.secondary">
                                                    Due: {new Date(goal.target_date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            Updated: {new Date(goal.updated_at || Date.now()).toLocaleDateString()}
                                        </Typography>
                                    </Stack>
                                </CardContent>

                                <Divider />

                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/goals/${goal.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    {goal.status === 'active' && goal.target_value && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                const newProgress = prompt(
                                                    `Update progress for "${goal.title || 'this goal'}" (Current: ${goal.current_value || 0}${goal.unit || ''})`,
                                                    goal.current_value || 0
                                                );
                                                if (newProgress !== null) {
                                                    handleUpdateProgress(goal.id, parseFloat(newProgress));
                                                }
                                            }}
                                        >
                                            Update Progress
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                }}
                onClick={() => setCreateDialogOpen(true)}
            >
                <Add />
            </Fab>

            {/* Create Goal Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Goal Title"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={newGoal.category}
                                label="Category"
                                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                            >
                                <MenuItem value="weight">Weight</MenuItem>
                                <MenuItem value="nutrition">Nutrition</MenuItem>
                                <MenuItem value="exercise">Exercise</MenuItem>
                                <MenuItem value="mindfulness">Mindfulness</MenuItem>
                                <MenuItem value="hydration">Hydration</MenuItem>
                                <MenuItem value="sleep">Sleep</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Target Value"
                                    type="number"
                                    value={newGoal.target_value}
                                    onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Unit (kg, liters, days, etc.)"
                                    value={newGoal.unit}
                                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Target Date"
                            type="date"
                            value={newGoal.target_date}
                            onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateGoal}
                        disabled={!newGoal.title}
                    >
                        Create Goal
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
                        Are you sure you want to delete "{goalToDelete?.title || 'this goal'}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Goal Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <Edit fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default GoalsPage;