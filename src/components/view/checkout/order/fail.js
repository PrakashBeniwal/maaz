import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

const OrderFail = () => {
    // Scroll to top when component mounts
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  return (
    <div className={styles.order_result_page}>
      <div className={styles.container}>
        <div className={styles.result_content}>
          <div className={styles.icon_container}>
            <svg className={styles.fail_icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.707 6.293c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l3.293 3.293-3.293 3.293c-.391.391-.391 1.023 0 1.414s1.023.391 1.414 0l3.293-3.293 3.293 3.293c.391.391 1.023.391 1.414 0s.391-1.023 0-1.414l-3.293-3.293 3.293-3.293c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0l-3.293 3.293-3.293-3.293z"/>
            </svg>
          </div>
          
          <h1>Order Failed</h1>
          
          <p className={styles.message}>
            We're sorry, but there was an issue processing your order.
          </p>
          
          <div className={styles.order_info}>
            <p>The payment was not successful or was declined.</p>
            <p>Please check your payment details and try again.</p>
          </div>
          
          <div className={styles.actions}>
            <Link to="/account/orders" className={styles.primary_button}>
              Try Again
            </Link>
            <Link to="/basket" className={styles.secondary_button}>
              Return to Cart
            </Link>
           {/* <Link to="/contact" className={styles.tertiary_button}>
              Contact Support
            </Link>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFail;
