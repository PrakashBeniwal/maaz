import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../list/index.module.scss';
import { FaEye } from 'react-icons/fa';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import {orderApi} from '../../../../services/order'
import {Link} from 'react-router-dom';
import {formatDate} from '../../../../services/formatDate';
import { useParams } from 'react-router-dom';

const OrderByStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]=useState(false);

const { status } = useParams();
const fetchOrders = async () => {
     setLoading(true);
      try {
        const res = await orderApi.orderByStatus(status);
        console.log(res);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally{
     setLoading(false);
      }
    };
    
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
    
  useEffect(() => {
    

    fetchOrders();
  }, [status]);

     if (loading) {
      return <Loader />
      }

    if(orders?.length<1){
    return(
    <div>
    There is no orders
    </div>
    )
    }
      
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Orders</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Payment Method</th>
            <th>Order Date</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.number}</td>
              <td>{order.paymentMethod=="cod"?"Cash On Delivery":order.paymentMethod?.toUpperCase() || 'N/A'}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatDate(order.deliveryDate)|| '—'}</td>
              <td>{order.status}</td>
              <td>{formatPrice(order.grandTotal)}</td>
              <td className={styles.actions}>
               <Link to={`/order/view`} state={{ orderId: order.id }} > <FaEye title="View" className={styles.icon} /></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderByStatus;

