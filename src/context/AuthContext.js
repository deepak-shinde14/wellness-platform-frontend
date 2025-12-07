// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { getUser, logout as apiLogout } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await getUser();
                // Check response structure
                if (response.data && response.data.data) {
                    setUser(response.data.data.user || response.data.data);
                } else if (response.data) {
                    setUser(response.data.user || response.data);
                } else {
                    setUser(response);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await API.post('/auth/login', { email, password });
            
            const { data } = response;
            if (data.success && data.data) {
                const { token, user } = data.data;
                localStorage.setItem('token', token);
                setUser(user);
                return { success: true, user };
            } else if (data.user) {
                const { token, user } = data;
                localStorage.setItem('token', token);
                setUser(user);
                return { success: true, user };
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signup = async (userData) => {
        try {
            setError(null);
            const response = await API.post('/auth/signup', userData);
            
            const { data } = response;
            if (data.success && data.data) {
                const { token, user } = data.data;
                localStorage.setItem('token', token);
                setUser(user);
                return { success: true, user };
            } else if (data.user) {
                const { token, user } = data;
                localStorage.setItem('token', token);
                setUser(user);
                return { success: true, user };
            } else {
                throw new Error(data.error || 'Signup failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(prevUser => ({ ...prevUser, ...updatedUser }));
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            signup,
            logout,
            updateUser,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};