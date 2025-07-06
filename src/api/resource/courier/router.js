const express=require('express');
const routes = require('./controller');
const  {localstrategy} = require('../../../middleaware/strategy');


const router=express.Router();

router.route('/create').post(routes.create);
router.route('/list').get(routes.list);
router.route('/update').put(routes.update);
router.route('/delete').delete(routes.delete);
router.route('/getById').get(routes.getById);



module.exports=router;
