import axios from "axios";

const API_URL =  process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : "http://localhost:4000/api";
const ROOT_URL = process.env.REACT_APP_ROOT_URL ? process.env.REACT_APP_ROOT_URL : "";

const Axios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": 'application/json',
        // "Access-Control-Allow-Origin": "*"
    }
})

const routes = {


   //Authentication

    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    resetPassword: `${API_URL}/auth/resetPassword`,
    getOtp: `${API_URL}/auth/getOtp`,
    verifyOtp: `${API_URL}/auth/verifyOtp`,
    resendOtp: `${API_URL}/auth/resendOtp`,
    forgetPassword: `${API_URL}/auth/forgetPassword`,
    resetPassword: `${API_URL}/auth/resetPassword`,
    verifyEmail: `${API_URL}/auth/verifyEmail`,

    // customer

    getUserDetailsByid: `${API_URL}/customer/getUserDetailsByid?id=`, 
    updateUser:`${API_URL}/customer/updateUser`,
    getAddress:`${API_URL}/customer/getAddress`,
    getCheckoutAddress:`${API_URL}/customer/getCheckoutAddress`,
    updateAddress:`${API_URL}/customer/updateAddress`,
    getCitiesBySateId:`${API_URL}/city/getCitiesBySateId`,
    getSate:`${API_URL}/state/getState`,

    
  //product api
  getProductsByChildCategorySlug: `${API_URL}/product/getProductsByChildCategorySlug?slug=`,
  getProductsBySubCategorySlug: `${API_URL}/product/getProductsBySubCategorySlug?slug=`,
  search:`${API_URL}/product/search`,

  
  getProductBySlug: `${API_URL}/product/getProductBySlug`,
  getRecentProducts: `${API_URL}/product/getRecentProducts`,
  getDiscountedProducts:`${API_URL}/product/getDiscountedProducts`,

  
  //order api
  createOrder: `${API_URL}/order/create`,
  GetOrderByUser: `${API_URL}/order/list`,
  getOrdersByCustomer:`${API_URL}/order/getOrdersByCustomer`,
  cancelOrder:`${API_URL}/order/cancelOrder`,
  retryStripePayment:`${API_URL}/order/retryStripePayment`,
  
  //Filter by category
  Categorylist:`${API_URL}/category/allCategories`,
  GetFilterByCategory: `${API_URL}/api/category/c`,

 // banner
 getBannerByPosition:`${API_URL}/banner/getBannerByPosition?position=`,


}

export { Axios, routes, API_URL, ROOT_URL };
