const express=require('express');
const routes = require('./controller');
const  {verifyToken, adminStrategy} = require('../../../middleaware/strategy');


const router=express.Router();

router.route('/login').post(adminStrategy,routes.login)
router.route('/verifyOtp').post(routes.verifyOtp)
router.route('/resetPassword').post(routes.resetPassword)
router.route('/forgetPassword').post(routes.forgetPassword)
router.route('/resendOtp').post(routes.resendOtp)
router.route('/verifyEmail').post(routes.verifyEmail)


module.exports=router;
