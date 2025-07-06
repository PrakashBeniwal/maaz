import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, loginUser, logoutUser, isAuthenticated, refreshSession } from './auth';

// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session on initial load and set up periodic checks
  useEffect(() => {
    const checkAuthStatus = () => {
      const authData = getAuth();
      setUser(authData?.user || null);
      setLoading(false);
    };

    checkAuthStatus();
    
    // Set up interval to check auth status every minute
    // This helps handle expiry without full page reload
    const authCheckInterval = setInterval(checkAuthStatus, 600000);
    
    return () => clearInterval(authCheckInterval);
  }, []);

  // Refresh the session when user interacts with the app
  useEffect(() => {
    if (user) {
      refreshSession();
    }
  }, [location, user]);

  // Login function that will be passed through context
  const login = async (email, password) => {
    try {
      setLoading(true);
      const authData = await loginUser(email, password);
      setUser(authData.user);
      
      // Navigate to home or the page they were trying to access
      const from = location.state?.from?.pathname || '/account';
      navigate(from, { replace: true });
      
      return authData.user;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
    navigate('/auth/login', { replace: true });
  };

  // Provide auth context values
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
