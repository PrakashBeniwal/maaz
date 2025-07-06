import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.scss';

const FullWidthBanner = ({
  title = "Free Shipping on All Orders",
  description = "For a limited time, enjoy free shipping on all orders over $50",
  buttonText = "Learn More",
  buttonLink = "/shipping",
  backgroundImage = "https://images.unsplash.com/photo-1580974928064-f0aeef70895a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  customStyles = {}
}) => {
  return (
    <div 
      className={styles.fullWidthBanner} 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        ...customStyles
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link to={buttonLink} className={styles.button}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default FullWidthBanner; 