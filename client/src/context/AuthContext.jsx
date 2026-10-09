import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginOwner as apiLogin, getOwnerMe, updateOwnerProfile as apiUpdateProfile } from '../services/api';

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
        if (token.startsWith('offline_owner_token_')) {
          setLoading(false);
          return;
        }
        try {
          const res = await getOwnerMe(token);
          if (res.success) {
            setOwner(res.owner);
          } else {
            logout();
          }
        } catch (e) {
          console.warn('Owner auth verification via API skipped (using cached session):', e.message);
          // Don't log out if it's just a network/server unreachable error
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    // First attempt remote server API login
    try {
      const res = await apiLogin(cleanEmail, password);
      if (res.success && res.token) {
        setToken(res.token);
        setOwner(res.owner);
        localStorage.setItem('mykouch_owner_token', res.token);
        localStorage.setItem('mykouch_owner_info', JSON.stringify(res.owner));
        return res;
      }
    } catch (apiErr) {
      console.warn('API login attempt:', apiErr.message);

      // Check stored custom owner credentials or default owner credentials
      const savedCredsRaw = localStorage.getItem('mykouch_custom_owner_cred');
      const savedCreds = savedCredsRaw ? JSON.parse(savedCredsRaw) : null;

      const validEmail = savedCreds ? savedCreds.email.toLowerCase() : 'admin@mykouch.in';
      const validPassword = savedCreds ? savedCreds.password : 'MyKouch@2026';
      const validName = savedCreds ? savedCreds.name : 'myKouch Owner';

      if (cleanEmail === validEmail && password === validPassword) {
        const localToken = 'offline_owner_token_' + Date.now();
        const localOwner = {
          id: 'owner_local_01',
          name: validName,
          email: validEmail,
          role: 'owner',
        };
        setToken(localToken);
        setOwner(localOwner);
        localStorage.setItem('mykouch_owner_token', localToken);
        localStorage.setItem('mykouch_owner_info', JSON.stringify(localOwner));
        return { success: true, token: localToken, owner: localOwner };
      }

      throw new Error(apiErr.message || 'Invalid owner credentials');
    }
  };

  const logout = () => {
    setToken(null);
    setOwner(null);
    localStorage.removeItem('mykouch_owner_token');
    localStorage.removeItem('mykouch_owner_info');
  };

  const updateCredentials = async ({ name, email, currentPassword, newPassword }) => {
    // 1. Verify current password
    const savedCredsRaw = localStorage.getItem('mykouch_custom_owner_cred');
    const savedCreds = savedCredsRaw ? JSON.parse(savedCredsRaw) : null;
    const currentValidPassword = savedCreds ? savedCreds.password : 'MyKouch@2026';

    if (currentPassword && currentPassword !== currentValidPassword) {
      throw new Error('Current password is incorrect.');
    }

    // 2. Attempt remote API update if not using offline-only token
    if (token && !token.startsWith('offline_owner_token_')) {
      try {
        await apiUpdateProfile({ name, email, currentPassword, newPassword }, token);
      } catch (err) {
        console.warn('Could not update backend API credentials directly:', err.message);
      }
    }

    // 3. Save to local credentials storage
    const newCreds = {
      name: name || owner?.name || 'myKouch Owner',
      email: (email || owner?.email || 'admin@mykouch.in').toLowerCase().trim(),
      password: newPassword || currentValidPassword,
    };
    localStorage.setItem('mykouch_custom_owner_cred', JSON.stringify(newCreds));

    const updatedOwner = {
      id: owner?.id || 'owner_local_01',
      name: newCreds.name,
      email: newCreds.email,
      role: 'owner',
    };
    setOwner(updatedOwner);
    localStorage.setItem('mykouch_owner_info', JSON.stringify(updatedOwner));

    return { success: true, message: 'Owner account credentials updated successfully!' };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        owner,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
