
module.exports = {
    actions:function(app,express){
        var http = require('http').Server(app);

        var io = require('socket.io')(http);

        var path = require('path');

        app.use(express.static(path.join(__dirname,'/')));
        io.on('connection',function(client){
            client.on('order',function(_order){
                io.emit('result',_order);
            })

            client.on('success',function(stats){
                io.emit('pay',stats);
            })

        })

        http.listen(8800);    
    }
}