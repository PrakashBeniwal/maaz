const API=process.env.REACT_APP_SERVER?process.env.REACT_APP_SERVER:"http://localhost:4000/api";
// const API=process.env.SERVER?process.env.SERVER:"http://localhost:4000/api";

const routes={

   //Authentication

    login: `${API}/admin/login`,
    resetPassword: `${API}/admin/resetPassword`,
    getOtp: `${API}/admin/getOtp`,
    verifyOtp: `${API}/admin/verifyOtp`,
    forgetPassword: `${API}/admin/forgetPassword`,
    resetPassword: `${API}/admin/resetPassword`,

    
    //MainCategory

    createMainCategory:`${API}/category/createMain`,
    updateMainCategory:`${API}/category/updateMain`,
    deleteMainCategory:`${API}/category/deleteMain`,
    MainCategoryList:`${API}/category/mainList`,



    //SubCategory

    createSubCategory:`${API}/category/createSub`,
    updateSubCategory:`${API}/category/updateSub`,
    deleteSubCategory:`${API}/category/deleteSub`,
    subCategoryList:`${API}/category/subList`,

    //ChildCategory

    createChildCategory:`${API}/category/createChild`,
    updateChildCategory:`${API}/category/updateChild`,
    deleteChildCategory:`${API}/category/deleteChild`,
    ChildCategoryList:`${API}/category/ChildList`,
    
    // category by Id
    subCategoryListById:`${API}/category/subListById`,
    childCategoryListById:`${API}/category/childListById`,

    // all cat
    listAllCategory:`${API}/category/listAllCategory`,

      //state

      getstate:`${API}/state/list`,
      createstate:`${API}/state/create`,
      updatestate:`${API}/state/update`,
      deletestate:`${API}/state/delete`,


        //brand

        getbrandById:`${API}/brand/get`,
        getbrand:`${API}/brand/list`,
        createbrand:`${API}/brand/create`,
        updatebrand:`${API}/brand/update`,
        deletebrand:`${API}/brand/delete`,
  

      //city

      getcity:`${API}/city/list`,
      createcity:`${API}/city/create`,
      updatecity:`${API}/city/update`,
      deletecity:`${API}/city/delete`,
      getCitiesBySateId:`${API}/city/getCitiesBySateId?id=`,

      
      //customer
      customerList:`${API}/customer/list`,
      customerDelete:`${API}/customer/delete`,


        //product

        getProduct:`${API}/product/list`,
        createProduct:`${API}/product/create`,
        updateProduct:`${API}/product/update`,
        deleteProduct:`${API}/product/delete`,
        getProductById:`${API}/product/getProductById`,
       
        getAllPhotos:`${API}/product/getAllPhotos`,
        deletePhotoById:`${API}/product/deletePhotoById`,

        //Banner

        getBanner:`${API}/banner/list`,
        createBanner:`${API}/banner/create`,
        deleteBanner:`${API}/banner/delete?id=`,
        updateBanner:`${API}/banner/update?id=`,
        getBannerById:`${API}/banner/getById?id=`,


 //Courier

        getCourier:`${API}/courier/list`,
        createCourier:`${API}/courier/create`,
        deleteCourier:`${API}/courier/delete?id=`,
        updateCourier:`${API}/courier/update?id=`,
        getCourierById:`${API}/courier/getById?id=`,


   // courierPrice

   
        courierPriceList:`${API}/courierPrice/list`,
        courierPriceCreate:`${API}/courierPrice/create`,
        courierPriceUpdate:`${API}/courierPrice/update?id=`,
        courierPriceDelete:`${API}/courierPrice/delete?id=`,

        
// orders
     getAllOrders:`${API}/order/list`,
      getOrderById:`${API}/order/getById?id=`,
     updateOrder:`${API}/order/update`,
     getAllPayments:`${API}/order/getAllPayments`,
     orderCount:`${API}/order/count`,
    orderByStatus:`${API}/order/orderByStatus?status=`,
    orderExport:`${API}/order/export`,
        
        // images
 uploadImg:`${API}/product/uploadImg`,
        getImgUrl:`${API}/product/getImg`,
        deleteImg:`${API}/product/deleteImg`,

}

export{routes,API}
