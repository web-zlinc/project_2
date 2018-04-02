require(['config'], function() {
    require(['jquery', 'global', 'excel', 'common'], function() {
        exportExcel();
        $.get(global.apiBaseUrl + 'purchase/return_goods', function(res) {
            showTr(res);
        })
        $('.search_btn').on('click', function() {
            $.post(global.apiBaseUrl + 'purchase/return_goods', {
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
                tr += ` <tr data-id="${item.rid}">
                    <td><input type="checkbox" class="cbox"/></td> 
                    <td>${i}</td>
                    <td>${item.rid}</td>
                    <td>${item.s_merchant}</td>
                    <td>${item.r_goods}</td>
                    <td>${item.r_price}</td>
                    <td>${item.r_qty}</td>
                    <td>${item.r_date}</td>
                    
                </tr> `;
            }).join('');
            $('tbody').append(tr);
        }
        $('#box2').css({
            'height': '220px'
        });
        var box2 = document.querySelector('#box2');
        var header = box2.querySelector('header');
        autoPosition();
        window.onresize = function() {
                autoPosition();
            }
            //定位到页面中心
        function autoPosition() {
            var left = ($(window).innerWidth() - $('#box2').width()) / 2;
            var top = ($(window).innerHeight() -$('#box2').height()) / 2;
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
                $('.control').on('click', '.edit', function() {
                    console.log(666)
                    $(this).css({
                        'background-color': "#58bc58"
                    }).siblings('span').css({
                        'background-color': "orange"
                    });
                    $('#div').addClass('opt');
                    $('#box2').addClass('enter').css({
                        'display': 'block'
                    });
                    $('#gid').val(currentTr.attr('data-id'));
                    $('#gid').attr({
                        "disabled": "disabled"
                    });
                    $('#rid').attr({
                        "disabled": "disabled"
                    }).val(currentTr.find('td').eq(2).html());
                    $('#s_merchant').val(currentTr.find('td').eq(3).html());
                    $('#r_goods').val(currentTr.find('td').eq(4).html());
                    $('#r_price').val(currentTr.find('td').eq(5).html());
                    $('#r_qty').val(currentTr.find('td').eq(6).html());
                    $('#r_date').val(currentTr.find('td').eq(7).html());
                });
            }
            $('#save').click(function(e) {
                box2.style.display = 'none';
                $('#div').removeClass('opt');
                var rid = $('#rid').val();
                currentTr.find('td').eq(2).html(rid);
                var s_merchant = $('#s_merchant').val();
                currentTr.find('td').eq(3).html(s_merchant);
                var r_goods = $('#r_goods').val();
                currentTr.find('td').eq(4).html(r_goods);
                var r_price = $('#r_price').val();
                currentTr.find('td').eq(5).html(r_price);
                var r_qty = $('#r_qty').val();
                currentTr.find('td').eq(6).html(r_qty);
                var r_date = $('#r_date').val();
                currentTr.find('td').eq(7).html(r_date);
                var newDate = {
                    rid: rid,
                    s_merchant: s_merchant,
                    r_goods: r_goods,
                    r_price: r_price,
                    r_qty: r_qty,
                    r_date: r_date
                };
                newDate = JSON.stringify(newDate);
                $.post(global.apiBaseUrl + 'purchase/return_goods', {
                    products: newDate
                }, function(res) {})
                e.stopPropagation();
            });
        })
        $('#close').click(function(e) {
            box2.style.display = 'none';
            $('#div').removeClass('opt');
            e.stopPropagation();
        });
    })
})