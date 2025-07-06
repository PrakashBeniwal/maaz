import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './auth.module.scss';
import { useAuth } from '../../services/AuthContext';
import LoadingSpinner from '../../loading/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {

    window.scrollTo(0, 0);
  
    if (isAuthenticated) {
      // Go to where they were trying to access, or home
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Use auth context login method
      await login(formData.email, formData.password);
      
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error notification is handled in the login method
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Loading authentication..." />;
  }

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_icon}>
        <FaSignInAlt size={40} />
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <div className={styles.form_group}>
          <label htmlFor="email">
            <FaEnvelope className={styles.input_icon} /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.error_input : ''}
            placeholder="email"
          />
          {errors.email && <div className={styles.error_message}>{errors.email}</div>}
        </div>
        
        <div className={styles.form_group}>
          <label htmlFor="password">
            <FaLock className={styles.input_icon} /> Password
          </label>
          <div className={styles.password_input_wrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.error_input : ''}
              placeholder="password"
            />
            <button 
              type="button"
              className={styles.password_toggle}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <div className={styles.error_message}>{errors.password}</div>}
        </div>
        
        <button 
          type="submit" 
          className={`${styles.submit_button} ${isLoading ? styles.loading : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : (
            <>
              <FaSignInAlt className={styles.button_icon} /> Login
            </>
          )}
        </button>
        
        <div className={styles.form_links}>
          <Link to="/auth/reset-password">Forgot Password?</Link>
          <Link to="/auth/register">New User? Register</Link>
        </div>
         <div className={styles.form_links} style={{justifyContent:"center",fontSize:"1rem"}}>
          <Link to="/auth/verify" >Verify Email</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 
