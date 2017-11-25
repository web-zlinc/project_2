// 根文件
var express = require('express');
var app = express();

var bp = require('body-parser');
app.use(bp.urlencoded({extended: false}));

var user = require('./user');
var product = require('./product');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") {
        res.sendStatus(200);/*让options请求快速返回*/
    } else{
        next();
    }
});

app.user(express.static(path.join(__dirname, '/')))

module.exports = {
    start: function(_port){
        user.users(app);
        product.pro(app);

        app.listen(_port);
    }
}