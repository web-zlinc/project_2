var db = require('../db/dbhelper');
var apiresult = require('../modules/apiresult');
module.exports = {
    register: function(app) {
        app.post('/products', function(req, res) {
            var barcode = req.body.barcode;
            db.mongodb.select('putaway', {
                gbarcode: barcode
            }, function(result) {
                if (result.state && result.data.length > 0) {
                    res.send(apiresult(true, result.data));
                } else {
                    res.send(apiresult(false, result.data));
                }
            })
        })
    }
    
}