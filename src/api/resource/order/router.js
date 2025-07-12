const express=require('express');
const routes = require('./controller');
const  {localstrategy} = require('../../../middleaware/strategy');


const router=express.Router();

router.route('/create').post(routes.create);
router.route('/list').get(routes.list);
router.route('/update').put(routes.update);
router.route('/getById').get(routes.getById);
router.route('/getOrdersByCustomer').get(routes.getOrdersByCustomer);
router.route('/cancelOrder').delete(routes.cancelOrder);
router.route('/count').get(routes.count);
router.route('/export').get(routes.export);
router.route('/orderByStatus').get(routes.orderByStatus);


//  payments

router.route('/getAllPayments').get(routes.getAllPayments)
router.route('/webhook').post( express.raw({ type: 'application/json' }),routes.paymentSuccess);
router.route('/retryStripePayment').post(routes.retryStripePayment);
router.route('/retryCodPayment').post(routes.retryCodPayment);
module.exports=router;
