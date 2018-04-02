
// 后端供货商js代码
var apiresult = require('../modules/apiresult.js');
var db = require('../db/dbhelper');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;
// 供应商
module.exports={
    sup:function(app){
        app.post('/supplier',function(req,res){
            // 从数据库拿数据
            db.mongodb.select('supplier',{},function(result){
                // 总共有多少个文档
                var length = result.data.length;//24
                // 前端要设置每页要放的数量
                var qty = req.body.qty;//10
                var pageNo = req.body.pageNo;//开始是1
                // 要设几条分页呢
                var page = Math.ceil(length/qty);//3

                var resArr = {
                    data:result.data.slice((pageNo-1)*qty,qty*pageNo),
                    total:length
                }
                if(resArr.data.length != 0 ){
                    res.send(resArr);
                    
                }
            })
        })

        // 新增
        app.post('/add',function(req,res){
            db.mongodb.insert('supplier',req.body,function(result){
                res.send(result);
            })

        })
        // 删除
        app.post('/del',function(req,res){
            db.mongodb.delete('supplier',req.body,function(result){
                res.send(result);
            })

        })
        // 修改
        app.post('/change',function(req,res){

            db.mongodb.update('supplier',{id : req.body.id},req.body,function(result){
                res.send(result);
            })
        })
        // 查找
        app.post('/search',function(req,res){
            var val = req.body.name;
            // 查找只要包含输入的值即可
            // var reg = new RegExp("(^(?=.*("+val+")))");
             var reg = eval("/(^(?=.*("+val+")))/");
            db.mongodb.select('supplier',{name:reg},function(result){
                res.send(result);
            })
        })
        // 查找id是否已存在
        app.post('/getId',function(req,res){

            db.mongodb.select('supplier',req.body,function(result){
                if(result.data.length == 0){
                    // var token = jwt.sign({id:req.body.id},'suibian',{expiresIn:3000});
                    res.send(apiresult(true));
                    
                }else{
                    res.send(apiresult(false));
                }
                
            })
        })

        // app.post('/search',function(req,res){
        //     var obj = req.body;//{}
        //     var val = obj.name;//输入框中输入的值
        //     var reg = eval("/(^(?=.*("+val+")))/");//对输入的值正则化
        //     var getAttr = [];
            
        //     for(let attr in obj){
        //         getAttr.push(attr);
        //     }
        //     // console.log(getAttr)
        //     var getData = [];
            // for(let i=0;i<getAttr.length;i++){
            //     var Data = {};
            //     Data[getAttr[i]] = reg;
            //     // var _d = {getAttr[i]:reg};
            //     // console.log(getData)
            //     db.mongodb.select('supplier',Data,function(result){
            //         if(result.data.length>0){
            //             getData.push(result);
            //         }
            //     console.log(getData)
            //     })
            // }
             // console.log(getData)
             // 
              
              
              
              
             // 
            // getAttr.map(function(item){
            //     var Data = {};
            //     Data[item] = reg;
            //     console.log(Data)
            //     db.mongodb.select('supplier',Data,function(result){
            //         if(result.data.length>0){
            //             getData.push(result);
            //         }
            //         console.log(getData)
            //     })

            // })
            //         res.send(getData);
        // });
    }   
}

