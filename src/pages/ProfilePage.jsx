import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Avatar,
    Button,
    TextField,
    Alert,
    Stack,
    Divider,
    Grid,
    Card,
    CardContent,
    Tab,
    Tabs,
    CircularProgress,
    Switch,
    FormControlLabel,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Person,
    Email,
    CalendarToday,
    Edit,
    Save,
    Cancel,
    Lock,
    Notifications,
    Security,
    Dashboard as DashboardIcon,
    Article,
    Flag,
    Settings,
} from '@mui/icons-material';
import API from '../api/axiosInstance';

const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [settings, setSettings] = useState({
        email_notifications: true,
        goal_reminders: true,
        consultation_reminders: true,
        theme: 'light',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await API.get('/auth/me');
            if (response.data.success) {
                const userData = response.data.data.user;
                setProfileData({
                    username: userData.username || '',
                    email: userData.email || '',
                });
                updateUser(userData);
            }
        } catch (err) {
            console.error('Fetch user error:', err);
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const response = await API.put('/auth/update-profile', {
                username: profileData.username,
            });

            if (response.data.success) {
                setSuccess('Profile updated successfully!');
                updateUser(response.data.data.user);
                setEditMode(false);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await API.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to change password.');
        } finally {
            setSaving(false);
        }
    };

    const handleSettingsChange = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await API.put('/user/settings', settings);
            setSuccess('Settings updated successfully!');
        } catch (err) {
            setError('Failed to update settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Profile Settings
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Manage your account and preferences
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left sidebar - User info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: 48,
                                    bgcolor: 'primary.main',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase() || <Person />}
                            </Avatar>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {user?.username || 'User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email || ''}
                            </Typography>
                            <Chip
                                label={user?.isAdmin ? 'Admin' : 'Member'}
                                size="small"
                                color={user?.isAdmin ? 'primary' : 'default'}
                                sx={{ mt: 1 }}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                                <CalendarToday color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Member since
                                    </Typography>
                                    <Typography variant="body2">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Main content - Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab icon={<Person />} label="Profile" />
                            <Tab icon={<Security />} label="Security" />
                            <Tab icon={<Settings />} label="Preferences" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Error/Success messages */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    {success}
                                </Alert>
                            )}

                            {/* Profile Tab */}
                            {activeTab === 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Personal Information
                                        </Typography>
                                        {!editMode ? (
                                            <Button
                                                startIcon={<Edit />}
                                                variant="outlined"
                                                onClick={() => setEditMode(true)}
                                            >
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    startIcon={<Cancel />}
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setProfileData({
                                                            username: user?.username || '',
                                                            email: user?.email || '',
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    startIcon={<Save />}
                                                    variant="contained"
                                                    onClick={handleProfileUpdate}
                                                    disabled={saving}
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </Stack>
                                        )}
                                    </Box>

                                    <Stack spacing={3}>
                                        <TextField
                                            label="Username"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                            fullWidth
                                            disabled={!editMode}
                                            InputProps={{
                                                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                        />
                                        <TextField
                                            label="Email Address"
                                            value={profileData.email}
                                            disabled
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                            helperText="Email cannot be changed"
                                        />
                                        <TextField
                                            label="Account Created"
                                            value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                                            disabled
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            )}

                            {/* Security Tab */}
                            {activeTab === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Change Password
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Current Password"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                        />
                                        <TextField
                                            label="New Password"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                        />
                                        <TextField
                                            label="Confirm New Password"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
                                            }}
                                        />
                                        <Box>
                                            <Button
                                                variant="contained"
                                                onClick={handlePasswordChange}
                                                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                                                startIcon={<Save />}
                                            >
                                                {saving ? 'Updating...' : 'Change Password'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 2 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Notification Preferences
                                    </Typography>
                                    <Stack spacing={3}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.email_notifications}
                                                    onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Email Notifications</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Receive email updates about your account and wellness journey
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.goal_reminders}
                                                    onChange={(e) => setSettings({ ...settings, goal_reminders: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Goal Reminders</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Get reminders to update your progress on active goals
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={settings.consultation_reminders}
                                                    onChange={(e) => setSettings({ ...settings, consultation_reminders: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Consultation Reminders</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Receive reminders before scheduled consultations
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Box>
                                            <Button
                                                variant="contained"
                                                onClick={handleSettingsChange}
                                                disabled={saving}
                                                startIcon={<Save />}
                                            >
                                                {saving ? 'Saving...' : 'Save Preferences'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    {/* Account Stats */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <DashboardIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" gutterBottom>
                                        15
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Logins
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Article color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" gutterBottom>
                                        8
                                    </Typography>
                                    <Typography variant="body2" color="text-secondary">
                                        Articles Read
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Flag color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" gutterBottom>
                                        5
                                    </Typography>
                                    <Typography variant="body2" color="text-secondary">
                                        Goals Set
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h4" gutterBottom>
                                        3
                                    </Typography>
                                    <Typography variant="body2" color="text-secondary">
                                        Consultations
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProfilePage;