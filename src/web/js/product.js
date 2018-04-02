// 仓管
require(['config'],function(){
    require(['jquery','jquery_form','global'],function(){
  // 仓库查询
    $('#selectBtn').on('click', function (e) {
        let selectType = $('#selectForm').find('option:selected').val();
        // 输入为空则查询所有
        if ($('#productData').val() === '') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {}, function (res) {
                console.log(res.data);
                h_render(res.data)
            });

        }
        if (selectType === 'gid') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {
                gid: $('#productData').val()
            }, function (res) {
                console.log(res.data);
                h_render(res.data)
            });
        } else if (selectType === 'gtype') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {
                gtype: $('#productData').val()
            }, function (res) {
                console.log(res.data);
                h_render(res.data)
            });
        } else if (selectType === 'gname') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {
                gname: $('#productData').val()
            }, function (res) {
                console.log(res.data);
                h_render(res.data)
            });
        } else if (selectType === 'gqty') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {
                gqty: $('#productData').val()
            }, function (res) {
                console.log(res.data);
                h_render(res.data)
            });
        } else if (selectType === 'gimg') {
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {
                gimg: $('#productData').val()
            }, function (res) {
                console.log(res.data);
                h_render(res.data)
            });
        }
    });

    // 仓库写入
    $('#insertBtn').on('click', function (e) {
        awakenWindow();

        $('.save').on('click', function () {
            // 此处留bug：当所有为空时依然能写入
            $.post(global.apiBaseUrl + 'insertProduct', {
                gname: $('#insertGname').val(),
                gtype: $('#insertGtype').val(),
                gid: $('#insertGid').val(),
                gqty: $('#insertGqty').val(),
                gimg: $('#insertGimg').val()
            }, function (res) {
                // h_render(res.data)
                $('#h_showGoods tbody').empty();
                $.post(global.apiBaseUrl + 'getproduct', {}, function (res) {
                    $('.popup').remove();
                    h_render(res.data)
                    
                });
            });
        });

    });

    // // 顶部删除
    // $('#h_showGoods').on('click', 'h_del' ,function (e) {

    //     let selectType = $('#selectForm').find('option:selected').val();

    //     $.post(global.apiBaseUrl + 'delProduct', { gid: $('#productData').val() }, function (res) { console.log(res.data); });

    //     if (selectType === 'gid') {
    //         $.post(global.apiBaseUrl + 'delProduct', { gid: $('#productData').val() }, function (res) { console.log(res.data); });
    //     } else if (selectType === 'gtype') {
    //         $.post(global.apiBaseUrl + 'delProduct', { gtype: $('#productData').val() }, function (res) { console.log(res.data); });
    //     } else if (selectType === 'gname') {
    //         $.post(global.apiBaseUrl + 'delProduct', { gname: $('#productData').val() }, function (res) { console.log(res.data); });
    //     } else if (selectType === 'gqty') {
    //         $.post(global.apiBaseUrl + 'delProduct', { gqty: $('#productData').val() }, function (res) { console.log(res.data); });
    //     }

    // });

    // 表格删除
    $('#h_showGoods').on('click', '#h_del', function (e) {
        // console.log(666)
        // let selectType = $('#selectForm').find('option:selected').val();
        let $thisId = $(this).closest('tr').find('td').eq(1).text();
        // console.log($thisId)
        $.post(global.apiBaseUrl + 'delProduct', {
            gid: $thisId
        }, function (res) {
            console.log(res.data)
            $('#h_showGoods tbody').empty();
            $.post(global.apiBaseUrl + 'getproduct', {}, function (res) {
                h_render(res.data)
            });
        });

    });

    // 编辑
    $('#h_showGoods').on('click', '#h_edit', function (e) {
        awakenWindow();
        // 写入当前商品数据
        $('#insertGid').val($(this).closest('tr').find('.gid').text());
        $('#insertGname').val($(this).closest('tr').find('.gname').text());
        $('#insertGtype').val($(this).closest('tr').find('.gtype').text());
        $('#insertGqty').val($(this).closest('tr').find('.gqty').text());
        $('#insertGimg').val($(this).closest('tr').find('.gimg').text());

        // let $iGid = $('#insertGid').val();
        // let $iGname = $('#insertGname').val();
        // let $iGtype = $('#insertGtype').val();
        // let $iGqty = $('#insertGqty').val();
        // let $iGimg = $('#insertGimg').val();

        console.log($('#insertGimg').val())

        $('.popup').on('click', '.save', function () {

            $.post(global.apiBaseUrl + 'updataProduct', {
                // UpdateAfter:JSON.stringify({
                gid: $('#insertGid').val(),
                gname: $('#insertGname').val(),
                gtype: $('#insertGtype').val(),
                gqty: $('#insertGqty').val(),
                gimg: $('#insertGimg').val()
                // }),UpdateBefore:JSON.stringify({
                // gid: $iGid
                // gname: $iGname,
                // gtype: $iGtype,
                // gqty: $iGqty,
                // gimg: $iGimg
                // })
            }, function (res) {
                console.log(res);
                $('#h_showGoods tbody').empty();
                $('.popup').remove();
                $.post(global.apiBaseUrl + 'getproduct', {}, function (res) {
                    h_render(res.data)
                });
            })
        })
    });

    // 生成结构
    function h_render(data) {

        let h_qty = 0;
        let h_data = data.map(function (item) {
            h_qty++;
            return `
                        <tr>
                            <th scope="row">${h_qty}</th>
                            <td class="gname">${item.gname}</td>
                            <td class="gid" data-gid="${item.gid}">${item.gid}</td>
                            <td class="gtype" >${item.gtype}</td>
                            <td class="gqty">${item.gqty}</td>
                            <td class="gimg" style="display:none;">${item.gimg}</td>
                            <td>
                                <button id="h_edit">编辑</button>
                                <button id="h_del">删除</button> 
                            </td>
                        </tr>
                    `
        }).join('');

        $('#h_showGoods tbody').append(h_data);

    };

    // 弹窗
    function awakenWindow() {
        //创建一个div
        let $div = $('<div class="popup well well-lg"/>').css({
            'position': 'absolute',
            'width': '400',
            'margin': 'auto'
        }).append($('<h3/>').text('商品信息')).append($(
            `<form/>`).html(`
                        <div class="form-group">
                            <label for="insertGid">商品ID</label>
                            <input type="text" class="form-control" id="insertGid" placeholder="GoodsID">
                        </div>
                        <div class="form-group">
                            <label for="insertGname">商品名字</label>
                            <input type="text" class="form-control" id="insertGname" placeholder="GoodName">
                        </div>
                        <div class="form-group">
                            <label for="inserGtype">商品类型</label>
                            <input type="text" class="form-control" id="insertGtype" placeholder="GoodType">
                        </div>
                        <div class="form-group">
                            <label for="insertGqty">商品库存</label>
                            <input type="text" class="form-control" id="insertGqty" placeholder="GoodQty">
                        </div>
                        <div class="form-group">
                            <label for="insertGimg">商品图片</label>
                            <input type="text" class="form-control" id="insertGimg" placeholder="GoodQty">
                        </div>
                        <input class="btn btn-default save" type="button" value="保存">
                        <input class="btn btn-default cancel" type="button" value="关闭">
                    `));

        $('body').append($div);

        //公式: 居中X坐标 = 窗口x半径 - 要居中元素x半径;
        //		居中Y坐标 = 窗口y半径 -要居中元素y半径;
        //innerHeight/innerWidth = width + padding; <==> clientWidth
        //outerWidth() = width + padding + border; <==> offsetWidth

        // 窗口滚动事件封装与调用
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
            $(window).scroll(function () {
                leftTop(obj);
            });

            $(window).resize(function () {
                leftTop(obj);
            })

        }

        center($div);

        //点击删除效果
        $div.on('click', '.btnClose', function () {
            // console.log(666)
            $div.remove();
        });
    };
        
    })
})
  