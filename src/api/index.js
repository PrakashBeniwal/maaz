const express=require('express');
const auth = require('./resource/auth');
const category = require('./resource/category');
const product = require('./resource/product');
const customer = require('./resource/customer');
const state = require('./resource/state');
const city = require('./resource/city');
const brand = require('./resource/brand');
const banner = require('./resource/banner');
const courier = require('./resource/courier');
const courierPricing = require('./resource/courierPricing');
const order = require('./resource/order');
const admin = require('./resource/admin');

const restrouter=express.Router();

restrouter.use('/auth',auth)
restrouter.use('/customer',customer)
restrouter.use('/product',product)
restrouter.use('/category',category)
restrouter.use('/state',state)
restrouter.use('/city',city)
restrouter.use('/brand',brand)
restrouter.use('/banner',banner)
restrouter.use('/courier',courier)
restrouter.use('/courierPrice',courierPricing)
restrouter.use('/order',order)
restrouter.use('/admin',admin)





module.exports=restrouter;
