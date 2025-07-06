const express=require('express');
const controller = require('./category.controller');


const router=express.Router();

// category
router.route("/mainList").get(controller.mainList);
router.route("/createMain").post(controller.createMain);
router.route("/deleteMain").post(controller.deleteMain);
router.route("/updateMain").post(controller.updateMain);
router.route("/allCategories").get(controller.allCategories);

// subcategory
router.route("/subList").get(controller.subList);
router.route("/createSub").post(controller.createSub);
router.route("/deleteSub").post(controller.deleteSub);
router.route("/updateSub").post(controller.updateSub);


// childcategory
router.route("/childList").get(controller.childList);
router.route("/createChild").post(controller.createChild);
router.route("/deleteChild").post(controller.deleteChild);
router.route("/updateChild").post(controller.updateChild);

// category by id

router.route("/subListById").post(controller.subListByMainCategory);
router.route("/childListById").post(controller.childListByMainCategory);

// all category
router.route("/listAllCategory").get(controller.listAllCategory);


module.exports=router;
