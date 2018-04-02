var express = require('express');
var app = express();
var bp = require('body-parser');
// 张林冲
var userRouter = require('./user');
var memberRouter=require('./member');
var staffRouter=require('./staff');
// 陈重佑
var paymentRouter = require('./payment');
var productRouter = require('./product');
var socketRouter = require('./socket');

// mine
var purchaseRouter=require('./purchase');
// 引入供货商模块------杨珊
var supplierRouter = require('./supplier');
// 雷皓
var putAwayRouter = require('./putaway');
var repertoryRouter=require('./repertory');
module.exports = {
    start: function(_port){

        app.use(bp.urlencoded({extended: false}));

        app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By",' 3.2.1')
            if(req.method=="OPTIONS") {
              res.send(200);/*让options请求快速返回*/
            } else{
              next();
            }
        });
        
        userRouter.register(app);
        memberRouter.register(app);
        staffRouter.register(app);
        putAwayRouter.Putaway(app);
        repertoryRouter.Product(app);
        paymentRouter.register(app);
        productRouter.register(app);
        purchaseRouter.register(app);
        socketRouter.actions(app,express)
        supplierRouter.sup(app);
        
        app.listen(_port,function(){
            console.log("Running on http://192.168.22.130:83//");
        });
    }
}