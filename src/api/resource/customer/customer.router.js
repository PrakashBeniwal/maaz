const express=require('express');
const {localstrategy} = require('../../../middleaware/strategy');
const { validate, schema } = require('../../../middleaware/validator');
const controller = require('./customer.controller');


const router=express.Router();

router.route("/list").get(controller.list);
router.route("/delete").post(localstrategy, controller.delete);

router.route("/getUserDetailsByid").get(controller.getUserDetailsByid);
router.route("/updateUser").put(controller.updateUser);
router.route("/getAddress").get(controller.getAddress);
router.route("/getCheckoutAddress").get(controller.getCheckoutAddress);

router.route("/updateAddress").put(controller.updateAddress);

module.exports=router;
