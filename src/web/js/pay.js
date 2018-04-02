require(['config'],function(){
    require(['jquery','qrcode','global_eddie','socketio','bootstrap'],function(jq,qr,gl,io,bs){
        //路由接口
        var apiBaseUrl = gl.global.apiBaseUrl;

        var $num = $('.num');
        var $total = $('.total');
        var $search = $('#search');
        var $tbody = $('<tbody/>');
        var $table = $('#tab');
        var $p = $('<p/>');

        var $editClose = $('.editClose');

        var $edit = $('.edit');
        var $editIpt = $edit.find('input');
        var editSave = document.querySelector('.save');

        var arr = [];
        //扫码获取数据
        $search.on('change',function(){
            $.post(apiBaseUrl + 'products',{
                barcode:$search.val()},function(res){
                    if(!res.state){
                    $p.html('未找到任何记录');
                    $table.after($p);
                    return;
                    }
                    $p.remove();
                    console.log(res);
                    var data = res.data[0];
                    //默认数量为1
                    data.qty = 1;

                    //遍历判断数组内是否存在对面barcode
                    for(var i=0;i<arr.length;i++){
                        if(arr[i].gbarcode == $search.val()){
                            arr[i].qty++;
                            
                            $tbody.html(getHTML(arr));
                            $tbody.appendTo($table);
                            total();
                            return ;
                        }
                        if(arr[i].barcode == $search.val()){
                            return ;
                        }
                    }
                    //建立数组保存数据
                    arr.push(data);

                    //遍历数组生成html结构
                    var datalist = getHTML(arr)
                    $tbody.html(datalist);
                    $tbody.appendTo($table);

                    total();
            })
        })
        
    
        //点击结账发送请求,写入数据库
        $('#settle').click(function(){
            //生成订单号
            var orderno = new Date().getTime().toString();

            //建立对象保存订单明细
            var payDetail = {
                total_price:$total.html(),
                detail:JSON.stringify(arr),
                total_num:$num.html(),
                orderno:orderno,
            }

            //存入数据库的订单集合
            $.post(apiBaseUrl+'generateorder',payDetail,function(res){
            })

            //连接socket
            var socket = io.connect("ws://10.3.135.3:8800");
            socket.emit('order',payDetail);

            
            var qrcode = new QRCode('qrcode', {
                text: "http://10.3.135.3:1337/pay&order/order.html?orderno="+orderno,
                width: 160,
                height: 160,
                colorDark : '#000000',
                colorLight : '#ffffff',
                correctLevel : QRCode.CorrectLevel.H
            });
            
            socket.on('pay',function(message){
                var $qrcode = $('#qrcode');
                $qrcode.html(message.stats).css({
                    fontSize:20,
                    color:'#58bc58',
                });


                var obj = receipt(JSON.parse(payDetail.detail))

                $.post('http://10.3.135.63:81/print',{text:obj},function(res){
                    console.log(res);
                    $tbody.html(' ');
                })
            })
        })

        //获取编辑按钮
        $tbody.on('click','.btnChange',function(){
            autocenter();
            var $this = $(this);
            var $thisTr = $this.closest('tr')
            var idx = +$thisTr.attr('data-id');
            // console.log(idx);
            var len = $thisTr.children().length;
            for(var j=0;j<len-1;j++){
                $editIpt.eq(j).val($this.closest('tr').children().eq(j).text());
            }

            editSave.onclick = function(){
                var leng = $editIpt.length;
                for(var k=0;k<leng;k++){
                    $this.closest('tr').children().eq(k).text($editIpt.eq(k).val());
                }
                for(var i=0;i<arr.length;i++){
                    if(idx===i){
                        arr[idx].qty = +$this.closest('tr').children('.qty').text();
                    }
                }
                $edit.hide();
                total();
            }
        })

        //获取删除表格按钮
        $tbody.on('click','.btnClose',function(){
            var $this = $(this);
            var $thisTr = $this.closest('tr')
            $thisTr.remove();

            var idx = +$thisTr.attr('data-id');
            console.log(idx);
            arr.splice(idx,1);
            console.log(arr);
            total();
        });
        
        //编辑框关闭按钮
         $editClose.click(function(){
            $edit.hide();
        })

        //封装函数获取html结构
        function getHTML(datalist){
            return $.map(datalist,function(item,idx){
                    return `<tr data-id="${idx}">
                                <td>${item._id}</td>
                                <td>${item.gname}</td>
                                <td>${item.gtype}</td>
                                <td class="price">${item.gprice}</td>
                                <td class="qty">${item.qty}</td>
                                <td>${item.garea}</td>
                                <td>${item.gbarcode}</td>
                                <td><button class="btnChange btn btn-primary">修改</button><button class="btnClose btn btn-danger">删除</button></td>
                            </tr>`
            }).join('');
        }

        //封装函数获取总价和数量
        function total(){
            var totalNum = 0;
            var totalPrice = 0;
            //获取tbody的数量和价格,生成数量和总价
            for(var i=0;i<$tbody.children().length;i++){
                totalNum +=(+$tbody.children().eq(i).children('.qty').html());
                totalPrice += (+$tbody.children().eq(i).children('.price').html())*(+$tbody.children().eq(i).children('.qty').html());
            }
            $num.html(totalNum);
            $total.html(totalPrice.toFixed(2));
            $search.val('');
            $search.focus();
        }

          //打印小票模板
        function receipt(data){
            var cont =`胖友 超市收银系统  \n*********************************\n名称     金额     数量\n`; 
            data.forEach(function(item,idx){
                cont+=`${item.gname}   ${item.gprice}   ${item.qty}\n`   
            }); 
            cont+=`总数量: ${$num.html()}件\n总金额：${$total.html()}元\n买单时间：2017-11-28 10:53:19\n*************************************\n`;
            return cont;
        }

        //编辑框居中显示
        function autocenter(){
                $edit.show();
                var left = (window.innerWidth - $edit.outerWidth())/2;
                var top = (window.innerHeight - $edit.outerHeight())/2;
                $edit.css({
                    left:left,
                    top:top
                })  
        }

        
    })
})