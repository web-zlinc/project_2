var mongodb = require('mongodb');
var client = mongodb.MongoClient;
var connstr = 'mongodb://127.0.0.1:27017/supermarket';

var apiresult = require('../modules/apiresult');

var db;
client.connect(connstr, function(_error, _db){
    if(_error){
        console.log(_error);
    } else {
        db = _db;
    }
})
module.exports = {
    select: function(_collection, _condition, _cb){
        db.collection(_collection).find(_condition || {}).toArray(function(error, result){
            _cb(apiresult(error ? false : true, error || result));
        })
    },
    insert : function(_collection, _data, _cb){
        db.collection(_collection).insert(_data, function(error, result){
            _cb(apiresult(error ? false : true, error || result));
        })
    },
    update: function(_collection,_condition ,_updata,_cb){
        console.log(_condition);
        db.collection(_collection).update(_condition,{$set:_updata},function(error, result){
            _cb(apiresult(error ? false : true, error || result));
        })
    },
    delete: function(_collection, _condition, _cb){
        db.collection(_collection).remove(_condition,function(error, result){
            _cb(apiresult(error ? false : true, error || result));
        })
    }
}