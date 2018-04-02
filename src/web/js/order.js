require(['config'],function(){
    require(['jquery','qrcode','global_eddie','socketio'],function(jq,qr,gl,io){

        var apiBaseUrl = gl.global.apiBaseUrl;

        var orderno = window.location.search;
        orderno = orderno.slice(1).split('=');

        var arrOrderno = {};
        arrOrderno[orderno[0]] = orderno[1];

        //页面刷新连接socket.io
        var socket = io.connect("ws://10.3.135.3:8800");
        
        if(arrOrderno.orderno == undefined){
            return;
        }
        $.post(apiBaseUrl +'getorder',arrOrderno,function(res){
            var order = res[0];
            console.log(order);
                
            var $table = $('table')
            var $tbody = $('<tbody/>');

            var $num = $('.num');
            var $total = $('.total');

            $num.html(order.num);
            $total.html(order.price);

            var datalist = getHTML(JSON.parse(order.details));
            $tbody.html(datalist);
            $tbody.appendTo($table);
                

            $('#order').click(function(){
                // socket.emit('success',{stats:"支付成功"});
                // $('body').html('你共支付了' + $('.total').html() + '元').css({
                //     fontSize:24,
                //     color:'#58bc58',
                //     marginLeft:'43%',
                //     marginTop:100,
                // });

                //修改状态
                order.state = '2';

                console.log(order);
                
                $.post(apiBaseUrl + 'changeorder',order,function(res){
                    if(res.state){
                        socket.emit('success',{stats:"支付成功"});
                        $('body').html('你共支付了' + $('.total').html() + '元').css({
                            fontSize:24,
                            color:'#58bc58',
                            marginLeft:'38%',
                            marginTop:100,
                        });
                    }
                })
                
            });




        });


        //封装函数获取html结构
        function getHTML(datalist){
            return $.map(datalist,function(item,idx){
                    return `<tr data-id="${idx}">
                                <td>${item._id}</td>
                                <td>${item.gname}</td>
                                <td class="price">${item.gprice}</td>
                                <td class="qty">${item.gqty}</td>
                                <td>${item.gbarcode}</td>
                            </tr>`
            }).join('');
        };

        var wd = document.documentElement.clientWidth*window.devicePixelRatio/10;
        // document.getElementsByTagName("html")[0].style.fontSize = wd + "px";
        var scale = 1/window.devicePixelRatio;
        var mstr = 'initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no';
        document.getElementById("vp").content = mstr;

        
    })
})