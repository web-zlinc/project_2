var db = require('../db/dbhelper');
var data;
module.exports = {
    register: function(app){
        app.post('/seek', function(req, res){
            db.mongodb.select('member',req.body, function(result){
                data=result.data;
                res.send(data);
            })
        });
        app.post('/pages',function(req,res){
            var item=req.body;
            var obj={
                dt:data.slice((item.pageno-1)*item.qty,(item.pageno-1)*item.qty+item.qty*1),
                total:data.length
            }
            console.log(obj);
            res.send(obj);
        });
        app.get('/del',function(req,res){
            db.mongodb.delete('member',req.query,function(resl){
                res.send(resl);
            })
        })
        app.get('/seek',function(req,res){
            db.mongodb.select('member',req.query,function(resl){
                res.send(resl.data);
            })
        })
        app.get('/edi',function(req,res){
            var item=req.query;
            console.log(item);
            db.mongodb.update('member',{num:item.num},{name:item.name,phone:item.phone},function(resl){
                res.send(resl.data);
            })
        })
        app.get('/add',function(req,res){
            db.mongodb.select('member',{num:req.query.num}, function(result){
                if(result.data.length===0){
                    db.mongodb.insert('member',req.query, function(result){
                        res.send(result.data);
                    })  
                }else{
                    res.send('false');
                }
                
            })
        })
    }
}