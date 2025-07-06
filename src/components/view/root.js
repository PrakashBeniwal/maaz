import React, { useState } from 'react'
import Header from '../header'
import Sidebar from '../sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Basket from '../basket'
import ProductCategory from './productCategory'
import HomePage from './home'
import AllProducts from './allProducts'
import ProductDetail from './productDetail'
import styles from './root.module.scss'
import Account from './account'
import Auth from './auth'
import PrivateRoute from '../services/PrivateRoute'
import Footer from '../Footer'
import Checkout from './checkout'
import { OrderFail, OrderSuccess } from './checkout/order'
// import RecentlyViewed from '../RecentlyViewed'
import Feature from '../shared/feature'
import AboutUs from './aboutUs'
import ContactUs from './contactUs'
import FAQ from './faq'
import ShippingReturns from './shipping'
import Terms from './terms'
import Privacy from './privacy'
import { useEffect } from 'react'
import ProductSubCategory from './productSubCategory'
import AppInitializer from '../../store/appInitializer'
// ScrollToTop component to ensure pages start at the top when navigated to
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const Root = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div>
    <AppInitializer/>
      <ScrollToTop />
      <Header />
      <div className={styles.layout}>
        <div className={`${styles.sidebar_container} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
          <Sidebar onCollapse={handleSidebarCollapse} />
        </div>
        <main className={styles.main_content}>
    
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/category/:categoryName" element={<ProductCategory />} />
              <Route path="/products/:categoryName" element={<AllProducts />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/category/:cat/:sub/:childCategory" element={<ProductCategory />} />
              <Route path="/category/:categoryName/:subcategory" element={<ProductSubCategory />} />
              
              {/* About and Info Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<ShippingReturns />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth Routes */}
              <Route path="/auth/*" element={<Auth />} />

              {/* Protected routes - require authentication */}
              <Route element={<PrivateRoute />}>
                <Route path='/account/*' element={<Account />} />
                <Route path='/checkout' element={<Checkout/>} />
                <Route path='/order-success' element={<OrderSuccess/>} />
                <Route path='/order-fail' element={<OrderFail/>} />

              </Route>
            </Routes>
          
        </main>
      </div>
      <Feature/>
      <Footer/>
    </div>
  )
}

export default Root
