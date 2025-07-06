import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import SuccessPopup from '../shared/SuccessPopup';
import { showNotification } from '../services/notification';
import styles from './style.module.scss';
import Loader from '../loading/LoadingSpinner.js'


const ProductScroll = ({ title, products, viewAllLink, showTimer = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  const [showPopup, setShowPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
   const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Timer effect for Flash Deals
  useEffect(() => {
    if (showTimer) {
      const timer = setInterval(() => {
        const [hours, minutes, seconds] = timeLeft.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1;
        
        if (totalSeconds < 0) {
          totalSeconds = 23 * 3600 + 59 * 60 + 59;
        }
        
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        
        setTimeLeft(
          `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
        );
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showTimer, timeLeft]);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -250,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 250,
        behavior: 'smooth'
      });
    }
  };
  
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      dispatch(addToCart({
        ...product,
        quantity: quantity
      }));
      setAddedProduct(product);
      setShowPopup(true);
      showNotification(
        'Success',
        `${product.name} has been added to your cart`,
        'success'
      );
    } catch (error) {
      showNotification(
        'Error',
        'Failed to add item to cart. Please try again.',
        'danger'
      );
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setAddedProduct(null);
  };

  const handleViewCart = () => {
    navigate('/basket');
    handleClosePopup();
  };

 if (products?.length<=0) {
    return <div></div>
  }

  return (
    <div className={styles.product_scroll_section}>
      <div className={styles.section_header}>
        <div className={styles.title_area}>
          <h2 className={styles.section_title}>{title}</h2>
          {showTimer && (
            <div className={styles.countdown_timer}>
              <span className={styles.timer_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
              </span>
              <span className={styles.time_remaining}>{timeLeft}</span>
            </div>
          )}
        </div>
        
        <div className={styles.controls}>
          <div className={styles.scroll_buttons}>
            <button 
              className={`${styles.scroll_button} ${styles.scroll_left}`}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            <button 
              className={`${styles.scroll_button} ${styles.scroll_right}`}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          
          {viewAllLink && (
            <Link to={viewAllLink} className={styles.view_all}>
              <span>View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
      
      <div className={styles.scroll_container_wrapper}>
        <div 
          className={styles.products_scroll_container} 
          ref={scrollContainerRef}
        >
          {products?.map(product => (
            <div 
              key={product.id} 
              className={styles.product_card}
            >
              {product.discount>0 && (
                <div className={styles.discount_badge}>
                  -{parseInt(product.discount)}%
                </div>
              )}
              
              <Link to={`/product/${product.slug}`} className={styles.product_link}>
                <div className={styles.product_image_container}>
                  <img 
                    src={product.imgUrl} 
                    alt={product.name} 
                    className={styles.product_image}
                  />
                </div>
                
                <div className={styles.product_info}>
                  <h3 className={styles.product_name}>{product.name}</h3>
                  
                  <div className={styles.product_bottom}>
                    <div className={styles.price_container}>
                      <span className={styles.product_price}>
                         {formatPrice(product?.netPrice)}
                      </span>
                      
                      {product.total&&product.discount>0 && (
                        <span className={styles.original_price}>
                           {formatPrice(product?.total)}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      className={styles.add_to_cart}
                      onClick={(e) => handleAddToCart(product, e)}
                      aria-label="Add to cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <SuccessPopup 
        isOpen={showPopup}
        onClose={handleClosePopup}
        message={`Added ${quantity} ${addedProduct?.name} to your basket`}
      />
    </div>
  );
};

export default ProductScroll; 
