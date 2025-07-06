const express=require('express');
const controller = require('./area.controller');


const router=express.Router();

router.route("/list").get(controller.list);
router.route("/create").post(controller.create);
router.route("/update").post(controller.update);
router.route("/delete").post(controller.delete);
router.route("/getCitiesBySateId").get(controller.getCitiesBySateId);

module.exports=router;
