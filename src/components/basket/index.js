import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import styles from './style.module.scss';

const Basket = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

 const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className={styles.basket_page}>
        <div className={styles.container}>
          <h1 className={styles.page_title}>Your Basket</h1>
          <div className={styles.empty_cart}>
            <div className={styles.empty_cart_icon}>
              <FaShoppingCart size={64} />
            </div>
            <h2>Your basket is empty</h2>
            <p>Looks like you haven't added any items to your basket yet.</p>
            <Link to="/" className={styles.continue_shopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.basket_page}>
      <div className={styles.container}>
        <h1 className={styles.page_title}>Your Basket</h1>
        
        <div className={styles.basket_content}>
          <div className={styles.cart_items}>
            <div className={styles.cart_header}>
              <div className={styles.header_item}>Product</div>
              <div className={styles.header_item}>Price</div>
              <div className={styles.header_item}>Quantity</div>
              <div className={styles.header_item}>Total</div>
              <div className={styles.header_item}></div>
            </div>

            {items.map((item) => (
              <div key={item.id} className={styles.cart_item}>
                <div className={styles.item_info}>
                  <img src={item?.imgUrl} alt={item.name} className={styles.item_image} />
                  <div className={styles.item_details}>
                    <h3 className={styles.item_name}>{item.name}</h3>
                    <button 
                      className={styles.remove_item}
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash size={16} />
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className={styles.item_price}>
                  {formatPrice(item.netPrice)}
                </div>
                
                <div className={styles.item_quantity}>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className={styles.quantity_btn}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.stock <item.quantity + 1}
                    className={styles.quantity_btn}
                  >
                    +
                  </button>
                </div>
                
                <div className={styles.item_total}>
                  {formatPrice(item.netPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.order_summary}>
            <h2 className={styles.summary_title}>Order Summary</h2>
            
            <div className={styles.summary_details}>
              <div className={styles.summary_row}>
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className={styles.summary_row}>
                <span>Shipping</span>
                <span>Calculated at Checkout</span>
              </div>
              
              <div className={styles.summary_row + ' ' + styles.total_row}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className={styles.checkout_actions}>
              <Link to="/checkout" className={styles.checkout_button}>
                Proceed to Checkout
              </Link>
              <Link to="/" className={styles.continue_shopping}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket; 
