import React, { Component } from 'react'
import styles from './index.module.scss'
import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md";
import { RiDashboard3Fill } from 'react-icons/ri';
import { FaAngleDown, FaAngleRight, FaStoreAlt } from "react-icons/fa";
import { SiGooglestreetview } from "react-icons/si";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoWalletSharp } from "react-icons/io5";
import { FaAlignRight } from "react-icons/fa";
import { deleteCookie } from '../services/cookie';

export class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // category: false
    }
  }

  dropdown = (name) => {
    this.setState({
      [name]: !(this.state[name])
    })
  }

logout = () => {
  const confirmed = window.confirm("Are you sure you want to log out?");
  if (!confirmed) return;

  // Delete the cookie
  deleteCookie('token');

  // Optional: show alert after logout
  alert("Logged out successfully");

  // Refresh the page
  window.location.reload();
};


  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.dashboard}>
          <RiDashboard3Fill color='white' size={"1.5rem"} />
          <Link to={'/'} className={styles.link}> Dashboard</Link>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("order") }}>
            <div>
              <FaAlignRight size={'1.2rem'} />
              Orders
            </div>
            <FaAngleRight className={this.state.category && styles.hide} />
            <FaAngleDown className={!this.state.category && styles.hide} />
          </div>
          <div className={`${!this.state.order && styles.hide} ${styles.links}`}>
            <Link to={'/order'} className={styles.link}>All Orders</Link>
            <Link to={'/order/orderByStatus/pending'} className={styles.link}>Pending Orders</Link>
            <Link to={'/order/orderByStatus/shipped'} className={styles.link}>Shipping Orders</Link>
            <Link to={'/order/orderByStatus/delivered'} className={styles.link}>Delivered Orders</Link>
            <Link to={'/order/orderByStatus/cancelled'} className={styles.link}>Cancelled Orders</Link>
            
          </div>
        </div>

<div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("category") }}>
            <div>
              <FaAlignRight size={'1.2rem'} />
              Category
            </div>
            <FaAngleRight className={this.state.category && styles.hide} />
            <FaAngleDown className={!this.state.category && styles.hide} />
          </div>
          <div className={`${!this.state.category && styles.hide} ${styles.links}`}>
            <Link to={'/category/list'} className={styles.link}>All Category</Link>
            <Link to={'/category/addCategory'} className={styles.link}>Add Category</Link>
            <Link to={'/category/addSubCategory'} className={styles.link}>Add SubCategory</Link>
            <Link to={'/category/addChildCategory'} className={styles.link}>Add ChildCategory</Link>
          </div>
        </div>
        
        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("product") }}>
            <div>
              <FaStoreAlt size={'1.2rem'} />
              Products
            </div>
            <FaAngleRight className={this.state.product && styles.hide} />
            <FaAngleDown className={!this.state.product && styles.hide} />
          </div>
          <div className={`${!this.state.product && styles.hide} ${styles.links}`}>
            <Link to={'/product/productList'} className={styles.link}>All Products</Link>
            <Link to={'/product/addProduct'} className={styles.link}>Add Product</Link>
            <Link to={'/product/add-more-image'} className={styles.link}>Add More Image</Link>
          </div>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("brand") }}>
            <div>
              <MdLocationOn size={'1.2rem'} />
              Brand
            </div>
            <FaAngleRight className={this.state.brand && styles.hide} />
            <FaAngleDown className={!this.state.brand && styles.hide} />
          </div>
          <div className={`${!this.state.brand && styles.hide} ${styles.links}`}>
            <Link to={'/brand/brand-list'} className={styles.link}>All Brand</Link>
            <Link to={'/brand/add-brand'} className={styles.link}>Add Brand</Link>
          </div>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("state") }}>
            <div>
              <MdLocationOn size={'1.2rem'} />
              State
            </div>
            <FaAngleRight className={this.state.state && styles.hide} />
            <FaAngleDown className={!this.state.state && styles.hide} />
          </div>
          <div className={`${!this.state.state && styles.hide} ${styles.links}`}>
            <Link to={'/state/state-list'} className={styles.link}>All States</Link>
            <Link to={'/state/add-state'} className={styles.link}>Add State</Link>
          </div>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("city") }}>
            <div>
              <SiGooglestreetview size={'1.2rem'} />
              City
            </div>
            <FaAngleDown className={!this.state.city && styles.hide} />
            <FaAngleRight className={this.state.city && styles.hide} />
          </div>
          <div className={`${!this.state.city && styles.hide} ${styles.links}`}>
            <Link to={'/city/city-list'} className={styles.link}>All citys</Link>
            <Link to={'/city/add-city'} className={styles.link}>Add city</Link>
          </div>
        </div>

        
        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("banner") }}>
            <div>
              <SiGooglestreetview size={'1.2rem'} />
              Banner
            </div>
            <FaAngleDown className={!this.state.banner && styles.hide} />
            <FaAngleRight className={this.state.banner && styles.hide} />
          </div>
          <div className={`${!this.state.banner && styles.hide} ${styles.links}`}>
            <Link to={'/banner'} className={styles.link}>Banners</Link>
            <Link to={'/banner/add'} className={styles.link}>Add Banners</Link>
           
          </div>
        </div>

         <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("courier") }}>
            <div>
              <SiGooglestreetview size={'1.2rem'} />
              Courier
            </div>
            <FaAngleDown className={!this.state.courier && styles.hide} />
            <FaAngleRight className={this.state.courier && styles.hide} />
          </div>
          <div className={`${!this.state.courier && styles.hide} ${styles.links}`}>
            <Link to={'/courier'} className={styles.link}>Courier</Link>
            <Link to={'/courier/courierPricing'} className={styles.link}>CourierPricing</Link>
           
          </div>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("customer") }}>
            <div>
              <FaPeopleRoof size={'1.2rem'} />
              Customers
            </div>
            <FaAngleDown className={!this.state.city && styles.hide} />
            <FaAngleRight className={this.state.city && styles.hide} />
          </div>
          <div className={`${!this.state.customer && styles.hide} ${styles.links}`}>
            <Link to={'/customer/CustomerList'} className={styles.link}>Customers List</Link>
          </div>
        </div>

        <div className={`${styles.dropdown} pointer`}>
          <div onClick={() => { this.dropdown("payment") }}>
            <div>
              <IoWalletSharp size={'1.2rem'} />
              Payments
            </div>
            <FaAngleRight className={this.state.payment && styles.hide} />
            <FaAngleDown className={!this.state.payment && styles.hide} />
          </div>
          <div className={`${!this.state.payment && styles.hide} ${styles.links}`}>
            <Link to={'/payment/PaymentList'} className={styles.link}>Payment List</Link>
          </div>
        </div>
        <div className={styles.logout}><button onClick={this.logout}>Logout</button></div>
      </div>
    )
  }
}

export default Sidebar
