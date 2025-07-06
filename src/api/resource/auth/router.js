const express=require('express');
const routes = require('./controller');
const  {verifyToken, localstrategy} = require('../../../middleaware/strategy');


const router=express.Router();

router.route('/register').post(routes.register);
router.route('/list').get(verifyToken,routes.list);
router.route('/login').post(localstrategy,routes.login)
router.route('/verifyOtp').post(routes.verifyOtp)
router.route('/resetPassword').post(routes.resetPassword)
router.route('/forgetPassword').post(routes.forgetPassword)
router.route('/resendOtp').post(routes.resendOtp)
router.route('/verifyEmail').post(routes.verifyEmail)


module.exports=router;
