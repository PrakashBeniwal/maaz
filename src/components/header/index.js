import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './style.module.scss';
import Sidebar from '../sidebar';
import SearchComponent from '../search';
import UserMenu from './UserMenu';

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  
  // Get cart item count from Redux store
  const { itemCount } = useSelector((state) => state.cart);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Handle clicks outside of sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close sidebar when clicking outside
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          sidebarVisible && 
          isMobile) {
        setSidebarVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef, sidebarVisible, isMobile]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  // Handle hover events for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      setSidebarVisible(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setSidebarVisible(false);
    }
  };

 // onMouseEnter={handleMouseEnter}
 //              onMouseLeave={handleMouseLeave}

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.header_content}>
          <div className={styles.left_section}>
            <div 
              className={styles.hamburger_container}
             
              ref={sidebarRef}
            >
              <button 
                className={styles.hamburger_btn} 
                onClick={toggleSidebar}
                aria-label="Toggle navigation menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
              
              <Sidebar 
                isVisible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)}
                className={sidebarVisible ? styles.visible : ''}
              />
            </div>

            <Link to="/" className={styles.logo}>
              <img src={'/weblogo.png'} alt='log' className={styles.logoImg}  />
              <h1>SYNCX</h1>
            </Link>
          </div>

          {/* Only show search in header on desktop */}
          {!isMobile && (
            <div className={styles.search_container}>
              <SearchComponent isMobile={false} />
            </div>
          )}

          <div className={styles.header_actions}>
            {/* User Menu Component */}
            <UserMenu />

            {/* Show search icon on mobile */}
            {isMobile && (
              <div className={styles.mobile_search}>
                <SearchComponent isMobile={true} className={styles.mobile_search_component} />
              </div>
            )}

            <Link to="/basket" className={styles.basket}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span className={styles.basket_count}>{itemCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
