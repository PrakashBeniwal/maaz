import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

const OrderSuccess = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  return (
    <div className={styles.order_result_page}>
      <div className={styles.container}>
        <div className={styles.result_content}>
          <div className={styles.icon_container}>
            <svg className={styles.success_icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z"/>
            </svg>
          </div>
          
          <h1>Order Placed Successfully!</h1>
          
          <p className={styles.message}>
            Thank you for your purchase. Your order has been placed successfully and is being processed.
          </p>
          
          <div className={styles.order_info}>
            <p>An email confirmation has been sent to your registered email address.</p>
            <p>Your order will be delivered within 3-5 business days.</p>
          </div>
          
          <div className={styles.actions}>
            <Link to="/account/orders" className={styles.primary_button}>
              View My Orders
            </Link>
            <Link to="/" className={styles.secondary_button}>
              Continue Shopping
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderSuccess; 