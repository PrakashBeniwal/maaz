import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaEnvelope, 
  FaLock, 
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash ,
  FaKey
} from 'react-icons/fa';
import styles from './auth.module.scss';
import { showNotification } from '../../services/notification';
import {Axios , routes } from '../../config'
import {error} from '../../services/error'
const Register = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

   const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    try {
      setIsLoading(true);
      const data={email:formData?.email,otp}
      await Axios.post(routes.verifyEmail,data);
      
      showNotification(
        'Success', 
        'OTP verified successfully', 
        'success'
      );
      
      
       navigate('/auth/login');

    } catch (err) {
       error(err)
    console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (phone) => {
  const regex = /^03[0-9]{9}$/;
  return regex.test(phone);
};

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else  if (!validatePhoneNumber(formData.phone)) {
    newErrors.phone = 'Invalid Pakistani phone number. Format: 03XXXXXXXXX';
  }
  
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setIsLoading(true);


    const response = await Axios.post(routes.register, formData);

    if (response.data) {

      // handleVerifyOtp();
      setStep(2);
      
      showNotification('Success', response.data?.mess || 'Registration successful! You can now verify Email', 'success');

    }
  } catch (err) {
    error(err)
    console.error('Registration error:', err);
  } finally {
    setIsLoading(false);

  }
};

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

const registerForm=()=> (
    <div className={styles.auth_container}>
      <div className={styles.auth_icon}>
        <FaUserPlus size={40} />
      </div>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <div className={styles.form_group}>
          <label htmlFor="name">
            <FaUser className={styles.input_icon} /> Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.error_input : ''}
            placeholder="Enter your full name"
          />
          {errors.name && <div className={styles.error_message}>{errors.name}</div>}
        </div>
        
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
            placeholder="Enter your email"
          />
          {errors.email && <div className={styles.error_message}>{errors.email}</div>}
        </div>
        
        <div className={styles.form_group}>
          <label htmlFor="phone">
            <FaPhone className={styles.input_icon} /> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? styles.error_input : ''}
            placeholder="Enter your phone number"
          />
          {errors.phone && <div className={styles.error_message}>{errors.phone}</div>}
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
              placeholder="Create a password"
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
        
        <div className={styles.form_group}>
          <label htmlFor="confirmPassword">
            <FaLock className={styles.input_icon} /> Confirm Password
          </label>
          <div className={styles.password_input_wrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.error_input : ''}
              placeholder="Confirm your password"
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
          {errors.confirmPassword && (
            <div className={styles.error_message}>{errors.confirmPassword}</div>
          )}
        </div>
        
        <button 
          type="submit" 
          className={`${styles.submit_button} ${isLoading ? styles.loading : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : (
            <>
              <FaUserPlus className={styles.button_icon} /> Register
            </>
          )}
        </button>
        
        <div className={styles.form_links}>
          <Link to="/auth/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );


  return (
  <div>
  
   {step == 1 && registerForm()}
      {step === 2 &&  <div className={styles.auth_container}>
      <div className={styles.auth_icon}>
        <FaKey size={40} />
      </div>
      <h2>Verify Email</h2>
   {renderOtpForm()}
    </div>
    }
    </div>
  )
}

  

export default Register; 
