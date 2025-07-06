import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import SuccessPopup from '../../shared/SuccessPopup';
import styles from './style.module.scss';
import Loader from '../../loading/LoadingSpinner.js'
import {Axios,routes} from '../../config/index.js'
import {error} from '../../services/error'


const AllProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading,setLoading]=useState();
  const [data,setData]=useState();


const getRecentData = () => {
  setLoading(true);
  Axios.get(`${routes.getRecentProducts}`)
    .then((res) => {
      if (res.data) {
    setData(res.data)
      }
    })
    .catch(err => error(err))
    .finally(() => setLoading(false));
};

const getOfferData = () => {
  setLoading(true);
  Axios.get(`${routes.getDiscountedProducts}`)
    .then((res) => {
      if (res.data) {
    setData(res.data)
      }
    })
    .catch(err => error(err))
    .finally(() => setLoading(false));
};



// Determine which products to show based on the URL
  const getProducts = () => {
    if (categoryName === 'fresh-picks') {
      getRecentData()
    } else if (categoryName === 'flash-deals') {
      getOfferData()
    }
  };

  
  
  // Scroll to top when component mounts
  useEffect(() => {
    getProducts();
    window.scrollTo(0, 0);
  }, []);
  
  // Format the category name for display
  const formatCategoryName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayName = categoryName ? formatCategoryName(categoryName) : "All Products";
  
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      ...product,
      quantity: quantity
    }));
    setAddedProduct(product);
    setShowPopup(true);
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
    setAddedProduct(null);
  };
  
  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  if(loading){
  return <Loader/>;
  }
  return (
    <div className={styles.all_products_page}>
      
      
      
      <div className={styles.container}>
        <div className={styles.page_header}>
          <h1>{displayName}</h1>
          <p>{data?.length} products</p>
        </div>
        
        <div className={styles.products_grid}>
          {data?.map(product => (
            <div 
              key={product.slug} 
              className={styles.product_card}
              onClick={() => navigateToProduct(product.slug)}
            >
              {product.discount>0 && (
                <div className={styles.discount_badge}>
                  -{parseInt(product.discount)}%
                </div>
              )}
              
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
                       {formatPrice(product.netPrice)}
                    </span>
                    
                    {product.total && (
                      <span className={styles.original_price}>
                         {formatPrice(product.total)}
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

export default AllProducts; 
