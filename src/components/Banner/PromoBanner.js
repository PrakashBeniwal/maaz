import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.scss';

const PromoBanner = ({
  title = "Special Offer",
  description = "Get up to 40% off on selected items this week only!",
  buttonText = "View Deals",
  buttonLink = "/deals",
  backgroundImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  customStyles = {}
}) => {
  return (
    <div 
      className={styles.promoBanner} 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        ...customStyles
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link to={buttonLink} className={styles.button}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default PromoBanner; 