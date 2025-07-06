import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../loading/LoadingSpinner';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }
  
  // If authenticated, render the child route
  // Otherwise, redirect to login with the current location for redirect after login
  return isAuthenticated ? (
    <Outlet /> 
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute; 