import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Category, CustomerList,State, Orders, Product,City, Brand,Banner,CourierComp,PaymentList } from './web'
import styles from './index.module.scss'
import Sidebar from '../sidebar'
import Header from '../header'
import { Dashboard } from './web/dashboard'
import Navigation from '../navigation'
import 'react-notifications/lib/notifications.css';
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
export class Rootroutes extends Component {

 constructor(props) {
    super(props);
    this.state = {
      hide: false
    };
  }

  onHide = () => {
    this.setState(prevState => ({
      hide: !prevState.hide
    }));
  };

  
  render() {
    return (
      <div className={styles.root}>
        <Header/>
        <div className={styles.container}>
        <div className={`${styles.sidebar} ${this.state.hide&&styles.hide} `}>
        <Sidebar/>
        </div>
        <div className={`${styles.sideIcon} pointer`}>
          {!this.state.hide?<BsArrowLeftSquareFill onClick={this.onHide} size={"2rem"} color='blue'/>:
          <BsArrowRightSquareFill onClick={this.onHide} size={"2rem"} color='blue' />}
          </div>
          
        <div className={styles.main}>
         <Navigation/>
        <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/category/*' element={<Category/>} />
            <Route path='/order/*' element={<Orders/>} />
            <Route path='/state/*' element={<State/>} />
            <Route path='/brand/*' element={<Brand/>} />
            <Route path='/banner/*' element={<Banner/>} />
            <Route path='/city/*' element={<City/>} />
            <Route path='/product/*' element={<Product/>} />
            <Route path='/courier/*' element={<CourierComp/>} />
            
            <Route path='/customer/*' element={<CustomerList/>} />
            <Route path='/payment/*' element={<PaymentList/>} />
            <Route path='/order/*' element={<Orders/>} />
            
        </Routes>
        </div>
        </div>
      </div>
    )
  }
}

export default Rootroutes
