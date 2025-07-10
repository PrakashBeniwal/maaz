const express=require('express');
const route = require('./product.controller');


const router=express.Router();

router.route("/list").get(route.list);
router.route("/create").post(route.create);
router.route("/bulkCreate").post(route.bulkCreate);
router.route("/update").post(route.update);
router.route("/delete").delete(route.delete);
router.route("/deletePhotoById").delete(route.deletePhotoById);
router.route("/getProductById").get(route.getProductById);
router.route("/getAllPhotos").get(route.getAllPhotos);
router.route("/uploadImg").post(route.addMoreImg);

// images
router.route("/uploadImg").get(route.uploadImg);
router.route("/getImg").get(route.getImg);
router.route("/deleteImg").put(route.deleteImg);



// frontend
router.route("/getProductsByChildCategorySlug").get(route.getProductsByChildCategorySlug);
router.route("/getProductsBySubCategorySlug").get(route.getProductsBySubCategorySlug);

router.route("/getProductBySlug").get(route.getProductBySlug);                                 
router.route("/getRecentProducts").get(route.getRecentProducts);                                 
router.route("/getDiscountedProducts").get(route.getDiscountedProducts); 
router.route("/search").get(route.search);                                 
                                


module.exports=router;
