// 用户
var jwt = requery('jsonwebtoken');
var mongodb = require('mongodb');
module.exports = {
    users: function(app) {
        app.post('/login', function(req, res) {
            //连接数据库
            var server = new mongodb.Server('localhost', 27017, {
                auto_reconnect: true
            });
            var db = new mongodb.Db('retails', server, {
                safe: true
            });
            db.open(function(err, collection) {
                if (err) {
                    console.log('连接失败！');
                } else {
                    console.log('连接成功！');
                    var userInfo = {
                        username: req.body.username
                    }
                    var token = jwt.sign(userInfo, 'secret', {
                        'expiresIn': 1440
                    })
                    res.send(token);
                }
            })
        })
        app.post('/register', function() {
            res.send('register');
        })
    }
}