require(['config'], function() {
    require(['jquery', 'global'], function() {
        $.get(global.apiBaseUrl + 'purchase/take_goods', function(res) {
            showTr(res);
        })
        $('.search_btn').on('click', function() {
            $.post(global.apiBaseUrl + 'purchase/take_goods', {
                g_name: $('.search').val()
            }, function(res) {
                showTr(res);
            })
        });

        function showTr(res) {
                $('tbody').html('');
                var tr = '';
                var i = 0;
                res.data.map(function(item) {
                    i++;
                    tr += ` <tr data-id="${item.gid}">
                    <td><input type="checkbox" class="cbox"/></td> 
                    <td>${i}</td>
                    <td>${item.r_goods}</td>
                    <td>${item.barcode}</td>
                    <td>${item.rid}</td>
                    <td>${item.gtype}</td>
                    <td>${item.s_merchant}</td>
                    <td>${item.gqty}</td>
                    <td>${item.s_qty}</td>
                    <td>${item.real_qty}</td>
                    <td>${item.stock_price}</td>
                    <td>${item.real_qty*item.stock_price}</td>
                    <td>${item.t_date}</td>
                    <td>${item.t_pay}</td>
                    <td><button class="reback">退货</button></td>
                </tr> `;
                }).join('');
                
                $('tbody').append(tr);
                // 退货 
                $('.reback').on('click', function() {
                        let $div = $('<div class="popup well well-lg"/>').css({
                            'position': 'absolute',
                            'width': '400',
                            'margin': 'auto'
                        }).append($('<h3/>')).append($(`<form/>`)).html(`<div class="form-group">
                            <label for="qty">请填写退货商品数量：</label>
                            <input type="text" class="form-control" id="qty" placeholder="数量不能超出收货的数量">
                            </div>
                            <div class="form-group">
                            <label for="r_date">请填写退货日期：</label>
                            <input type="text" class="form-control" id="r_date" placeholder="date">
                            </div>
                        <input class="btn btn-default save" type="button" value="保存" disabled/>
                        <input class="btn btn-default cancel" type="button" value="取消">`);
                        $('body').append($div);

                        function leftTop(obj) {
                            var screenWidth = $(window).width();
                            var screenHeight = $(window).height();
                            var scrolltop = $(document).scrollTop();
                            var scrollleft = $(document).scrollLeft();
                            var objLeft = (screenWidth - obj.width()) / 2 + scrollleft;
                            var objTop = (screenHeight - obj.height()) / 2 + scrolltop;
                            obj.stop().animate({
                                top: objTop + 'px',
                                left: objLeft + 'px'
                            }, 500)
                        }

                        function center(obj) {
                            leftTop(obj);
                            //浏览器有滚动条时的操作、
                            $(window).scroll(function() {
                                leftTop(obj);
                            });
                            $(window).resize(function() {
                                leftTop(obj);
                            })
                        }

                        center($div);
                        var currentTr=$(this).parents('tr');
                        var gid=currentTr.attr('data-id');
                        var s_qty=currentTr.find('td').eq(9).html();
                         var $span = $('<span/>').css({
                                'color': "red",
                                'position': 'absolute',
                                'top': '56px',
                                'left': '230px'
                            }).html('数量超出范围！');
                        $('#qty').on('change',function(){
                             var num=$('#qty').val();
                            if (num*1> Number(s_qty)) {
                                $span.appendTo('.popup');
                                $('#qty')[0].focus();
                                $('.save').attr('disabled');
                            }
                            else{
                                $('.save').removeAttr('disabled');
                                $span.remove();
                            }
                        })  
                        // 库存量                
                         var s_qty=currentTr.find('td').eq(9).html();    
                        $('.save').click(function() {
                            var qty=$('#qty').val();
                            // 退货后的库存量
                            var t_qty=currentTr.find('td').eq(9).html(s_qty-qty);
                            var  r_date=$('#r_date').val();
                            if(r_date==''){
                                r_date=currentTr.find('td').eq(12).html();
                            }
                            var rebData = {
                                rid:currentTr.find('td').eq(4).html(),
                                s_merchant:currentTr.find('td').eq(6).html(),
                                r_goods: currentTr.find('td').eq(2).html(),
                                r_price: currentTr.find('td').eq(10).html()*qty,
                                r_qty:qty,
                                r_date: r_date
                            };
                            rebData = JSON.stringify(rebData);
                            // $.post(global.apiBaseUrl+'purchase/take_goods',{r_qty:t_qty,gid:gid
                            // },function(res){
                            //     console.log(666)
                            // })                           
                            $.post(global.apiBaseUrl + 'purchase/take_goods', {
                                rebData: rebData
                            }, function(res) {
                                 $('.popup').remove();
                                alert('已添加到退货管理！');

                            })
                            box2.style.display = 'none';
                            $('#div').removeClass('opt');
                        })
                        $('.cancel').on('click', function(e) {
                            $('.popup').remove();                       
                            e.stopPropagation();
                        });
                    })
                    // 入库
                $('tbody').on('click', '.cbox', function() {
                    if ($(this).is(':checked')) {
                        var currentTr = $(this).parents('tr');
                        var idx = $(this).parents('tr').attr('data-id');
                        $('.enterKu').click(function() {
                            var arr = [];
                            for (var i = 0; i < $('.cbox').length; i++) {
                                var tr = $('.cbox').eq(i).parents('tr').attr('data-id');
                                if (tr === idx) {
                                    var gqty = currentTr.find('td').eq(7).html();
                                    currentTr.remove();
                                    // 收货减
                                    $.post(global.apiBaseUrl + 'repertory', {
                                        g_id: tr
                                    }, function(res) {});
                                    // 库存加
                                    $.post(global.apiBaseUrl + 'repertory', {
                                        enter_id: tr,
                                        gqty: gqty
                                    }, function(res) {})
                                }
                            }
                        })
                    }
                })
            }
            // var box2 = document.querySelector('#box2');
        var header = box2.querySelector('header');
        autoPosition();
        window.onresize = function() {
                autoPosition();
            }
            //定位到页面中心
        function autoPosition() {
            var left = ($(window).innerWidth() - $('#box2').width()) / 2;
            var top = ($(window).innerHeight() - $('#box2').height()) / 2;
            // 改变弹窗的top,left值
            box2.style.left = left + 'px';
            box2.style.top = top + 'px';
        }
        header.onmousedown = function(evt) {
            var ox = evt.clientX - box2.offsetLeft;
            var oy = evt.clientY - box2.offsetTop;
            document.onmousemove = function(e) {
                box2.style.left = e.clientX - ox + 'px';
                box2.style.top = e.clientY - oy + 'px';
                e.preventDefault();
            }
            evt.stopPropagation();
        }
        header.onmouseup = function(e) {
            e.preventDefault();
            document.onmousemove = null;
        }
        $('tbody').on('click', '.cbox', function() {
            if ($(this).is(':checked')) {
                var currentTr = $(this).parents('tr');
                var idx = $(this).parents('tr').attr('data-id');
                $('#box2').css({
                    "height": "395px"
                });
                // 编辑
                $('.control').on('click', '.edit', function() {
                    $(this).css({
                        'background-color': "#58bc58"
                    }).siblings('span').css({
                        'background-color': "orange"
                    });
                    // $('#div').addClass('opt');
                    $('#box2').addClass('enter').css({
                        'display': 'block'
                    });
                    $('#gid').attr({
                        "disabled": "disabled"
                    }).val(currentTr.attr('data-id'));
                    $('#r_goods').val(currentTr.find('td').eq(2).html());
                    $('#barcode').val(currentTr.find('td').eq(3).html());
                    $('#rid').val(currentTr.find('td').eq(4).html());
                    $('#gtype').val(currentTr.find('td').eq(5).html());
                    $('#s_merchant').val(currentTr.find('td').eq(6).html());
                    $('#gqty').attr({
                        "disabled": "disabled"
                    }).val(currentTr.find('td').eq(7).html());
                    $('#s_qty').val(currentTr.find('td').eq(8).html());
                    $('#real_qty').val(currentTr.find('td').eq(9).html());
                    $('#stock_price').val(currentTr.find('td').eq(10).html());
                    $('#subtotal').val(currentTr.find('td').eq(11).html());
                    $('#t_date').val(currentTr.find('td').eq(12).html());
                    $('#t_pay').val(currentTr.find('td').eq(13).html());
                });
            }
            $('#save').click(function(e) {
                box2.style.display = 'none';
                $('#div').removeClass('opt');
                $.post(global.apiBaseUrl + 'purchase/take_goods', {
                    products: getData(currentTr)
                }, function(res) {})
                e.stopPropagation();
            });
        })

        function getData(currentTr) {
            var gid = $('#gid').val();
            var r_goods = $('#r_goods').val();
            currentTr.find('td').eq(2).html(r_goods);
            var barcode = $('#barcode').val();
            currentTr.find('td').eq(3).html(barcode);
            var rid = $('#rid').val();
            currentTr.find('td').eq(4).html(rid);
            var s_merchant = $('#s_merchant').val();
            currentTr.find('td').eq(5).html(s_merchant);
            var gqty = $('#gqty').val();
            currentTr.find('td').eq(6).html(gqty);
            var s_qty = $('#s_qty').val();
            currentTr.find('td').eq(7).html(s_qty);
            var real_qty = $('#real_qty').val();
            currentTr.find('td').eq(8).html(real_qty);
            var stock_price = $('#stock_price').val();
            currentTr.find('td').eq(9).html(stock_price);
            var subtotal = $('#subtotal').val();
            currentTr.find('td').eq(10).html(subtotal);
            var t_date = $('#t_date').val();
            currentTr.find('td').eq(11).html(t_date);
            var t_pay = $('#t_pay').val();
            currentTr.find('td').eq(12).html(t_pay);
            var newDate = {
                gid: gid,
                r_goods: r_goods,
                barcode: barcode,
                rid: rid,
                s_merchant: s_merchant,
                gqty: gqty,
                s_qty: s_qty,
                real_qty: real_qty,
                stock_price: stock_price,
                subtotal: subtotal,
                t_date: t_date,
                t_pay: t_pay
            };
            newDate = JSON.stringify(newDate);
            return newDate;
        }
        $('.add').on('click', function() {
            $(this).css({
                'background-color': "#58bc58"
            }).siblings('span').css({
                'background-color': "orange"
            });
            $('#div').addClass('opt');
            $('#box2').addClass('enter').css({
                'display': 'block'
            });
            var i = $('tr').length;
            var tr = `<tr class="addtr">
                    <td><input type="checkbox" class="cbox"/></td> 
                    <td>${i}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><button class="reback">退货</button></td>
                </tr>`;
            $('tbody').append(tr);
            var txt = $('<input/>').attr('type', 'text');
            var currentTr = $('.addtr');
            $('#save').click(function(e) {
                box2.style.display = 'none';
                $('#div').removeClass('opt');
                var gid = $('#gid').val();
                $('.addtr').attr({
                    'data-id': gid
                });
                var r_goods = $('#r_goods').val();
                currentTr.find('td').eq(2).html(r_goods);
                var barcode = $('#barcode').val();
                currentTr.find('td').eq(3).html(barcode);
                var rid = $('#rid').val();
                currentTr.find('td').eq(4).html(rid);
                var gtype = $('#gtype').val();
                currentTr.find('td').eq(5).html(s_merchant);
                var s_merchant = $('#s_merchant').val();
                currentTr.find('td').eq(5).html(s_merchant);
                var gqty = $('#gqty').val();
                currentTr.find('td').eq(6).html(gqty);
                var s_qty = $('#s_qty').val();
                currentTr.find('td').eq(7).html(s_qty);
                var real_qty = $('#real_qty').val();
                currentTr.find('td').eq(8).html(real_qty);
                var stock_price = $('#stock_price').val();
                currentTr.find('td').eq(9).html(stock_price);
                var subtotal = $('#t_date').val();
                currentTr.find('td').eq(10).html(subtotal);
                var t_date = $('#t_pay').val();
                currentTr.find('td').eq(11).html(t_date);
                var t_pay = $('#t_pay').val();
                currentTr.find('td').eq(12).html(t_pay);
                var newDate = {
                    gid: gid,
                    r_goods: r_goods,
                    barcode: barcode,
                    rid: rid,
                    s_merchant: s_merchant,
                    gqty: gqty,
                    s_qty: s_qty,
                    real_qty: real_qty,
                    stock_price: stock_price,
                    subtotal: subtotal,
                    t_date: t_date,
                    t_pay: t_pay
                };
                data = newDate;
                $.each(newDate, function(i, item) {
                    if (item == '') {
                        newDate = '';
                        $('.addtr').remove();
                    }
                })
                newDate = JSON.stringify(newDate);
                $.post(global.apiBaseUrl + 'purchase/take_goods', {
                    addproducts: newDate
                }, function(res) {})
            })
        });
        $('#close').on('click', function(e) {
            $('#box2').css({
                'display': 'none'
            });
            $('#div').removeClass('opt');
            e.stopPropagation();
        });
    })
})