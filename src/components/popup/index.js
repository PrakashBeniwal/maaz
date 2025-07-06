import React from 'react';
import styles from './style.module.scss';

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popup_overlay} onClick={onClose}>
      <div className={styles.popup_content} onClick={e => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup; 