import api from './api.js';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
  
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const verifyToken = async () => {
  try {
    const response = await api.post('/auth/verify');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('admin_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('admin_token');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};
