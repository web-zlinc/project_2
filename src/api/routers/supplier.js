// 供应商
module.exprorts={
    sup:function(app){
        app.post('/supplier',function(req,res){
            res.send("supplier");
        })
    }
}