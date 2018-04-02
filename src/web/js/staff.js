require(['config'], function(){
    require(['jquery', 'global'], function(){

        var token=localStorage.getItem('token');
        
        var qty=4;
        var pageno=1;
        var $page=$('<ul/>').addClass('pagination-sm fr pagination');
        $.post(global.apiBaseUrl +'seeks',{},function(res){
            $.post(global.apiBaseUrl +'page',{qty:qty,pageno:pageno},function(res){
                fun(res.dt);
                page(res);
            })
            
            function page(res){
                //生成分页
                var pagelen=Math.ceil(res.total/qty);
                $page.html('');//每次先清空前面的
                $f_li=$('<li/>');
                $f_a=$('<a/>').text('<<');
                $f_li.append($f_a)
                $page.prepend($f_li);

                for(var i=0;i<pagelen;i++){
                    $li=$('<li/>');
                    $a=$('<a herf="#"/>')
                    $a.text(i+1);
                    $a.addClass('num');
                    if((i+1)===pageno){
                        $a.addClass('active');
                    }
                    $li.append($a);
                    $page.append($li);
                }

                $l_li=$('<li/>');
                $l_a=$('<a/>').text('>>');
                $l_li.append($l_a)
                $page.append($l_li);
                $page.insertAfter($('.table'));

                //页码切换
                $page.on('click','.num',function(){
                    pageno=$(this).text()*1;
                    $.post(global.apiBaseUrl +'page',{qty:qty,pageno:pageno},function(res){
                        fun(res.dt);
                    })
                })

                
            }
            
        });

        function fun(attr){
            var cont=$.map(attr,function(item,idx){
                return `<tr data-id="${item.num}">
                            <td>${idx+1}</td>
                            <td class="num">${item.num}</td>
                            <td class="name">${item.name}</td>
                            <td class="phone">${item.phone}</td>
                            <td class="position">${item.position}</td>
                            <td><button class="edi btn btn-primary btn-lg" data-toggle="modal" data-target="#edit">编辑</button>
                            <button class="btn btn-primary btn-lg del" data-toggle="modal" data-target="#myModalDel">删除</button></td>
                        </tr>`
            }).join('');
            $('.tb').html('');
            $('.tb').append(cont);
        }

        var $currtr;
        $('.table').on('click','.del',function(){
            $currtr=$(this).closest('tr');
        })
        $('.footer1').on('click','.delete',function(){
            var num=$currtr.attr('data-id');
            $currtr.remove();
            $.get(global.apiBaseUrl +'dels',{num:num},function(res){
                
            })
        })
        //添加
        $('.modal-footer').on('click','.btn',function(){
            var num=$('.I_code').val();    
            var name=$('.I_name').val();    
            var phone=$('.I_phone').val();
            var position=$('.I_position').val();
            
            if(num!=''&&name!=''&&phone!=''){
                $.get(global.apiBaseUrl + 'adds',{num:num,name:name,phone:phone,position:position},function(res){
                    if(res){
                        var item=res.ops[0];
                        var len=$('.tb tr').length;
                        var tr=`<tr data-id="${item.num}">
                                    <td>${len+1}</td>
                                    <td class="num">${item.num}</td>
                                    <td class="name">${item.name}</td>
                                    <td class="phone">${item.phone}</td>
                                    <td class="position">${item.position}</td>
                                    <td><button class="edi btn btn-primary btn-lg" data-toggle="modal" data-target="#edit">编辑</button>
                                    <button class="btn btn-primary btn-lg del" data-toggle="modal" data-target="#myModalDel">删除</button></td>
                                </tr>`
                        $('.tb').append(tr);
                    }else{
                        alert('会员号已存在');
                    }
                            
                })
            }
            
        })

        

        //查询
        $('.find').click(function(){
            var val=$('.tj').val();
            if(/^[\u2E80-\u9FFFa-z]{2,3}$/.test(val)){
                $.get(global.apiBaseUrl + 'seeks',{name:val},function(res){
                    console.log(res);
                    fun(res);
                })
            }
            if(/^1[34578]\d{9}$/.test(val)){
                $.get(global.apiBaseUrl + 'seeks',{phone:val},function(res){
                    fun(res);
                })
            }
            if(/^\d{1,3}$/.test(val)){
                $.get(global.apiBaseUrl + 'seeks',{num:val},function(res){
                    fun(res);
                })
            }
        })

        var $currtr;
        //编辑
        $('.table').on('click','.edi',function(){
            $currtr=$(this).closest('tr');

            var num=$currtr.attr('data-id');
            var name=$currtr.find('.name').text();
            var phone=$currtr.find('.phone').text();
            var position=$currtr.find('.position').text();
            
            $('.E_code').val(num); 
            $('.E_code').attr({
                disabled:true
            })  
            $('.E_name').val(name);    
            $('.E_phone').val(phone);    
            $('.E_position').val(position); 
        })
        $('.modal-footer').on('click','.e_save',function(){
            console.log($currtr);
            $currtr.find('.name').text($('.E_name').val());
            $currtr.find('.phone').text($('.E_phone').val());
            $currtr.find('.position').text($('.E_position').val());
            $.get(global.apiBaseUrl + 'edis',{num:$currtr.find('.num').text(),name:$currtr.find('.name').text(),phone:$currtr.find('.phone').text(),position:$currtr.find('.position').text()},function(res){
                $('.kh').attr({
                    disabled:false
                })
            })
            
        })
        
    })
})
    