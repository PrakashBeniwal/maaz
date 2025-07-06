import React, { Component } from 'react';
import styles from './index.module.scss';
import { orderApi } from '../../../services/order';
import { NotificationManager } from 'react-notifications';
import OrderExport from '../orders/export';

// Icons
import { AiOutlineHourglass, AiOutlineCheckCircle, 
AiOutlineCar, AiOutlineSmile, AiOutlineCloseCircle } from 'react-icons/ai';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {
        pending: 0,
        paid: 0,
        shipping: 0,
        delivered: 0,
        cancelled: 0,
      }
    };
  }

  getList = () => {
    orderApi.count()
      .then(list => {
        if (list) {
          this.setState({ list });
        }
      })
      .catch(err => {
        console.error('Error fetching order counts:', err);
        NotificationManager.error('Failed to load order counts');
      });
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    const { list } = this.state;

    return (
      <div>
        <div className={styles.orders}>
          <div className={styles.cards}>
            <div>
              <div>ORDER PENDING</div>
              <div>{list.pending}</div>
            </div>
            <AiOutlineHourglass size={32} color="#f0ad4e" />
          </div>
         {/* <div className={styles.cards}>
            <div>
              <div>ORDER PAID</div>
              <div>{list.paid}</div>
            </div>
            <AiOutlineCheckCircle size={32} color="#5cb85c" />
          </div>*/}
           <div className={styles.cards}>
            <div>
              <div>ORDER CANCELLED</div>
              <div>{list.cancelled}</div>
            </div>
            <AiOutlineCloseCircle size={32} color="#d9534f" />
          </div>
          <div className={styles.cards}>
            <div>
              <div>ORDER SHIPPING</div>
              <div>{list.shipping}</div>
            </div>
            <AiOutlineCar size={32} color="#5bc0de" />
          </div>
          <div className={styles.cards}>
            <div>
              <div>ORDER DELIVERED</div>
              <div>{list.delivered}</div>
            </div>
            <AiOutlineSmile size={32} color="#0275d8" />
          </div>
         
        </div>

        <OrderExport />
      </div>
    );
  }
}

export { Dashboard };

