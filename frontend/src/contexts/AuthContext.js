// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);
  
  const login = async (username, password) => {
    try {
      // This would be an API call in production
      if (username === 'teacher' && password === 'password') {
        const user = { 
          id: 1, 
          username: 'teacher', 
          role: 'teacher',
          name: 'John Doe'
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      } else if (username === 'admin' && password === 'password') {
        const user = { 
          id: 2, 
          username: 'admin', 
          role: 'admin',
          name: 'Admin User'
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Invalid username or password' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };
  
  const register = async (userData) => {
    try {
      // This would be an API call in production
      const user = { 
        id: 3, 
        username: userData.username, 
        role: userData.role || 'teacher',
        name: userData.name
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
