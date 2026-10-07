import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginOwner as apiLogin, getOwnerMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('mykouch_owner_token') || null);
  const [owner, setOwner] = useState(() => {
    const saved = localStorage.getItem('mykouch_owner_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await getOwnerMe(token);
          if (res.success) {
            setOwner(res.owner);
          } else {
            logout();
          }
        } catch (e) {
          console.error('Owner auth check failed:', e);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setOwner(res.owner);
      localStorage.setItem('mykouch_owner_token', res.token);
      localStorage.setItem('mykouch_owner_info', JSON.stringify(res.owner));
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    setToken(null);
    setOwner(null);
    localStorage.removeItem('mykouch_owner_token');
    localStorage.removeItem('mykouch_owner_info');
  };

  return (
    <AuthContext.Provider value={{ token, owner, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
