import React, { Component } from 'react';
import styles from './index.module.scss';
import { RiDeleteBinLine } from 'react-icons/ri';
import { customerApi } from '../../../services/customerApi';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../loading';
import swal from 'sweetalert';
import {formatDate} from '../../../services/formatDate';

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            list:[],
            loading:false
         }
    }

  getList = () => {
  this.setState(prev => ({ ...prev, loading: true }));

  customerApi
    .list()
    .then(response => {
    console.log(response)
      if (response && response.list) {
        this.setState({ list: response.list });
      }
    })
    .catch(error => {
      console.error('Error fetching customer list:', error);
    })
    .finally(() => {
      this.setState(prev => ({ ...prev, loading: false }));
    });
};


componentDidMount() { 
  this.getList()
 }

    // handleDelete=(id)=>{
    //   swal({
    //     title: "Are you sure?",
    //     text: "Are you sure that you want to delete this customer?",
    //     icon: "warning",
    //     dangerMode: true,
    //   })
    //     .then(willDelete => {
    //       if (willDelete) {
    //         this.setState({ loading: true })
    //         customerApi.delete({id})
    //         .then(list=>{
    //           if (list) {   
    //            this.getList();
    //         this.setState({ loading: false })
    //            NotificationManager.success("deleted successfully")
    //           }
    //         })
    //       }
    //     });
    // }
    render() { 
      if (this.state.loading) {
        return <Loader />
      }
        const {list}=this.state;
        return ( 
            <div>
          <div className={styles.list}>
            <h3>All  Customers</h3>
            <table>
              <thead>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date Joined</th>
                
              </thead>
              <tbody>
                {
                  list.map(data => {
                    return (
                      <tr key={data.id}>
                        <td>{data?.name}</td>
                        <td>{data?.phone}</td>
                        <td>{data?.email}</td>
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
 
export  {CustomerList};
