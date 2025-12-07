// frontend/src/api/index.js
import API from './axiosInstance';

// Auth API
export const auth = {
    login: (data) => API.post('/auth/login', data),
    signup: (data) => API.post('/auth/signup', data),
    logout: () => API.post('/auth/logout'),
    getMe: () => API.get('/auth/me'),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
    updateProfile: (data) => API.put('/auth/update-profile', data),
    changePassword: (data) => API.put('/auth/change-password', data),
};

// Goals API
export const goals = {
    getAll: (params) => API.get('/goals', { params }),
    getById: (id) => API.get(`/goals/${id}`),
    create: (data) => API.post('/goals', data),
    update: (id, data) => API.put(`/goals/${id}`, data),
    updateProgress: (id, data) => API.put(`/goals/${id}/progress`, data),
    delete: (id) => API.delete(`/goals/${id}`),
    getStatistics: () => API.get('/goals/statistics'),
};

// Content API
export const content = {
    getAll: (params) => API.get('/content', { params }),
    getById: (id) => API.get(`/content/${id}`),
    search: (query) => API.get('/content/search', { params: { q: query } }),
    getFeatured: () => API.get('/content/featured'),
    bookmark: (id) => API.post(`/content/${id}/bookmark`),
    removeBookmark: (id) => API.delete(`/content/${id}/bookmark`),
    getBookmarks: (params) => API.get('/content/user/bookmarks', { params }),
};

// Consultations API
export const consultations = {
    getAll: (params) => API.get('/consults', { params }),
    getById: (id) => API.get(`/consults/${id}`),
    create: (data) => API.post('/consults', data),
    update: (id, data) => API.put(`/consults/${id}`, data),
    cancel: (id) => API.delete(`/consults/${id}/cancel`),
};

// User API
export const user = {
    getDashboard: () => API.get('/user/dashboard'),
    getActivities: (params) => API.get('/user/activities', { params }),
    updateSettings: (data) => API.put('/user/settings', data),
};

// Admin API
export const admin = {
    getStats: () => API.get('/admin/stats'),
    getUsers: (params) => API.get('/admin/users', { params }),
    updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
    createContent: (data) => API.post('/admin/content', data),
    updateContent: (id, data) => API.put(`/admin/content/${id}`, data),
    deleteContent: (id) => API.delete(`/admin/content/${id}`),
    getAllConsultations: (params) => API.get('/consults/admin/all', { params }),
};

export default {
    auth,
    goals,
    content,
    consultations,
    user,
    admin,
};