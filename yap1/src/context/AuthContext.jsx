import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, getStoredUser, getStoredToken, logout as authLogout } from '../services/auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        // Verify token is still valid
        const verified = await verifyToken();
        if (verified) {
          setUser(storedUser);
        } else {
          authLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
