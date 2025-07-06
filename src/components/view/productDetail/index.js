import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { addToRecentlyViewed } from '../../../store/slices/recentlyViewedSlice';
import SuccessPopup from '../../shared/SuccessPopup';
import styles from './style.module.scss';
import Loader from '../../loading/LoadingSpinner.js'
import {Axios,routes} from '../../config/index.js'
import {error} from '../../services/error'
import ProductNotFound from '../../shared/notFound/index.js'

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [product,setProduct]=useState();
  const [loading,setLoading]=useState();
  const [images,setImages]=useState(null);

  
 const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
const getList = () => {
  setLoading(true);
  Axios.get(`${routes.getProductBySlug}?slug=${productId}`)
    .then((res) => {
      const data = res.data;

      if (data) {
        const mainImage = data?.imgUrl ? [{ imgUrl: data?.imgUrl }] : [];
        const additionalImages = Array.isArray(data.productPhotos) ? data.productPhotos : [];

        setImages([...mainImage, ...additionalImages]);
        setProduct(data);
      }
    })
    .catch(err =>{ 
    error(err);
    setLoading(false);
    }).finally(() => setLoading(false));
};

  
  // Scroll to top when component mounts
  useEffect(() => {
  getList();
    window.scrollTo(0, 0);
  }, [productId]);
   
  // Add product to recently viewed when component mounts
  useEffect(() => {
    if (product) {
      const recentlyViewedProduct = {
        id: product?.slug,
        name: product?.name,
        price: product?.price,
        image: product?.imgUrl
      };
      
      dispatch(addToRecentlyViewed(recentlyViewedProduct));
    }
  }, [product, dispatch]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product?.stock) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const addToBasket = () => {
    const productToAdd = {
      id: product?.id,
      name: product?.name,
      netPrice: product?.netPrice,
      imgUrl: product?.imgUrl,
      quantity: quantity,
      stock:product?.stock
    };
    
    dispatch(addToCart(productToAdd));
    setPopupMessage(`Added ${quantity} ${product?.name} to your basket`);
    setShowPopup(true);
  };
  
  const buyNow = () => {
    addToBasket();
      navigate('/checkout');
  };
  
  const changeImage = (index) => {
    setCurrentImage(index);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  if (loading) {
    return  <Loader/>;
  }
if (!product) return  <ProductNotFound/>
    
  return (
    <div className={styles.product_detail_page}>
      <div className={styles.container}>
        <div className={styles.product_content}>
          {/* Left Column - Product Images */}
          <div className={styles.product_images}>
            <div className={styles.main_image_container}>
              {product?.discount > 0 && (
                <div className={styles.discount_badge}>
                  -{parseInt(product?.discount)}%
                </div>
              )}
              <img 
                 src={images&&images[currentImage]?.imgUrl} 
                alt={product?.name} 
                className={styles.main_image}
              />
            </div>
            <div className={styles.thumbnail_container}>
              {images?.map((image, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnail} ${currentImage === index ? styles.active : ''}`}
                  onClick={() => changeImage(index)}
                >
                  <img src={image?.imgUrl} alt={`${product?.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Product Info */}
          <div className={styles.product_info}>
            <h1 className={styles.product_name}>{product?.name}</h1>
            
            <div className={styles.product_price_container}>
              <span className={styles.current_price}> {formatPrice(product?.netPrice)}</span>
              
              {product?.total && product?.total!=product?.netPrice&& product.discount > 0 && (
                <div className={styles.original_price_container}>
                  <span className={styles.original_price}>Rs {formatPrice(product?.total)}</span>
                  <span className={styles.savings}>Save Rs {formatPrice(product?.total - product?.netPrice)}</span>
                </div>
              )}
            </div>
            
            <div className={styles.short_description}>
              <p>{product?.brand?.name}</p>
            </div>
            
            <div className={styles.quantity_container}>
              <span className={styles.quantity_label}>Quantity:</span>
              <div className={styles.quantity_selector}>
                <button 
                  className={styles.quantity_btn} 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  min="1"
                  max={product?.stock}
                  className={styles.quantity_input}
                />
                <button 
                  className={styles.quantity_btn} 
                  onClick={incrementQuantity}
                  disabled={quantity >= product?.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className={styles.action_buttons}>
              <button 
                className={styles.add_to_basket} 
                onClick={addToBasket}
                disabled={product?.stock <= 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                Add to Basket
              </button>
              <button 
                className={styles.buy_now} 
                onClick={buyNow}
                disabled={product?.stock <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className={styles.product_details}>
          <div className={styles.tabs}>
            <div className={styles.tab_header}>
              <h2>Product Details</h2>
            </div>
            
            <div className={styles.tab_content}>
              {/* Overview Section */}
              <div className={styles.overview_section}>
                <h3>Overview</h3>
                <div className={styles.overview_content}>
                  <p>{product?.shortDesc}</p>
                </div>
              </div>
              
              {/* Specifications Section */}
              <div className={styles.specifications_section}>
                <h3>Specifications</h3>
                <div 
                  className={styles.specifications_table}
                  dangerouslySetInnerHTML={{ __html: product?.desc }}
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <SuccessPopup 
        isOpen={showPopup}
        onClose={handleClosePopup}
        message={popupMessage}
      />
    </div>
  );
};

export default ProductDetail; 
