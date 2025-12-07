// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Main Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ContentPage from './pages/ContentPage';
import GoalsPage from './pages/GoalsPage';
import ConsultationsPage from './pages/ConsultationsPage';

// Detail Pages (we'll create these later)
// import ContentDetail from './pages/ContentDetail';
// import GoalDetail from './pages/GoalDetail';
// import ConsultationDetail from './pages/ConsultationDetail';
// import ProfilePage from './pages/ProfilePage';

// Admin Pages (we'll create these later)
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminUsers from './pages/admin/AdminUsers';
// import AdminContent from './pages/admin/AdminContent';
// import AdminConsultations from './pages/admin/AdminConsultations';

const theme = createTheme({
  palette: {
    primary: {
      main: '#10B981', // Emerald green
      light: '#34D399',
      dark: '#059669',
    },
    secondary: {
      main: '#3B82F6', // Blue
      light: '#60A5FA',
      dark: '#2563EB',
    },
    accent: {
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/content" element={<ContentPage />} />
                
                {/* Auth Routes (Public Only) */}
                <Route 
                  path="/login" 
                  element={
                    <PublicOnlyRoute>
                      <LoginForm />
                    </PublicOnlyRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicOnlyRoute>
                      <SignupForm />
                    </PublicOnlyRoute>
                  } 
                />
                <Route 
                  path="/forgot-password" 
                  element={
                    <PublicOnlyRoute>
                      <ForgotPassword />
                    </PublicOnlyRoute>
                  } 
                />
                <Route 
                  path="/reset-password/:token" 
                  element={
                    <PublicOnlyRoute>
                      <ResetPassword />
                    </PublicOnlyRoute>
                  } 
                />
                
                {/* Protected User Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/goals" 
                  element={
                    <ProtectedRoute>
                      <GoalsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/consultations" 
                  element={
                    <ProtectedRoute>
                      <ConsultationsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Commented out routes for future implementation */}
                {/* 
                <Route 
                  path="/content/:id" 
                  element={
                    <ProtectedRoute>
                      <ContentDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/goals/:id" 
                  element={
                    <ProtectedRoute>
                      <GoalDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/consultations/:id" 
                  element={
                    <ProtectedRoute>
                      <ConsultationDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                {/*
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminUsers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/content" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminContent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/consultations" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminConsultations />
                    </ProtectedRoute>
                  } 
                />
                */}
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;