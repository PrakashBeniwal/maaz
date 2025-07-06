import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RecentlyViewed = () => {
  const { products } = useSelector(state => state.recentlyViewed);
  const scrollContainerRef = useRef(null);

  // If no recently viewed products, don't render anything
  if (!products || products.length === 0) {
    return null;
  }

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-Pk', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.recently_viewed}>
      <div className={styles.header}>
        <h2>Recently Viewed</h2>
      </div>
      
      <div className={styles.scroll_container_wrapper}>
        <button 
          className={`${styles.scroll_button} ${styles.left}`}
          onClick={handleScrollLeft}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        
        <div className={styles.scroll_container} ref={scrollContainerRef}>
          {products.map(product => (
            <div key={product.id} className={styles.product_card}>
              <Link to={`/product/${product.id}`} className={styles.product_link}>
                <div className={styles.image_container}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.product_info}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}> {formatPrice(product.price)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.scroll_button} ${styles.right}`}
          onClick={handleScrollRight}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default RecentlyViewed; 
