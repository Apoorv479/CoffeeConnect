// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cafefinder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem('cafefinder_token'));

  // --- LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('cafefinder_token', data.token);
      localStorage.setItem('cafefinder_user', JSON.stringify(data)); 
      
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('cafefinder_token', data.token);
      localStorage.setItem('cafefinder_user', JSON.stringify(data)); 
      
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    localStorage.removeItem('cafefinder_token');
    localStorage.removeItem('cafefinder_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};