// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        user: null,
    });

    useEffect(() => {
        if (auth.token) {
            fetchUserData(auth.token);
        }
    }, [auth.token]);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAuth((prevState) => ({ ...prevState, user: response.data }));
        } catch (error) {
            console.error('Error fetching user data:', error);
            setAuth({ token: null, user: null });
        }
    };

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setAuth({ token, user: userData });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
