// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to validate this token via API
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post(API_URL + 'login', { email, password });
        const { token, username, id } = response.data;

        localStorage.setItem('token', token);
        setUser({ id, username, token });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};