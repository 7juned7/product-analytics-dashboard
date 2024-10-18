// src/context/AuthContext.js

import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const login = () => {
        // Implement login logic (e.g., show login form, authenticate user)
        const dummyUser = { name: 'John Doe' };
        // Replace with actual login logic
        localStorage.setItem('user', JSON.stringify(dummyUser))
        setUser(dummyUser);
    };

    const logout = () => {
        setUser(null);

        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
