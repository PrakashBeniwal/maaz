import React, { Component } from 'react';
import styles from './index.module.scss';
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../loading';
import {orderApi} from '../../../services/order'
import {formatDate} from '../../../services/formatDate';

class PaymentList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            payments:[],
            loading:false
         }
    }

 fetchPayments = async () => {
     this.setState((prev)=>({...prev,loading:true}));
      try {
        const res = await orderApi.getAllPayments();
        this.setState({payments:res.data,loading:false})
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally{
     this.setState((prev)=>({...prev,loading:false}))
      }
    };

componentDidMount() { 
  this.fetchPayments()
 }
     
    render() { 
        const {payments,loading}=this.state;
        if (loading) {
      return <Loader />
      }
  
        return ( 
            <div>
          <div className={styles.list}>
            <h3>All  Payments</h3>
            <table>
              <thead>
                <th>Order Number</th>
                <th>Payment Method</th>
                <th>Amount</th>
                
                <th>GatewayPaymentId</th>
                <th>Status</th>
                <th>Payment Date</th>
                
              </thead>
              <tbody>
                {
                  payments?.map(data => {
                    return (
                      <tr key={data.id}>
                        <td>{data.order?.number}</td>
                        <td>{data.method=="cod"?"Cash On Delivery":data.method}</td>
                        <td>{data.amount}</td>
                        <td>{data.gatewayPaymentId||'-'}</td>
                        <td>{data.status}</td>
                        <td>{formatDate(data.createdAt)}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
            </div>
         );
    }
}
 
export  {PaymentList};
