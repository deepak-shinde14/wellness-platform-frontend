import API from './axiosInstance';

// Auth
export const signup = (username, email, password) =>
  API.post('/auth/signup', { username, email, password });

export const login = (email, password) => API.post('/auth/login', { email, password });

// Content
export const fetchContent = () => API.get('/content');

// Consultations
export const requestConsultation = (data) => API.post('/consults', data);
export const getConsultations = () => API.get('/consults');

// Goals (example)
export const fetchGoals = () => API.get('/goals/goals');

export default {
  signup,
  login,
  fetchContent,
  requestConsultation,
  getConsultations,
  fetchGoals,
};
