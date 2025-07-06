import React, { Component } from 'react'
import styles from './index.module.scss'
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { productApi } from '../../../../services/productApi';
import { brandApi } from '../../../../services/brandApi';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import swal from 'sweetalert';
import {formatDate} from '../../../../services/formatDate';

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
      brand:""
    }
  }
   formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
 getProductList = () => {
  this.setState({ loading: true });
  productApi.list()
    .then(data => {
      if (data) {
        this.setState({ list: data.list });
      }
    })
    .catch(err => {
      console.error("Failed to fetch product list:", err);
      NotificationManager.error("Failed to fetch products");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

handleDelete = (id) => {
  swal({
    title: "Are you sure?",
    text: "Are you sure that you want to delete this product?",
    icon: "warning",
    dangerMode: true,
  })
    .then(willDelete => {
      if (willDelete) {
        this.setState({ loading: true });
        productApi.delete(id)
          .then(data => {
            if (data) {
              NotificationManager.success("Successfully deleted product");
              this.getProductList(); // refresh list
            }
          })
          .catch(err => {
            console.error("Failed to delete product:", err);
            NotificationManager.error("Failed to delete product");
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      }
    })
    .catch(err => {
      console.error("Delete dialog error:", err);
      NotificationManager.error("Something went wrong");
    });
}


  componentDidMount() {
    this.getProductList();
  }

  render() {
    const { list, loading } = this.state;
    if (loading) {
      return <Loader />
    }
    return (
      <div className={styles.list}>

        <div className={styles.navigate}>
          <Link to={'/product/addProduct'}> <button className='pointer'>Add</button></Link>
        </div>

       {/* <div className={styles.find}>
          <div className={styles.select}>
            <Select />
          </div>
          <div className={styles.searchBtn}>
            <button>Search</button>
          </div>
          <div className={styles.viewBtn}>
            <button>ViewAll</button>
          </div>
        </div>*/}

        <div className={styles.productList}>
          <h3>All  Products</h3>
          <table>
            <thead>
              <th>Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Child Category</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Cost</th>
              <th>SellerPrice</th>
              <th>Discount</th>
              <th>NetPrice</th>
              <th>Profit</th>
              
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </thead>
            <tbody>
              {
                list.map((data) => {
                  return (
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td><img src={data.photo} alt="" /></td>
                      <td>{data.name}</td>
                      <td>{data.category}</td>
                      <td>{data.subCategory}</td>
                      <td>{data.childCategory}</td>
                      
                      <td>{data?.brand}</td>
                      <td>{data.stock}</td>
                      <td>{this.formatPrice(data.buyerPrice)}</td>
                      <td>{this.formatPrice(data.price)}</td>
                      
                      <td>{data.discount}</td>
                      <td>{this.formatPrice(data.netPrice)}</td>
                      <td>{data.buyerPrice==0?(`- ${this.formatPrice(data.netPrice)}`):this.formatPrice(data.netPrice - data.buyerPrice)}</td>
                      
                      <td>{data.status ? "Active" : "InActive"}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td className="pointer">
                        <Link to={`/product/editProduct/${data.id}`}><BiSolidEdit /></Link>
                        <RiDeleteBinLine onClick={() => { this.handleDelete(data.id) }} />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default List
