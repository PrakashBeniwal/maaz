import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

const SuccessPopup = ({ isOpen, onClose, message, showViewCart = true }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className={styles.popup_overlay}>
      <div className={styles.success_popup}>
        <div className={styles.success_icon}>✓</div>
        <h3>Success!</h3>
        <p>{message}</p>
        <div className={styles.popup_actions}>
          <button 
            className={styles.continue_shopping}
            onClick={onClose}
          >
            Continue Shopping
          </button>
          {showViewCart && (
            <button 
              className={styles.view_cart}
              onClick={() => {
                onClose();
                navigate('/basket');
              }}
            >
              View Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup; 