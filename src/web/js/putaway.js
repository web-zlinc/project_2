require(['config'],function(){
    require(['jquery','global','jquery_form','bootstrap'],function(){

    // 查询
    $('#P_search_btn').on('click', function (e) {
        let selectType = $('.btn-group').find('button').eq(0).text();
        // console.log(selectType)

        // 输入为空则查询所有
        if ($('#P_search_inp').val() === '' && selectType === "查询所有") {
            // $('#mainTable tbody').empty();
            $.post(global.apiBaseUrl + 'ptw_select', {}, function (res) {
                console.log(res.data);
                ptw_render(res)
            });

        }
        if (selectType === '商品名称') {
            if ($('#P_search_inp').val() === '') {

                alert('输入不能为空~')
                return;
            }
            // $('#mainTable tbody').empty();
            $.post(global.apiBaseUrl + 'ptw_select', {
                gname: $('#P_search_inp').val()
            }, function (res) {
                console.log(res.data);
                ptw_render(res)
            });
        } else if (selectType === '商品类型') {
            if ($('#P_search_inp').val() === '') {

                alert('输入不能为空~');
                return;
            }
            // $('#mainTable tbody').empty();
            $.post(global.apiBaseUrl + 'ptw_select', {
                gtype: $('#P_search_inp').val()
            }, function (res) {
                console.log(res.data);
                ptw_render(res)
            });
        } else if (selectType === '编号') {
            if ($('#P_search_inp').val() === '') {

                alert('输入不能为空~');
                return;
            }
            // $('#mainTable tbody').empty();
            $.post(global.apiBaseUrl + 'ptw_select', {
                gid: $('#P_search_inp').val()
            }, function (res) {
                console.log(res.data);
                ptw_render(res)
            });
        } else if (selectType === '未上架商品' && $('#P_search_inp').val() === '') {
            // 嵌套ajax请求，遍历区分未上架商品
            $.post(global.apiBaseUrl + 'ptw_select', {}, function (ptw_res) {
                // console.log(res.data);
                let isArr = [];
                $.each(ptw_res.data, function (idx, item) {

                    isArr.push(item.gid);
                });
                // console.log(isArr)
                $.post(global.apiBaseUrl + 'getproduct', {}, function (product_res) {

                    // console.log(product_res.data)
                    let h_qty = 0 ;
                    let P_no_ptw_html = $.map(product_res.data, function (iitem) {
                        // 如果有重复商品，则退出，否则继续
                        if ($.inArray(iitem.gid, isArr) != -1) {
                            return;
                        }
                        h_qty++;
                        return `
                                    <tr>
                                        <td>${h_qty}</td>
                                        <td class="gname">${iitem.gname}</td>
                                        <td class="gbarcode">未输入</td>
                                        <td class="gid" >${iitem.gid}</td>
                                        <td class="gtype">${iitem.gtype}</td>
                                        <td class="garea">未输入</td>
                                        <td class="gqty">${iitem.gqty}</td>
                                        <td class="gprice">未输入</t>
                                        <td class="gimg" style="display:none">${iitem.gimg}</td>
                                        <td style="display:none">${iitem._id}</td>
                                        <td>
                                            <button id="putawayBtn">上架</button>
                                        </td>
                                    </tr>
                                    `
                    }).join('');
                    $('#mainTable tbody').empty();
                    $('#mainTable tbody').append(P_no_ptw_html);
                })
            });
        }
    });

    //删除
    $('#mainTable tbody').on('click', '#putawayDel1', function (e) {
        console.log(666)
        let $self = $(this);
        let $thisId = $(this).closest('tr').find('td').eq(-2).text();
        $('#putawayDel2').on('click', function () {
            $('#myModal').modal('hide');
            $.post(global.apiBaseUrl + 'ptw_del', {
                _id: $thisId
            }, function (res) {
                // console.log(res.data)
                $.post(global.apiBaseUrl + 'ptw_select', {}, function (res) {
                    ptw_render(res);

                });
            });
        });
    });


    // 未上架商品操作（增、改、查）
    $('#mainTable tbody').on('click', '#putawayBtn', function () {

        putawayWindow();

        $('#putawayGname').val($(this).closest('tr').find('.gname').text());
        $('#putawayGbarcode').val($(this).closest('tr').find('.gbarcode').text());
        $('#putawayGid').val($(this).closest('tr').find('.gid').text());
        $('#putawayGtype').val($(this).closest('tr').find('.gtype').text());
        $('#putawayGarea').val($(this).closest('tr').find('.garea').text());
        $('#putawayGprice').val($(this).closest('tr').find('.gprice').text());
        $('#putawayGqty').val($(this).closest('tr').find('.gqty').text());
        $('#putawayGimg').val($(this).closest('tr').find('.gimg').text());

        let $maxinum = $(this).closest('tr').find('.gqty').text();

        $('.popup .save').on('click', function () {

            if ($('#putawayGqty').val() > $maxinum) {
                alert('库存不足');
                return;
            }

            $.post(global.apiBaseUrl + 'ptw_insert', {

                gid: $('#putawayGid').val(),
                gname: $('#putawayGname').val(),
                gtype: $('#putawayGtype').val(),
                gqty: $('#putawayGqty').val(),
                gimg: $('#putawayGimg').val(),
                garea: $('#putawayGarea').val(),
                gprice: $('#putawayGprice').val(),
                gbarcode: $('#putawayGbarcode').val()

            }, function (res) {
                console.log(res);
                $('.popup').remove();
                // $('#mainTable tbody').empty();
                // $.post(global.apiBaseUrl + 'ptw_select', {}, function (res) {
                //     ptw_render(res);
                // });
            })
        })
    });

    // 已上架商品操作
    $('#mainTable tbody').on('click', '#putawayEdit', function () {
        putawayWindow();

        let $_id = $(this).closest('tr').find('td').eq(-2).text();
        $('#putawayGname').val($(this).closest('tr').find('.gname').text());
        $('#putawayGbarcode').val($(this).closest('tr').find('.gbarcode').text());
        $('#putawayGid').val($(this).closest('tr').find('.gid').text());
        $('#putawayGtype').val($(this).closest('tr').find('.gtype').text());
        $('#putawayGarea').val($(this).closest('tr').find('.garea').text());
        $('#putawayGprice').val($(this).closest('tr').find('.gprice').text());
        $('#putawayGqty').val($(this).closest('tr').find('.gqty').text());
        $('#putawayGimg').val($(this).closest('tr').find('td').eq(-3).text());

        $('.popup h3').text('商品编辑');
        $('.popup .save').val('保存');

        $('.popup').on('click', '.save', function () {

            $.post(global.apiBaseUrl + 'ptw_update', {

                gid: $('#putawayGid').val(),
                gname: $('#putawayGname').val(),
                gtype: $('#putawayGtype').val(),
                gqty: $('#putawayGqty').val(),
                gimg: $('#putawayGimg').val(),
                garea: $('#putawayGarea').val(),
                gprice: $('#putawayGprice').val(),
                gbarcode: $('#putawayGbarcode').val()
            }, function (res) {
                console.log(res);
                $.post(global.apiBaseUrl + 'ptw_select', {}, function (res) {
                    $('.popup').remove();
                    ptw_render(res)
                });
            })
        })
    });

    // 封装生成结构方法
    function ptw_render(res) {

        var p_sql_back = res.data;
        let p_qty = 0;
        let p_html = $.map(p_sql_back, function (item) {
            // console.log(item)
            p_qty++;
            return `
                    <tr>
                        <td>${p_qty}</td>
                        <td class="gname">${item.gname}</td>
                        <td class="gbarcode">${item.gbarcode}</td>
                        <td class="gid">${item.gid}</td>
                        <td class="gtype">${item.gtype}</td>
                        <td class="garea">${item.garea}</td>
                        <td class="gqty">${item.gqty}</td>
                        <td class="gprice">${item.gprice}</td>
                        <td style="display:none">${item.gimg}</td>
                        <td style="display:none">${item._id}</td>
                        <td>
                            <button type="button" class="" data-toggle="modal" data-target="#myModal" id="putawayDel1">删除</button>
                            <button id="putawayEdit">编辑</button>
                        </td>
                    </tr>`
        }).join('');
        $('#mainTable tbody').empty();
        $('#mainTable tbody').append(p_html);
    };

    // 引入切换按钮
    $('.dropdown-toggle').dropdown();
    // 按钮切换内容
    $('.dropdown-menu li').on('click', 'a', function () {
        $(this).closest('div').find('button').eq(0).text($(this).text());
    });

    // 弹窗
    function putawayWindow() {
        //创建一个div
        let $div = $('<div class="popup well well-sm"/>').css({
            'position': 'absolute',
            'width': '400',
            'margin': 'auto',
            'padding': '20'
        }).append($('<h3 style="margin-top:5px; margin-bottom:10px;" />').text('上架商品')).append($(
            `<form/>`).html(
            `
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGname">商品名称</label>
                            <input type="text" class="form-control" id="putawayGname" placeholder="Product Name">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGbarcode">条码</label>
                            <input type="text" class="form-control" id="putawayGbarcode" placeholder="Barcode">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGid">编号</label>
                            <input type="text" class="form-control" id="putawayGid" placeholder="ID">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGtype">商品分类</label>
                            <input type="text" class="form-control" id="putawayGtype" placeholder="Type">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGarea">产地</label>
                            <input type="text" class="form-control" id="putawayGarea" placeholder="Area">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGprice">价格</label>
                            <input type="text" class="form-control" id="putawayGprice" placeholder="Price">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGqty">上架数量</label>
                            <input type="text" class="form-control" id="putawayGqty" placeholder="Qty">
                        </div>
                        <div style="margin-bottom:5px;" class="form-group">
                            <label for="putawayGimg">商品图片</label>
                            <input type="text" class="form-control" id="putawayGimg" placeholder="ImageUrl">
                        </div>
                        <input class="btn btn-default save" type="button" value="上架">
                        <input class="btn btn-default btnClose" type="button" value="关闭">
                    `
        ));

        $('body').append($div);

        //公式：   居中X坐标 = 窗口x半径 - 要居中元素x半径;
        //      居中Y坐标 = 窗口y半径 -要居中元素y半径;
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
        })
    };
    
    })
})
