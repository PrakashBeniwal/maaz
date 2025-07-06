import React, { useState } from 'react';
import styles from './style.module.scss';
import LoadingSpinner from '../../loading/LoadingSpinner';
import {Axios,routes} from '../../config';
import {error} from '../../services/error'

const AccountDetails = ({ user ,updateInfo,setUpdateInfo}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    id:user.id
  });
  
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePhoneNumber = (phone) => {
  const regex = /^03[0-9]{9}$/;
  return regex.test(phone);
};


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    
 // Phone number validation
  if (!validatePhoneNumber(formData.phone)) {
    newErrors.phone = 'Invalid Pakistani phone number. Format: 03XXXXXXXXX';
  }
  
    if (changePassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

  
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

// Inside handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
    setLoading(true);
    window.scrollTo(0, 0);

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      id:formData.id
    };

    if (changePassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    const res = await Axios.put(`${routes.updateUser}`, payload);

    setSuccessMessage('Your account details have been updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setEditMode(false);
    setChangePassword(false);
    setUpdateInfo(!updateInfo);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Something went wrong';
    setErrors(prev => ({ ...prev, submit: errorMsg }));
    console.error('Update error:', err);
        error(err);
  } finally{
        setLoading(false)
      }
};

  
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset the form data when entering edit mode
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setSuccessMessage('');
    }
  };

 if (loading) {
    return <LoadingSpinner message="Updating Personal Info..." />;
  }
  
  return (
    <div className={styles.account_details}>
      <div className={styles.section_header}>
        <h3>Personal Information</h3>
        <button 
          className={styles.edit_button}
          onClick={toggleEditMode}
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      {successMessage && (
        <div className={styles.success_message}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="name">Full Name</label>
          {editMode ? (
            <>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.error_input : ''}
              />
              {errors.name && <div className={styles.error_message}>{errors.name}</div>}
            </>
          ) : (
            <div className={styles.info_value}>{user.name}</div>
          )}
        </div>
        
        <div className={styles.form_group}>
          <label htmlFor="email">Email Address</label>
          {editMode ? (
            <>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                className={errors.email ? styles.error_input : ''}
              />
              {errors.email && <div className={styles.error_message}>{errors.email}</div>}
            </>
          ) : (
            <div className={styles.info_value}>{user.email}</div>
          )}
        </div>
        
        <div className={styles.form_group}>
          <label htmlFor="phone">Phone Number</label>
          {editMode ? (
          <>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
             {errors.phone && <div className={styles.error_message}>{errors.phone}</div>}
             </>
          ) : (
            <div className={styles.info_value}>{user.phone}</div>
          )}
        </div>
        
        {editMode && (
          <>
            <div className={styles.password_section}>
              <div className={styles.section_header}>
                <h3>Change Password</h3>
                <button 
                  type="button"
                  className={styles.toggle_button}
                  onClick={() => setChangePassword(!changePassword)}
                >
                  {changePassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>
              
              {changePassword && (
                <>
                  <div className={styles.form_group}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={errors.currentPassword ? styles.error_input : ''}
                    />
                    {errors.currentPassword && <div className={styles.error_message}>{errors.currentPassword}</div>}
                  </div>
                  
                  <div className={styles.form_group}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={errors.newPassword ? styles.error_input : ''}
                    />
                    {errors.newPassword && <div className={styles.error_message}>{errors.newPassword}</div>}
                  </div>
                  
                  <div className={styles.form_group}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? styles.error_input : ''}
                    />
                    {errors.confirmPassword && <div className={styles.error_message}>{errors.confirmPassword}</div>}
                  </div>
                </>
              )}
            </div>
            
            <div className={styles.form_actions}>
              <button type="submit" className={styles.save_button}>Save Changes</button>
            </div>
          </>
        )}
      </form>
      
      {!editMode && (
        <div className={styles.account_info}>
          <div className={styles.section_header}>
            <h3>Account Information</h3>
          </div>
          
          <div className={styles.info_row}>
            <div className={styles.info_label}>Member Since</div>
            <div className={styles.info_value}>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails; 
