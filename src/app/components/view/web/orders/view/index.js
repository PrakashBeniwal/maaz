import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './index.module.scss';
import { useLocation } from 'react-router-dom';
import Loader from '../../../../../loading';
import { orderApi } from '../../../../services/order';
import { NotificationManager } from 'react-notifications';
import {formatDate} from '../../../../services/formatDate';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { orderId } = location.state || {};

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getById(orderId);
      setOrder(res.data);
      setStatus(res.data.status);
      setDeliveryDate(res.data.deliveryDate?.split('T')[0] || '');
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const data = {
        id: orderId,
        status,
        deliveryDate: deliveryDate || null,
      };
      const res = await orderApi.update(data);
      if (res.success) {
        NotificationManager.success(res?.mess);
        fetchOrder(); // refresh UI
      }
    } catch (err) {
      console.error('Error updating order:', err);
        NotificationManager.error("Error updating order");
    } finally {
      setLoading(false);
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 2
    }).format(price);
  };

   if (loading) {
      return <Loader />
      }

  return (
    <div className={styles.container}>
      <h2>Order Detail</h2>

      <div className={styles.header}>
        <p><strong>Order Number:</strong> {order?.number}</p>
        <p><strong>Order Date:</strong> {formatDate(order?.createdAt)}</p>
        <p>
          <strong>Delivery Date:</strong>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className={styles.dateInput}
          />
        </p>
        <p><strong>Payment Method:</strong> {order?.paymentMethod=="cod"?"Cash On Delivery":order?.paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong>
         <div className={styles.statusSection}>
  <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
    <option value="pending">Pending</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </select>
  <button onClick={handleStatusUpdate} disabled={loading} className={styles.updateBtn}>
    Update
  </button>
</div>

        </p>
      </div>

      <div className={styles.addressSection}>
        <h3>Shipping Address</h3>
        <p><strong>Address:</strong> {order?.address?.address}</p>
        <p><strong>City:</strong> {order?.address?.city?.name}</p>
        <p><strong>State:</strong> {order?.address?.city?.state?.name}</p>
        <p><strong>Postal Code:</strong> {order?.address?.postalCode}</p>
        <p><strong>Phone:</strong> {order?.address?.phone}</p>
      </div>

      <div className={styles.itemsSection}>
        <h3>Order Items</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.photo}
                    alt={item.name}
                    className={styles.productImage}
                  />
                </td>
                <td>{item.name}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{item.qty}</td>
                <td>{formatPrice(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summarySection}>
        <h3>Order Summary</h3>
        <p><strong>Subtotal:</strong> {formatPrice(order?.subTotal)}</p>
        <p><strong>Courier Cost:</strong> {formatPrice(order?.courierCost)}</p>
        <p><strong>Grand Total:</strong> {formatPrice(order?.grandTotal)}</p>
      </div>
    </div>
  );
};

export default OrderDetail;

