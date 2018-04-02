var db = require('../db/dbhelper');

module.exports = {
    register:function(app){
        //生成
        app.post('/generateorder',function(req,res){
            var products = req.body;
            var date = new Date()
            var orderno = req.body.orderno;
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var dates = date.getDate();
            var hours = date.getHours();
            var min = date.getMinutes();
            //state:付款状态,1表示待支付,2已支付
            var day = year+'-'+month+"-"+dates+" "+hours+":"+min
            db.mongodb.insert('order',{orderno:orderno,details:products.detail,state:'1',date:day,num:products.total_num,price:products.total_price},function(result){
                res.send(result);
            })
        }),
        //获取订单
        app.post('/getorder',function(req,res){
            var orderno = (req.body.orderno).toString();
            db.mongodb.select('order',{orderno:orderno},function(result){
                res.send(result.data);
            })
        })
        //修改某个订单的值
        app.post('/changeorder',function(req,res){
            console.log(req.body);
            db.mongodb.update('order',{orderno:req.body.orderno},{state:'2'},function(result){
                res.send(result);
            })
        })
    }
}