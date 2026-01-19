import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier le token au chargement
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur de connexion'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.post('/api/register', { username, email, password });
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Register error:", error);

            let message = "Erreur d'inscription";
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                message = error.response.data.message || error.response.statusText;
            } else if (error.request) {
                // The request was made but no response was received
                message = "Erreur réseau: Impossible de contacter le serveur (Port 5000?)";
            } else {
                // Something happened in setting up the request that triggered an Error
                message = error.message;
            }

            return {
                success: false,
                message: message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const refreshUser = async () => {
        if (!user?.email) return;
        try {
            const response = await api.get(`/api/me?email=${user.email}`);
            if (response.data.user) {
                updateUser(response.data.user);
                return response.data.user;
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
