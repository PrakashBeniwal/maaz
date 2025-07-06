'use strict';
const app=require('./src/index.js');
const serverless=require('serverless-http');
module.exports.hello = serverless(app);
