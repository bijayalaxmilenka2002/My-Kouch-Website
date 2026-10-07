import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F6F2' }}>
        <p style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>Verifying Owner Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }

  return children;
}
