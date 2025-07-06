import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaUser, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../services/AuthContext';
import styles from './style.module.scss';

const UserMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  // Handle navigation with dropdown close
  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
  };    

  return (
    <div className={styles.user_menu} ref={dropdownRef}>
      <button 
        className={styles.user_button} 
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <FaUserCircle size={24} />
        {isAuthenticated && (
          <span className={styles.user_name}>{user?.name?.split(' ')[0]}</span>
        )}
      </button>

      <div 
        className={`${styles.dropdown_menu} ${showDropdown ? styles.show : ''}`}
      >
        {isAuthenticated ? (
          <>
            <div className={styles.user_info}>
              <FaUserCircle size={40} />
              <div>
                <div className={styles.user_name_full}>{user.name}</div>
                <div className={styles.user_email}>{user.email}</div>
              </div>
            </div>

            <div className={styles.menu_items}>
              <div onClick={() => handleNavigation('/account')} className={styles.menu_item}>
                <FaUser /> My Account
              </div>
              <div onClick={() => handleNavigation('/account/orders')} className={styles.menu_item}>
                <FaShoppingBag /> My Orders
              </div>
              <div onClick={() => handleNavigation('/account/addresses')} className={styles.menu_item}>
                <FaMapMarkerAlt /> My Addresses
              </div>
              <div onClick={handleLogout} className={styles.menu_item}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          </>
        ) : (
          <div className={styles.menu_items}>
            <div onClick={() => handleNavigation('/auth/login')} className={styles.menu_item}>
              Login
            </div>
            <div onClick={() => handleNavigation('/auth/register')} className={styles.menu_item}>
              Register
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu; 