require(['config'],function(){
    require(['common','jquery','global'],function(){
        // 向后台请求数据写入页面
        var qty = 5;
        var pageNo = 1;
        $.post(global.apiBaseUrl + 'supplier',{qty:qty,pageNo:pageNo},function(res){
            // 获取数据写入页面
            $('tbody').get(0).innerHTML = res.data.map(function(item){
                return `<tr>
                    <td class="edit" data-id="${item._id}">编辑</td>
                    <td class="v_code">${item.id}</td>
                    <td class="v_name">${item.name}</td>
                    <td class="linkname">${item.linkname}</td>
                    <td class="tel">${item.tel}</td>
                    <td class="address">${item.address}</td>
                    <td class="v_type">${item.type}</td>
                    <td class="payment">${item.payment}</td> 
                </tr>`
            }).join('');


            // asideTable_ys起初是隐藏的，点击新增时才出现
            $('.addItem_ys').on('click',function(){
                 // 编号的输入框允许编辑
                $('input.v_code').val('').attr("readonly", false); 
                $('input.v_name').val('');
                $('input.linkname').val('');
                $('input.tel').val('');
                $('textarea.address').val('');

                $('.asideTable_ys').show(500);
                // 删除按钮要去掉
                $('.del').hide();
                $('.cancel').click(function(){
                    $('.asideTable_ys').hide(500);
                })

                // 当此输入框失去焦点时将输入的内容请求给后台判断这个编号是否存在
                $('input.v_code').off().on('blur',function(){
                    var v_code1 = $('input.v_code').val();

                    if(!/^[0-9]{1,10}$/.test(v_code1)){
                        $('.info').html('什么鬼？').css({'color':'#f00'});
                        return false;
                    }else{
                        $('.info').html('');
                        $.post(global.apiBaseUrl + 'getId',{id:v_code1},function(res){
                            if(!res.state){
                                $('.info').html('此编号已存在').css({'color':'#f00'});
                            }
                        
                        })
                        
                    }
                })
                    
                $('.addSave').off().on('click',function(){
                    
                    var v_code1 = $('input.v_code').val();
                    var v_name1 = $('input.v_name').val();
                    var linkname1 = $('input.linkname').val();
                    var tel1 = $('input.tel').val();
                    var address1 = $('textarea.address').val();
                    var v_type1 = $('.v_type').children(':selected').text();
                    var payment1 = $('.payment').children(':selected').text();
                    

                    

                    // 发送数据给后台增加项目
                    var data = {
                        id:v_code1,
                        name:v_name1,
                        linkname:linkname1,
                        tel:tel1,
                        address:address1,
                        type:v_type1,
                        payment:payment1
                    }
                    // 如果$('.info').text()有值，或者v_code1的值为空不能发送请求
                    console.log($('.info').text() == '');
                    console.log(v_code1 != '');
                    if($('.info').text() == '' && v_code1 != ''){
                        $.post(global.apiBaseUrl + 'add',data,function(res){
                            console.log(res)
                            var $tr = $('<tr></tr>');
                            $tr.html(`
                                   
                                <td class="edit">编辑</td>
                                <td class="v_code">${v_code1}</td>
                                <td class="v_name">${v_name1}</td>
                                <td class="linkname">${linkname1}</td>
                                <td class="tel">${tel1}</td>
                                <td class="address">${address1}</td>
                                <td class="v_type">${v_type1}</td>
                                <td class="payment">${payment1}</td> 
                                
                            `).appendTo('tbody');
                        $('.asideTable_ys').hide(500);
                            
                        editEvent();
                        })
                        
                    }
                     
                   
                })
                
            })

            editEvent();   

        })  
        // 点击编辑的函数
        var editEvent = function(){
            // 点击编辑出现
            $('.edit').click(function(){
                $('.info').html('');
                $('.del').show();

                $('.asideTable_ys').show(500);
                $('.cancel').click(function(){
                    $('.asideTable_ys').hide(500);

                })
                // 编号的输入框不允许编辑
                $("input.v_code").attr("readonly", true);
                // 点删除按钮，删除当前tr并且删除数据库中的数据
                $('.del').off().click(function(){

                    $(this).parent().remove();
                    var aa = $(this).next().text();
                    // 发送数据给后台删除该项
                    $.post(global.apiBaseUrl + 'del',{id:aa},function(res){
                    })
                    $('.asideTable_ys').hide(500);

                }.bind(this));

                // 编辑框中显示对应的信息
                var v_code = $(this).nextAll('.v_code').text();
                $('input.v_code').val(v_code);

                var v_name = $(this).nextAll('.v_name').text();
                $('input.v_name').val(v_name);

                var linkname = $(this).nextAll('.linkname').text();
                $('input.linkname').val(linkname);

                var tel = $(this).nextAll('.tel').text();
                $('input.tel').val(tel);

                var address = $(this).nextAll('.address').text();
                $('textarea.address').val(address);

                var v_type = $(this).nextAll('.v_type').text();
                var length1 = $('select.v_type').children().get().length;

                for(var i=0;i<length1;i++){
                
                    if($('select.v_type').children().get(i).text == v_type){

                        $('select.v_type').children().get(i).selected = true;
                    }                    
                }

                var payment = $(this).nextAll('.payment').text();
                var length2 = $('select.payment').children().get().length;

                for(var i=0;i<length2;i++){
                
                    if($('select.payment').children().get(i).text == payment){

                        $('select.payment').children().get(i).selected = true;
                    }                    
                }

                // 点击保存时。要将当前输入框中的内容重新赋值给当前tr,并更改数据库中的数据
                $('.save').off().click(function(){
                    var v_code2 = $('input.v_code').val();
                    var v_name2 = $('input.v_name').val();
                    var linkname2 = $('input.linkname').val();
                    var tel2 = $('input.tel').val();
                    var address2 = $('textarea.address').val();
                    var v_type2 = $('.v_type').children(':selected').text();
                    var payment2 = $('.payment').children(':selected').text();
                    $(this).nextAll('.v_code').text(v_code2);
                    $(this).nextAll('.v_name').text(v_name2);
                    $(this).nextAll('.linkname').text(linkname2);
                    $(this).nextAll('.tel').text(tel2);
                    $(this).nextAll('.address').text(address2);
                    $(this).nextAll('.v_type').text(v_type2);
                    $(this).nextAll('.payment').text(payment2);
                    $('.asideTable_ys').hide(500);

                    // 向后台发送更改之后的请求
                    // var _id = $(this).attr('data-id');
                    var data = {
                        // _id:ObjectId(_id),
                        // _id:_id,
                        id:v_code2,
                        name:v_name2,
                        linkname:linkname2,
                        tel:tel2,
                        address:address2,
                        type:v_type2,
                        payment:payment2
                    }
                    $.post(global.apiBaseUrl + 'change',data,function(res){
                        console.log(res);
                    })

                }.bind(this));
            })

        }

         editEvent();   

         //点击查询获取输入框中的值，向后台请求符合条件的数据写入页面
        var searchFun = function(){
            var $searchCont = $('#getInfor_ys').val();
            // var data = {
            //     id:$searchCont,
            //     name:$searchCont,
            //     linkname:$searchCont,
            //     tel:$searchCont,
            //     address:$searchCont,
            //     type:$searchCont,
            //     payment:$searchCont
            // }
            $.post(global.apiBaseUrl + 'search',{name:$searchCont},function(res){
                console.log(res)
                var data = res.data;

                // 获取数据写入页面
                $('tbody').get(0).innerHTML = res.data.map(function(item){
                    return `<tr>
                        <td class="edit" data-id="${item._id}">编辑</td>
                        <td class="v_code">${item.id}</td>
                        <td class="v_name">${item.name}</td>
                        <td class="linkname">${item.linkname}</td>
                        <td class="tel">${item.tel}</td>
                        <td class="address">${item.address}</td>
                        <td class="v_type">${item.type}</td>
                        <td class="payment">${item.payment}</td> 
                    </tr>`
                }).join('');
                editEvent();
            })
        }

        $('.function_ys #searchBtn_ys').on('click',function(){
            searchFun();
        })
        // 当输入框获得焦点时才触发键盘事件
        $('.function_ys #getInfor_ys').on('focus',function(){
            $('body').on('keyup',function(e){
                if(e.keyCode == 13){
                    searchFun();
                }
            })
        })
        // 失去焦点时关闭键盘事件
        $('.function_ys #getInfor_ys').on('blur',function(){
            $('body').off('keyup');
        })
        // 添加分页
        // 点击下一页，
        var page;
        $('.prev').css({'color':'#ccc'})
        $('.next').click(function(e){
            $('.prev').css({'color':'#000'});
            if(pageNo>Math.floor(page)){//3
                pageNo=Math.ceil(page);//4
                $('.next').css({'color':'#ccc'});
            }else{
                pageNo++;
            $.post(global.apiBaseUrl + 'supplier',{qty:qty,pageNo:pageNo},function(res){
                page = res.total/qty;
                console.log(res)
                // 获取数据写入页面
                $('tbody').get(0).innerHTML = res.data.map(function(item){
                    return `<tr>
                        <td class="edit" data-id="${item._id}">编辑</td>
                        <td class="v_code">${item.id}</td>
                        <td class="v_name">${item.name}</td>
                        <td class="linkname">${item.linkname}</td>
                        <td class="tel">${item.tel}</td>
                        <td class="address">${item.address}</td>
                        <td class="v_type">${item.type}</td>
                        <td class="payment">${item.payment}</td> 
                    </tr>`
                }).join('');
                editEvent();
            })
            }
        })

        $('.prev').click(function(e){
            $('.next').css({'color':'#000'})
            if(pageNo<=1){
                pageNo=1;
                $('.prev').css({'color':'#ccc'})
            }else{
                pageNo--;

            $.post(global.apiBaseUrl + 'supplier',{qty:qty,pageNo:pageNo},function(res){
                console.log(res)
                // 获取数据写入页面
                $('tbody').get(0).innerHTML = res.data.map(function(item){
                    return `<tr>
                        <td class="edit" data-id="${item._id}">编辑</td>
                        <td class="v_code">${item.id}</td>
                        <td class="v_name">${item.name}</td>
                        <td class="linkname">${item.linkname}</td>
                        <td class="tel">${item.tel}</td>
                        <td class="address">${item.address}</td>
                        <td class="v_type">${item.type}</td>
                        <td class="payment">${item.payment}</td> 
                    </tr>`
                }).join('');
                editEvent();
            })
            }
        })

        
    }); 
}); 