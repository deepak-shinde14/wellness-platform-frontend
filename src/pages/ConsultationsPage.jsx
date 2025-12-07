// frontend/src/pages/ConsultationsPage.jsx
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from '@mui/material';
import {
    Add,
    MoreVert,
    Edit,
    Delete,
    CalendarToday,
    AccessTime,
    Person,
    Email,
    Phone,
    Note,
    CheckCircle,
    Pending,
    Cancel,
    FilterList,
    Sort,
    Download,
    Print,
    Share,
} from '@mui/icons-material';
import { consultations } from '../api';

const ConsultationsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [consultationsList, setConsultationsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 10,
        total: 0,
    });

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [consultationToCancel, setConsultationToCancel] = useState(null);

    // New consultation form
    const [newConsultation, setNewConsultation] = useState({
        name: user?.username || '',
        email: user?.email || '',
        phone: '',
        consultation_type: 'general',
        preferred_date: '',
        preferred_time: '',
        duration: 60,
        notes: '',
    });

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    useEffect(() => {
        fetchConsultations();
    }, [statusFilter, typeFilter, pagination.page]);

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const params = {
                status: statusFilter !== 'all' ? statusFilter : undefined,
                limit: pagination.limit,
                page: pagination.page + 1,
            };

            const response = await consultations.getAll(params);

            if (response.data?.success) {
                setConsultationsList(response.data.data?.consultations || []);
                setPagination({
                    ...pagination,
                    total: response.data.data?.pagination?.total || 0,
                });
            }
        } catch (error) {
            console.error('Fetch consultations error:', error);
            setError('Failed to load consultations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, consultation) => {
        setAnchorEl(event.currentTarget);
        setSelectedConsultation(consultation);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedConsultation(null);
    };

    const handleViewDetails = () => {
        if (selectedConsultation) {
            navigate(`/consultations/${selectedConsultation.id}`);
        }
        handleMenuClose();
    };

    const handleCancelClick = () => {
        setConsultationToCancel(selectedConsultation);
        setCancelDialogOpen(true);
        handleMenuClose();
    };

    const handleCancelConfirm = async () => {
        if (!consultationToCancel) return;

        try {
            await consultations.cancel(consultationToCancel.id);
            await fetchConsultations();
            setCancelDialogOpen(false);
            setConsultationToCancel(null);
        } catch (error) {
            console.error('Cancel consultation error:', error);
            setError('Failed to cancel consultation. Please try again.');
        }
    };

    const handleCreateConsultation = async () => {
        try {
            await consultations.create(newConsultation);
            await fetchConsultations();
            setCreateDialogOpen(false);
            setNewConsultation({
                name: user?.username || '',
                email: user?.email || '',
                phone: '',
                consultation_type: 'general',
                preferred_date: '',
                preferred_time: '',
                duration: 60,
                notes: '',
            });
        } catch (error) {
            console.error('Create consultation error:', error);
            setError('Failed to create consultation. Please check your input.');
        }
    };

    const handlePageChange = (event, newPage) => {
        setPagination({ ...pagination, page: newPage });
    };

    const handleRowsPerPageChange = (event) => {
        setPagination({
            ...pagination,
            limit: parseInt(event.target.value, 10),
            page: 0,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'completed':
                return 'primary';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle />;
            case 'pending':
                return <Pending />;
            case 'cancelled':
                return <Cancel />;
            default:
                return null;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Anytime';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
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
                    My Consultations
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Schedule and manage your wellness consultations
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Card sx={{ mb: 4, p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                startAdornment={<FilterList fontSize="small" sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type"
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="nutrition">Nutrition</MenuItem>
                                <MenuItem value="fitness">Fitness</MenuItem>
                                <MenuItem value="mental_health">Mental Health</MenuItem>
                                <MenuItem value="general">General</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                                startIcon={<Print />}
                                variant="outlined"
                                size="small"
                            >
                                Print
                            </Button>
                            <Button
                                startIcon={<Download />}
                                variant="outlined"
                                size="small"
                            >
                                Export
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            {/* Consultations Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {consultationsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No consultations found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {statusFilter !== 'all'
                                                ? 'Try adjusting your filters'
                                                : 'Schedule your first consultation to get started'}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => setCreateDialogOpen(true)}
                                        >
                                            Schedule Consultation
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                consultationsList.map((consultation) => (
                                    <TableRow
                                        key={consultation.id}
                                        hover
                                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {new Date(consultation.preferred_date || Date.now()).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTime(consultation.preferred_time)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={(consultation.consultation_type || 'general').replace('_', ' ')}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {consultation.name || 'No name'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {consultation.email || 'No email'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getStatusIcon(consultation.status || 'pending')}
                                                label={consultation.status || 'pending'}
                                                size="small"
                                                color={getStatusColor(consultation.status || 'pending')}
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, consultation)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {consultationsList.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={pagination.total}
                        rowsPerPage={pagination.limit}
                        page={pagination.page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                )}
            </Card>

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

            {/* Create Consultation Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Schedule New Consultation</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Full Name"
                                    value={newConsultation.name}
                                    onChange={(e) => setNewConsultation({ ...newConsultation, name: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <Person fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={newConsultation.email}
                                    onChange={(e) => setNewConsultation({ ...newConsultation, email: e.target.value })}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <Email fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Phone Number"
                            value={newConsultation.phone}
                            onChange={(e) => setNewConsultation({ ...newConsultation, phone: e.target.value })}
                            fullWidth
                            InputProps={{
                                startAdornment: <Phone fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Consultation Type</InputLabel>
                            <Select
                                value={newConsultation.consultation_type}
                                label="Consultation Type"
                                onChange={(e) => setNewConsultation({ ...newConsultation, consultation_type: e.target.value })}
                            >
                                <MenuItem value="nutrition">Nutrition Consultation</MenuItem>
                                <MenuItem value="fitness">Fitness Planning</MenuItem>
                                <MenuItem value="mental_health">Mental Health Support</MenuItem>
                                <MenuItem value="general">General Wellness</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Preferred Date"
                                    type="date"
                                    value={newConsultation.preferred_date}
                                    onChange={(e) => setNewConsultation({ ...newConsultation, preferred_date: e.target.value })}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Preferred Time"
                                    type="time"
                                    value={newConsultation.preferred_time}
                                    onChange={(e) => setNewConsultation({ ...newConsultation, preferred_time: e.target.value })}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <AccessTime fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            value={newConsultation.duration}
                            onChange={(e) => setNewConsultation({ ...newConsultation, duration: parseInt(e.target.value) || 60 })}
                            fullWidth
                        />
                        <TextField
                            label="Notes"
                            value={newConsultation.notes}
                            onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                            fullWidth
                            multiline
                            rows={4}
                            InputProps={{
                                startAdornment: <Note fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateConsultation}
                        disabled={!newConsultation.name || !newConsultation.email || !newConsultation.preferred_date}
                    >
                        Schedule Consultation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
            >
                <DialogTitle>Cancel Consultation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel your consultation on{' '}
                        {consultationToCancel && new Date(consultationToCancel.preferred_date || Date.now()).toLocaleDateString()}?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Keep Appointment</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelConfirm}
                    >
                        Cancel Consultation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Consultation Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                {selectedConsultation?.status === 'pending' && (
                    <MenuItem onClick={() => {
                        navigate(`/consultations/${selectedConsultation.id}/edit`);
                        handleMenuClose();
                    }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Edit
                    </MenuItem>
                )}
                {(selectedConsultation?.status === 'pending' || selectedConsultation?.status === 'confirmed') && (
                    <MenuItem onClick={handleCancelClick}>
                        <Cancel fontSize="small" sx={{ mr: 1 }} />
                        Cancel
                    </MenuItem>
                )}
            </Menu>
        </Container>
    );
};

export default ConsultationsPage;