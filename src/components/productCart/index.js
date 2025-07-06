import React from 'react';
import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom';

const ProductCart = ({ products, onAddToCart }) => {
  const redirect=useNavigate();
  const navigate=(id)=>{
    redirect(`/product/${id}`)
  }
   const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  return (
    <div className={styles.product_grid}>
      {products?.map((product) => (
        <div 
          key={product.slug} 
          className={styles.product_card}
          onClick={() => navigate(product.slug)}
        >
          <div className={styles.product_image_container}>
            <img 
              src={product.imgUrl} 
              alt={product.name} 
              className={styles.product_image}
            />
            {product.discount>0 && (
              <span className={styles.discount_badge}>
                {parseInt(product.discount)}% OFF
              </span>
            )}
          </div>
          <div className={styles.product_info}>
            <h3 className={styles.product_name}>{product.name}</h3>
            <div className={styles.price_container}>
              {product.total && (
                <span className={styles.original_price}>
                  {formatPrice(product.total)}
                </span>
              )}
              <span className={styles.product_price}>
                {formatPrice(product.netPrice)}
              </span>
            </div>
            <button 
              className={styles.add_to_cart}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, e);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCart; 
