import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import styles from './auth.module.scss';
import { showNotification } from '../../services/notification';
import { Axios, routes } from '../../config';
import { error as handleError } from '../../services/error';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: send OTP, Step 2: verify OTP
  const navigate = useNavigate();

  const validateEmail = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      await Axios.post(routes.forgetPassword, { email }); // Assuming same route for OTP send
      showNotification('Success', 'OTP sent to your email', 'success');
      setStep(2);
    } catch (err) {
      handleError(err);
      showNotification('Error', 'Failed to send OTP', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    try {
      setIsLoading(true);
      await Axios.post(routes.verifyOtp, { email, otp });
      showNotification('Success', 'Email verified successfully', 'success');
      navigate('/auth/login');
    } catch (err) {
      handleError(err);
      showNotification('Error', 'Invalid OTP', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_icon}>
        <FaKey size={40} />
      </div>
      <h2>{step === 1 ? 'Verify Your Email' : 'Enter OTP'}</h2>

      {step === 1 ? (
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
              placeholder="Enter your email"
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
            <Link to="/auth/login">Back to Login</Link>
          </div>
        </form>
      ) : (
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
      )}
    </div>
  );
};

export default VerifyEmail;

