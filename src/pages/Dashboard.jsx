import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchGoals, requestConsultation } from '../api/wellnessApi';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import { CalendarToday, Email, Person, Notes } from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [consultData, setConsultData] = useState({ 
    name: '', 
    email: '', 
    preferred_date: '', 
    notes: '' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const res = await fetchGoals();
        setGoals(res.data?.goals || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadGoals();
  }, []);

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestConsultation(consultData);
      setMessage(res.data?.message || 'Consultation requested successfully!');
      setConsultData({ name: '', email: '', preferred_date: '', notes: '' });
    } catch (err) {
      console.error(err);
      setMessage('Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Welcome back{user?.username ? `, ${user.username}` : ''}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Goals Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🎯 Your Goals
            </Typography>
            
            {goals.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No goals yet. Start by setting some wellness goals!
              </Typography>
            ) : (
              <List sx={{ mt: 2 }}>
                {goals.map((g) => (
                  <Card key={g.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{g.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={g.progress || 0} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Progress: {g.progress || 0}%
                        </Typography>
                      </Box>
                      {g.category && (
                        <Chip 
                          label={g.category} 
                          size="small" 
                          sx={{ mt: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              href="/goals"
            >
              Manage Goals
            </Button>
          </Paper>
        </Grid>

        {/* Consultation Request */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📅 Request a Consultation
            </Typography>
            
            <Box component="form" onSubmit={handleConsultSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={consultData.name}
                    onChange={(e) => setConsultData({ ...consultData, name: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <Person fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={consultData.email}
                    onChange={(e) => setConsultData({ ...consultData, email: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <Email fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preferred Date/Time"
                    type="datetime-local"
                    value={consultData.preferred_date}
                    onChange={(e) => setConsultData({ ...consultData, preferred_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={consultData.notes}
                    onChange={(e) => setConsultData({ ...consultData, notes: e.target.value })}
                    InputProps={{
                      startAdornment: <Notes fontSize="small" sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Request Consultation'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {message && (
              <Alert severity={message.includes('failed') ? 'error' : 'success'} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Quick Stats" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {goals.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Goals
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      {goals.reduce((acc, g) => acc + (g.progress || 0), 0) / Math.max(goals.length, 1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Progress
                    </Typography>
                  </Paper>
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