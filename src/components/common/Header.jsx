import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FitnessCenter,
  AccountCircle,
  Dashboard,
  Article,
  CalendarToday,
  Flag,
  Person,
  ExitToApp,
  AdminPanelSettings,
  Notifications,
  Bookmark,
} from '@mui/icons-material';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const handleNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <FitnessCenter /> },
    { label: 'Articles', path: '/content', icon: <Article /> },
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, auth: true },
    { label: 'Goals', path: '/goals', icon: <Flag />, auth: true },
    { label: 'Consultations', path: '/consultations', icon: <CalendarToday />, auth: true },
    { label: 'Bookmarks', path: '/content?bookmarks=true', icon: <Bookmark />, auth: true },
  ];

  const adminItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <AdminPanelSettings />, admin: true },
    { label: 'Manage Users', path: '/admin/users', icon: <Person />, admin: true },
    { label: 'Manage Content', path: '/admin/content', icon: <Article />, admin: true },
    { label: 'Consultations', path: '/admin/consultations', icon: <CalendarToday />, admin: true },
  ];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              WellnessHub
            </Typography>
          </ListItem>
          <Divider />
          {menuItems.map((item) => {
            if (item.auth && !user) return null;
            if (item.admin && (!user || !user.isAdmin)) return null;
            return (
              <ListItem
                button
                key={item.label}
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
          {user?.isAdmin && (
            <>
              <Divider />
              <ListItem>
                <Typography variant="subtitle2" color="text.secondary">
                  Admin
                </Typography>
              </ListItem>
              {adminItems.map((item) => (
                <ListItem
                  button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <FitnessCenter sx={{ mr: 1, color: 'white' }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: isMobile ? 1 : 0,
              }}
            >
              WellnessHub
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 3 }}>
                {menuItems.map((item) => {
                  if (item.auth && !user) return null;
                  if (item.admin && (!user || !user.isAdmin)) return null;
                  return (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        my: 2,
                        color: 'white',
                        display: 'flex',
                        mx: 0.5,
                        ...(location.pathname === item.path && {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
                {user?.isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'flex',
                      mx: 0.5,
                      ...(location.pathname.startsWith('/admin') && {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }),
                    }}
                  >
                    Admin
                  </Button>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <Tooltip title="Notifications">
                    <IconButton color="inherit" onClick={handleNotifications}>
                      <Badge badgeContent={3} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationsClose}
                  >
                    <MenuItem onClick={handleNotificationsClose}>
                      No new notifications
                    </MenuItem>
                  </Menu>

                  <Tooltip title="Account settings">
                    <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 36,
                          height: 36,
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase() || <AccountCircle />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: { minWidth: 200 },
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        Signed in as
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {user?.username || 'User'}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                      <Dashboard sx={{ mr: 2 }} fontSize="small" />
                      Dashboard
                    </MenuItem>
                    <MenuItem component={Link} to="/profile" onClick={handleClose}>
                      <Person sx={{ mr: 2 }} fontSize="small" />
                      Profile
                    </MenuItem>
                    {user.isAdmin && (
                      <MenuItem component={Link} to="/admin" onClick={handleClose}>
                        <AdminPanelSettings sx={{ mr: 2 }} fontSize="small" />
                        Admin Panel
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 2 }} fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <MobileMenu />
    </>
  );
};

export default Header;