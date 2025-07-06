import { showNotification } from './notification';
import {Axios,routes} from '../config/index.js'
// Keys for localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRY_KEY = 'auth_expiry';

// Session expiry time in milliseconds (1 hour)
const SESSION_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Set authentication data in localStorage with expiry
 */
export const setAuth = (user, token) => {
  const expiryTime = Date.now() + SESSION_EXPIRY;
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
  
  return { user, token, expiryTime };
};

/**
 * Get current authentication data if valid
 */
export const getAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const expiryStr = localStorage.getItem(EXPIRY_KEY);
  
  if (!token || !userStr || !expiryStr) {
    return null;
  }
  
  const expiryTime = parseInt(expiryStr, 10);
  const now = Date.now();
  
  // Check if session has expired
  if (now > expiryTime) {
    clearAuth();
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return { user, token, expiryTime };
  } catch (error) {
    clearAuth();
    return null;
  }
};

/**
 * Clear authentication data (logout)
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

/**
 * Check if user is authenticated with valid session
 */
export const isAuthenticated = () => {
  return getAuth() !== null;
};

/**
 * Login user and store auth data
 */
export const loginUser = async (email, password) => {
  try {
    const data = { email, password };
    const response = await Axios.post(routes.login, data);
    
    const { token,user } = response.data;
    
    const authData = setAuth(user, token);
    
    showNotification('Success', 'Login successful!', 'success');
    return authData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Invalid email or password';
    showNotification('Error', errorMessage, 'danger');
    throw new Error(errorMessage);
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  clearAuth();
  showNotification('Success', 'You have been logged out', 'success');
};

/**
 * Refresh session to extend expiry
 */
export const refreshSession = () => {
  const auth = getAuth();
  if (auth) {
    const expiryTime = Date.now() + SESSION_EXPIRY;
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
    return { ...auth, expiryTime };
  }
  return null;
};

export default {
  setAuth,
  getAuth,
  clearAuth,
  isAuthenticated,
  loginUser,
  logoutUser,
  refreshSession
}; 


