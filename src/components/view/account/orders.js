import React, { useState,useEffect } from 'react';
import styles from './style.module.scss';
import {Axios,routes} from '../../config';
import LoadingSpinner from '../../loading/LoadingSpinner';

const Orders = (user,email) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders,setOrders]=useState([]);


 const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const fetchOrders = async () => {
    setLoading(true);
      try {
        const res = await Axios.get(`${routes.getOrdersByCustomer}?customerId=${user?.id}`);
        setOrders(res?.data?.orders);
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally{
      setLoading(false)
      }
    };

 const retryStripePayment = async (id) => {
    window.scrollTo(0, 0);
 
    setLoading(true);
      try {
        const res = await Axios.post(`${routes.retryStripePayment}`,{orderId:id});
       const { url } = res.data;
    if (url) {
      window.location.href = url;  // Redirect to Stripe checkout
    } else {
      alert('Failed to get Stripe payment link.');
    }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally{
      setLoading(false)
      }
    };

 const retryCodPayment = async (id) => {
    window.scrollTo(0, 0);
    
    setLoading(true);
      try {
        const res = await Axios.post(`${routes.retryCodPayment}`,{orderId:id,email:user.email});
       const { url } = res.data;
    if (url) {
      window.location.href = url;  // Redirect to Stripe checkout
    } else {
      alert('Failed to get Cash on Delivery payment link.');
    }
      } catch (error) {
        console.error('Failed:', error);
      } finally{
      setLoading(false)
      }
    };


      useEffect(() => {
      fetchOrders();
  }, []);


  const handleOrderClick = (order) => {
    setSelectedOrder(order.id === selectedOrder ? null : order.id);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return styles.status_confirmed;
      case 'processed': return styles.status_processed;
      case 'shipped': return styles.status_shipped;
      case 'delivered': return styles.status_delivered;
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Order Confirmed';
      case 'processed': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

const handleCancelOrder = async (orderId) => {
   setLoading(true);
    window.scrollTo(0, 0);
      try {
        const res = await Axios.delete(`${routes.cancelOrder}?id=${orderId}`);
        fetchOrders();
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally{
      setLoading(false)
      }
};



const retryHblPayment = (orderId) => {
  console.log("Retrying HBL for", orderId);
  // Implement your logic here
};

   if (loading) {
    return <LoadingSpinner message="Loading Address..." />;
  }
  
  return (
<div className={styles.orders_section}>
  <h2>My Orders</h2>

  {orders.length === 0 ? (
    <div className={styles.no_orders}>
      <p>You haven't placed any orders yet.</p>
    </div>
  ) : (
    <div className={styles.orders_list}>
      {orders?.map((order) => (
        <div
          key={order.id}
          className={`${styles.order_card} ${
            selectedOrder === order.id ? styles.expanded : ''
          }`}
          onClick={() => handleOrderClick(order)}
        >
          <div className={styles.order_header}>
            <div className={styles.order_info}>
              <h3>{order.number}</h3>
              <p>Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})}</p>
            </div>
            <div className={styles.order_status}>
              <span className={`${styles.status_badge} ${getStatusClass(order.status)}`}>
                {getStatusText(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
              </span>
              <span className={styles.order_amount}> {formatPrice(parseFloat(order.grandTotal).toFixed(2))}</span>
            </div>
          </div>

          {selectedOrder === order.id && (
            <div className={styles.order_details}>
            <div className={styles.tracking_steps}>
  {order.status === 'cancelled' ? (
    <div className={`${styles.tracking_step} ${styles.cancelled}`}>
      <div className={styles.step_icon}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                   10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 
                   17 12 13.41 8.41 17 7 15.59 10.59 12 
                   7 8.41 8.41 7 12 10.59 15.59 7 
                   17 8.41 13.41 12 17 15.59z" />
        </svg>
      </div>
      <div className={styles.step_label}>Cancelled</div>
    </div>
  ) : (
    ['pending', 'processed', 'shipped', 'delivered'].map((step, index) => (
      <div
        key={step}
        className={`${styles.tracking_step} ${
          ['pending', 'processed', 'shipped', 'delivered'].indexOf(order.status) >= index
            ? styles.completed
            : ''
        }`}
      >
        <div className={styles.step_icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <div className={styles.step_label}>{step.charAt(0).toUpperCase() + step.slice(1)}</div>
      </div>
    ))
  )}
</div>


              <h4>Items in this order</h4>
              <div className={styles.order_items}>
                {order?.orderItems?.map((item) => (
                  <div key={item.productId} className={styles.order_item}>
                    <div className={styles.item_image}>
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className={styles.item_details}>
                      <h4>{item.name}</h4>
                      <p>Price:  {formatPrice(parseFloat(item.price).toFixed(2))}</p>
                      <p>Quantity: {item.qty}</p>
                      <p>Total:  {formatPrice(parseFloat(item.total).toFixed(2))}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h4>Order Summary</h4>
              <div className={styles.order_summary}>
                <p>Courier: {order?.courier?.name || 'N/A'}</p>
                <p>Courier Cost:  {formatPrice(parseFloat(order.courierCost).toFixed(2))}</p>
                <p>Subtotal:  {formatPrice(order.subTotal)}</p>
                <p>Grand Total:  {formatPrice(parseFloat(order.grandTotal).toFixed(2))}</p>
                <p>Payment Method: {order.payment?.method=="cod"?"Cash On Delivery":order.payment?.method?.toUpperCase() || order.paymentMethod}</p>
                <p >Payment Status:<span className={`${styles.success} ${(order.payment?.status !== 'success') && styles.pending}`} >{order.payment?.status.charAt(0).toUpperCase()+order.payment?.status?.slice(1)||"Failed"}</span></p>
                <p>Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}) : 'N/A'}</p>
              </div>

             <div className={styles.retry}> {order?.status !== 'cancelled' && 
                <button
                  className={styles.cancel_button}
                  onClick={(e) => {
                    e.stopPropagation();
                    
                  }}
                   disabled={false}
                  
                >
                  Contact +92 3232824033 to Cancel Order 
                </button>
              }

           {order.status === 'pending' && 
 order.payment?.status !== 'paid' && 
 order.payment?.status !== 'success' &&(<>
  <button
    className={styles.retry_button}
    onClick={(e) => {
      e.stopPropagation();
      retryStripePayment(order.id);
    }}
    style={{cursor:"pointer"}}
  >
    Retry Payment With Stripe
  </button>
   <button
    className={styles.retry_button}
    onClick={(e) => {
      e.stopPropagation();
      retryHblPayment(order.id);
    }}
    style={{cursor:"pointer"}}
    disabled={true}
  >
    Retry With HBL
  </button>
   <button
    className={styles.retry_button}
    onClick={(e) => {
      e.stopPropagation();
      retryCodPayment(order.id);
    }}
    style={{cursor:"pointer"}}
  >
    Retry With Cash On Delivery
  </button>
</>)}


</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Orders; 
