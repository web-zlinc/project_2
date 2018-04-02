var db = require('../db/dbhelper');
module.exports = {
    register: function(app) {
            // 收货
        app.get('/purchase/take_goods', function(req, res) {
            db.mongodb.select('take_goods', {}, function(result) {
                res.send(result);
            })
        })
        app.post('/purchase/take_goods', function(req, res) {
                if (req.body.g_name) {
                    var sel = req.body.g_name;
                    db.mongodb.select('take_goods', {
                        "$or": [{
                            r_goods: sel
                        }, {
                            s_merchant: sel
                        }]
                    }, function(result) {
                        res.send(result);
                    })
                } else if (req.body.products) {
                    var products = JSON.parse(req.body.products);
                    var beforedate = db.mongodb.select('take_goods', {
                        gid: products.gid
                    }, function(resu) {
                        db.mongodb.update('take_goods', resu.data[0], products, function(result) {
                            res.send(result);
                        })
                    });
                } else if (req.body.addproducts) {
                    var products = JSON.parse(req.body.addproducts);
                    db.mongodb.insert('take_goods', products, function(result) {
                        res.send(result);
                    })
                } else if (req.body.rebData) {
                    var products = JSON.parse(req.body.rebData);
                    db.mongodb.insert('return_goods', products, function(result) {
                        res.send(result);
                    })
                    console.log(req.body)
                    // db.mongodb.update('take_goods',{gid:req.body.gid},{real_qty:req.body.r_qty},function(res){

                    // })
                }
            })
            // 退货
        app.get('/purchase/return_goods', function(req, res) {
            db.mongodb.select('return_goods', {}, function(result) {
                res.send(result);
            })
        })
        app.post('/purchase/return_goods', function(req, res) {
            if (req.body.g_name) {
                var sel = req.body.g_name;
                db.mongodb.select('return_goods', {
                    "$or": [{
                        r_goods: sel
                    }, {
                        rid: sel
                    }]
                }, function(result) {
                    res.send(result);
                })
            } else if (req.body.products) {
                var products = JSON.parse(req.body.products);
                var beforedate = db.mongodb.select('return_goods', {
                    rid: products.rid
                }, function(resu) {
                    db.mongodb.update('return_goods', resu.data[0], products, function(result) {
                        res.send(result);
                    })
                });
            }
            // else if(req.body.r_qty){
            //     db.mongodb.update('take_goods',{gid:req.body.gid},{real_qty:req.body.r_qty},function(result){
            //     })
            // }
        })
        app.post('/repertory', function(req, res) {
            if (req.body.enter_id) {
                db.mongodb.select('repertory', {
                    gid: req.body.enter_id
                }, function(resu) {
                    var new_qty = resu.data[0].gqty * 1 + Number(req.body.gqty);
                    db.mongodb.update('repertory', {
                        gid: req.body.enter_id
                    }, {
                        gqty: new_qty
                    }, function(result) {
                        res.send(result);
                    })
                })
            } else if (req.body.g_id) {
                var sel = req.body.g_id;
                db.mongodb.delete('take_goods', {
                    gid: sel
                }, function(result) {
                    res.send(result);
                })
            }
        })
    }
}