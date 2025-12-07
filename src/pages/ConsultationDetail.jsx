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
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from '@mui/material';
import {
    ArrowBack,
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
    Print,
    Download,
    Share,
} from '@mui/icons-material';
import API from '../api/axiosInstance';

const ConsultationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchConsultation();
    }, [id]);

    const fetchConsultation = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/consults/${id}`);
            if (response.data.success) {
                setConsultation(response.data.data.consultation);
                setEditData(response.data.data.consultation);
            }
        } catch (err) {
            console.error('Fetch consultation error:', err);
            setError('Failed to load consultation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            await API.delete(`/consults/${id}/cancel`);
            await fetchConsultation();
            setCancelDialogOpen(false);
        } catch (err) {
            console.error('Cancel consultation error:', err);
            setError('Failed to cancel consultation. Please try again.');
        }
    };

    const handleUpdate = async () => {
        try {
            await API.put(`/consults/${id}`, editData);
            await fetchConsultation();
            setEditDialogOpen(false);
        } catch (err) {
            console.error('Update consultation error:', err);
            setError('Failed to update consultation. Please try again.');
        }
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
        if (!timeString) return '';
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

    if (error || !consultation) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Consultation not found'}
                </Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/consultations')}>
                    Back to Consultations
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
                    onClick={() => navigate('/consultations')}
                    sx={{ mb: 2 }}
                >
                    Back to Consultations
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Chip
                            icon={getStatusIcon(consultation.status)}
                            label={consultation.status || 'pending'}
                            size="small"
                            color={getStatusColor(consultation.status)}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {consultation.consultation_type?.replace('_', ' ') || 'General'} Consultation
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => window.print()}>
                            <Print />
                        </IconButton>
                        <IconButton>
                            <Download />
                        </IconButton>
                        <IconButton>
                            <Share />
                        </IconButton>
                        {(consultation.status === 'pending' || consultation.status === 'confirmed') && (
                            <>
                                <Button
                                    startIcon={<Edit />}
                                    variant="outlined"
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<Cancel />}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setCancelDialogOpen(true)}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Stack>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left column - Consultation details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Date & Time */}
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <CalendarToday color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Date
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6">
                                            {new Date(consultation.preferred_date || Date.now()).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccessTime color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Time
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6">
                                            {formatTime(consultation.preferred_time)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Duration */}
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Duration
                                        </Typography>
                                        <Typography variant="h6">
                                            {consultation.duration || 60} minutes
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Type */}
                            <Grid item xs={12} sm={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Consultation Type
                                        </Typography>
                                        <Typography variant="h6">
                                            {consultation.consultation_type?.replace('_', ' ') || 'General'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        {/* Contact Information */}
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            Contact Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Person color="action" />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Name
                                        </Typography>
                                        <Typography variant="body1">
                                            {consultation.name || 'Not provided'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Email color="action" />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {consultation.email || 'Not provided'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            {consultation.phone && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Phone color="action" />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1">
                                                {consultation.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        {/* Notes */}
                        {consultation.notes && (
                            <>
                                <Divider sx={{ my: 4 }} />
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Note color="action" />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Notes
                                        </Typography>
                                    </Box>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 3, bgcolor: 'background.default' }}
                                    >
                                        <Typography variant="body1">
                                            {consultation.notes}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Grid>

                {/* Right column - Actions and info */}
                <Grid item xs={12} md={4}>
                    {/* Quick Actions */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                            {(consultation.status === 'pending' || consultation.status === 'confirmed') && (
                                <>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setEditDialogOpen(true)}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        onClick={() => setCancelDialogOpen(true)}
                                    >
                                        Cancel Appointment
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/consultations')}
                            >
                                View All Appointments
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/consultations/new')}
                            >
                                Book New Consultation
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Appointment Details */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Appointment Details
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Created
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(consultation.created_at || Date.now()).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(consultation.updated_at || Date.now()).toLocaleDateString()}
                                </Typography>
                            </Box>
                            {consultation.user_name && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Linked Account
                                    </Typography>
                                    <Typography variant="body1">
                                        {consultation.user_name}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Consultation</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Preferred Date"
                            type="date"
                            value={editData.preferred_date?.split('T')[0] || ''}
                            onChange={(e) => setEditData({ ...editData, preferred_date: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Preferred Time"
                            type="time"
                            value={editData.preferred_time || ''}
                            onChange={(e) => setEditData({ ...editData, preferred_time: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Notes"
                            multiline
                            rows={4}
                            value={editData.notes || ''}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                    >
                        Save Changes
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
                        {consultation && new Date(consultation.preferred_date || Date.now()).toLocaleDateString()}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Keep Appointment</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancel}
                    >
                        Cancel Consultation
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ConsultationDetail;