var db = require('../db/dbhelper');

module.exports = {
    Product: function (app) {
        app.post('/getproduct', function (req, res) {
            db.mongodb.select('repertory', req.body , function (result) {
                // console.log(req.body);
                res.send(result);
            })
        });

        app.post('/insertProduct', function (req, res) {
            // var _name = req.body.name;
            console.log(req.body)
            db.mongodb.insert('repertory', req.body , function (result) {
                res.send(result);
            })
        });

        app.post('/delProduct', function (req, res) {
            // console.log(req.body)
            db.mongodb.delete('repertory', req.body , function (result) {
                res.send(result);
            });
        });

        app.post('/updataProduct', function (req, res) {
            // console.log(req.body.gid,req.body);
            db.mongodb.update('repertory', {gid: req.body.gid} , req.body , function (result) {
                // console.log(req.body)
                res.send(result);
            })
        })
    }
}