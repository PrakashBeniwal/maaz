const express=require('express');
const controller = require('./brand.controller');


const router=express.Router();

router.route("/list").get(controller.list);
router.route("/create").post(controller.create);
router.route("/update").post(controller.update);
router.route("/delete").post(controller.delete);

module.exports=router;