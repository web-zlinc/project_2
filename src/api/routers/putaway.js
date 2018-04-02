var db = require('../db/dbhelper');

// 使用Object方法需要先引入Mongodb模块
var mongodbObject = require('mongodb').ObjectId;
module.exports = {
    Putaway: function (app) {
        app.post('/ptw_select', function (req, res) {

            db.mongodb.select('putaway', req.body, function (result) {
                // console.log(req.body);
                res.send(result);
            })
        });

        app.post('/ptw_insert', function (req, res) {
            // var _name = req.body.name;
            // console.log(req.body)
            db.mongodb.insert('putaway', req.body, function (result) {
                res.send(result);
            })
        });

        app.post('/ptw_del', function (req, res) {
            // console.log(req.body)
            newObjectId = mongodbObject(req.body._id);
            db.mongodb.delete('putaway', {"_id": newObjectId}, function (result) {
                res.send(result);
            });
        });

        app.post('/ptw_update', function (req, res) {
            // console.log(req.body.gid,req.body);
            db.mongodb.update('putaway', { gid: req.body.gid }, req.body, function (result) {
                // console.log(req.body)
                res.send(result);
            })
        })
    }
}