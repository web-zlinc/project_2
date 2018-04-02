var jwt = require('jsonwebtoken');
var apiresult = require('../modules/apiresult');

var db = require('../db/dbhelper');
module.exports = {
    register: function(app){
        app.post('/login', function(req, res){
            db.mongodb.select('user',req.body, function(result){
                if(result.state && result.data.length > 0){
                    var item=result.data[0];
                    console.log(item);
                    var token = jwt.sign({username: req.body.username}, 'abc', {
                        expiresIn: 999
                    });
                    res.send(apiresult(true, {token: token,limit:item.limit}));
                } else {
                    res.send(apiresult(false, result.data));
                }
            })
        })
        app.post('/regis', function(req, res){
            db.mongodb.select('user',req.body, function(result){
                //先判断是否被注册
                if(result.data.length===0){
                    db.mongodb.insert('user',req.body, function(result){
                        res.send(apiresult(true));
                    })
                } else {
                    res.send(apiresult(false));
                }
            })
        })

        app.post("/index",function(req,res){
            var token = req.headers.authorization;
            console.log(req.headers)
           
            jwt.verify(token,"secret",function(error,result){
              
                if(error){
                    res.send(error);
                }else{
                    res.send(result);
                }
            })
        });
    }
}