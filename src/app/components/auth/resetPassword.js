import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaKey, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './auth.module.scss';
import { NotificationManager } from 'react-notifications';
import { setCookie } from '../services/cookie';
import { routes } from '../../config';
import { Axios } from '../services/axios';
import {error} from '../services/error'
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = () => {
    const newErrors = { ...errors };
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    } else {
      delete newErrors.email;
    }
    setErrors(newErrors);
    return !newErrors.email;
  };

  const validateOtp = () => {
    const newErrors = { ...errors };
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    } else {
      delete newErrors.otp;
    }
    setErrors(newErrors);
    return !newErrors.otp;
  };

  const validatePassword = () => {
    const newErrors = { ...errors };
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else {
      delete newErrors.newPassword;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      delete newErrors.confirmPassword;
    }
    
    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      
      await Axios.post(routes.forgetPassword, {email});
      
       NotificationManager.success('OTP has been sent to your email', );
      setStep(2);
    } catch (err) {
      error(err);
      console.error('Send OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;

    try {
      setIsLoading(true);
      const data={email,otp}
      await Axios.post(routes.verifyOtp,data);
      
       NotificationManager.success(  'OTP verified successfully');
      setStep(3);
    } catch (err) {
      error(err)
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    try {
      setIsLoading(true);

      const data={email,otp,password:newPassword};
      
      await Axios.post(routes.resetPassword,data);
      
       NotificationManager.success('Your password has been reset successfully');
        navigate('/login');
    } catch (err) {
      error(err)
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderEmailForm = () => (
    <form onSubmit={handleSendOtp} className={styles.auth_form}>
      <div className={styles.form_group}>
        <label htmlFor="email">
          <FaEnvelope className={styles.input_icon} /> Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? styles.error_input : ''}
          placeholder="Enter your registered email"
        />
        {errors.email && <div className={styles.error_message}>{errors.email}</div>}
      </div>
      
      <button 
        type="submit" 
        className={`${styles.submit_button} ${isLoading ? styles.loading : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>
      
      <div className={styles.form_links}>
        <Link to="/login">Back to Login</Link>
      </div>
    </form>
  );
  
  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className={styles.auth_form}>
      <div className={styles.form_group}>
        <label htmlFor="otp">
          <FaKey className={styles.input_icon} /> OTP
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={6}
          className={errors.otp ? styles.error_input : ''}
          placeholder="Enter 6-digit OTP"
        />
        {errors.otp && <div className={styles.error_message}>{errors.otp}</div>}
      </div>
      
      <button 
        type="submit" 
        className={`${styles.submit_button} ${isLoading ? styles.loading : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      
      <button 
        type="button" 
        className={styles.secondary_button}
        onClick={() => setStep(1)}
      >
        Change Email
      </button>
    </form>
  );
  
  const renderPasswordForm = () => (
    <form onSubmit={handleResetPassword} className={styles.auth_form}>
      <div className={styles.form_group}>
        <label htmlFor="newPassword">
          <FaLock className={styles.input_icon} /> New Password
        </label>
        <div className={styles.password_input_wrapper}>
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={errors.newPassword ? styles.error_input : ''}
            placeholder="Enter new password"
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
        {errors.newPassword && <div className={styles.error_message}>{errors.newPassword}</div>}
      </div>
      
      <div className={styles.form_group}>
        <label htmlFor="confirmPassword">
          <FaLock className={styles.input_icon} /> Confirm Password
        </label>
        <div className={styles.password_input_wrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? styles.error_input : ''}
            placeholder="Confirm new password"
          />
          <button 
            type="button"
            className={styles.password_toggle}
            onClick={toggleConfirmPasswordVisibility}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && <div className={styles.error_message}>{errors.confirmPassword}</div>}
      </div>
      
      <button 
        type="submit" 
        className={`${styles.submit_button} ${isLoading ? styles.loading : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );

  // Update the step title based on current step
  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Reset Password';
      case 2: return 'Verify OTP';
      case 3: return 'Create New Password';
      default: return 'Reset Password';
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_icon}>
        <FaKey size={40} />
      </div>
      <h2>{getStepTitle()}</h2>
      
      {step === 1 && renderEmailForm()}
      {step === 2 && renderOtpForm()}
      {step === 3 && renderPasswordForm()}
    </div>
  );
};

export default ResetPassword; 
