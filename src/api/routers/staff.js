var db = require('../db/dbhelper');
var data;
module.exports = {
    register: function(app){
        app.post('/seeks', function(req, res){
            db.mongodb.select('staff',req.body, function(result){
                data=result.data;
                res.send(data);
            })
        });
        app.post('/page',function(req,res){
            var item=req.body;

            var obj={
                dt:data.slice((item.pageno-1)*item.qty,(item.pageno-1)*item.qty+item.qty*1),
                total:data.length
            }
            res.send(obj);
        });
        app.get('/dels',function(req,res){
            db.mongodb.delete('staff',req.query,function(resl){
                res.send(resl);
            })
        })
        app.get('/seeks',function(req,res){
            db.mongodb.select('staff',req.query,function(resl){
                res.send(resl.data);
            })
        })
        app.get('/edis',function(req,res){
            var item=req.query;
            console.log(item);
            db.mongodb.update('staff',{num:item.num},{name:item.name,phone:item.phone,position:item.position},function(resl){
                res.send(resl.data);
            })
        })
        app.get('/adds',function(req,res){
            db.mongodb.select('staff',{num:req.query.num}, function(result){
                console.log(result);
                if(result.data.length===0){
                    db.mongodb.insert('staff',req.query, function(result){
                        res.send(result.data);
                    })  
                }else{
                    res.send('false');
                }
                
            })
        })
    }
}