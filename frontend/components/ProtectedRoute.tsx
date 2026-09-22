import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUserFromStorage, isAuthenticated } from '../services/apiService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}`, message: 'Please sign in to continue.' }}
      />
    );
  }

  const user = getCurrentUserFromStorage();

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
