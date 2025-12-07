// frontend/src/api/auth.js
import API from './axiosInstance';

export const getUser = () => API.get('/auth/me').then(res => res.data);
export const logout = () => API.post('/auth/logout').then(res => res.data);