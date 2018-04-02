require(['config'], function() {
    require(['jquery', 'global'], function() {
        var qty=4;
        var pageno=1;
        var $page=$('<div/>').addClass('page fr');
        $.post(global.apiBaseUrl +'seek',{},function(res){
            $.post(global.apiBaseUrl +'pages',{qty:qty,pageno:pageno},function(res){
                fun(res.dt);
                page(res);
            })
            
            function page(res){
                //生成分页
                var pagelen=Math.ceil(res.total/qty);
                $page.html('');//每次先清空前面的
                for(var i=0;i<pagelen;i++){
                    $a=$('<a href="#"/>');
                    $a.text(i+1);
                    if((i+1)===pageno){
                        $a.addClass('active');
                    }
                    $page.append($a);
                }
                var $i=$('<i/>').text('分页');
                $i.prependTo($page);
                $page.insertAfter($('.table'));
                //页码切换
                $page.on('click','a',function(){
                    pageno=$(this).text()*1;
                    $.post(global.apiBaseUrl +'pages',{qty:qty,pageno:pageno},function(res){
                        fun(res.dt);
                    })
                })

                
            }
            
        });


        function fun(attr){
            var cont=$.map(attr,function(item,idx){
                return `<tr data-id="${item.num}">
                            <td><input class="ck" type="checkbox"/></td>
                            <td>${idx+1}</td>
                            <td class="num">${item.num}</td>
                            <td class="name">${item.name}</td>
                            <td class="phone">${item.phone}</td>
                            <td><button class="edi btn btn-primary btn-lg" data-toggle="modal" data-target="#edit">编辑</button>
                            <button class="btn btn-primary btn-lg del" data-toggle="modal" data-target="#myModalDel">删除</button></td>
                        </tr>`
            }).join('');
            $('.tb').html('');
            $('.tb').append(cont);
        }

        /*删除*/
        var $currtr;
        $('.table').on('click','.del',function(){
            $currtr=$(this).closest('tr');
        })
        $('.footer1').on('click','.delete',function(){
            var num=$currtr.attr('data-id');
            $currtr.remove();
            $.get(global.apiBaseUrl +'del',{num:num},function(res){
                
            })
        })

        //查询
        $('.find').click(function(){
            var val=$('.tj').val();
            if(/^[\u2E80-\u9FFFa-z]{2,3}$/.test(val)){
                $.get(global.apiBaseUrl + 'seek',{name:val},function(res){
                    fun(res);
                    $('.ck').attr({checked:'true'});
                })
            }
            if(/^1[34578]\d{9}$/.test(val)){
                $.get(global.apiBaseUrl + 'seek',{phone:val},function(res){
                    fun(res);
                    $('.ck').attr({checked:'true'});
                })
            }
            if(/^\d{1,3}$/.test(val)){
                $.get(global.apiBaseUrl + 'seek',{num:val},function(res){
                    fun(res);
                    $('.ck').attr({checked:'true'});
                })
            }
        })

        //添加
        $('.footer').on('click','.svae1',function(){
                var num=$('.code').val();    
                var name=$('.name1').val();    
                var phone=$('.phone1').val();
                console.log(num);
                console.log(name);
                if(num!=''&&name!=''&&phone!=''){
                    $.get(global.apiBaseUrl + 'add',{num:num,name:name,phone:phone},function(res){
                        if(res){
                            var item=res.ops[0];
                            var len=$('.tb tr').length;
                            var tr=`<tr data-id="${item.num}">
                                        <td><input class="ck" type="checkbox"/></td>
                                        <td>${len+1}</td>
                                        <td class="num">${item.num}</td>
                                        <td class="name">${item.name}</td>
                                        <td class="phone">${item.phone}</td>
                                        <td><button class="edi btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">编辑</button>
                                        <button class="btn btn-primary btn-lg del" data-toggle="modal" data-target="#myModalDel">删除</button></td>
                                    </tr>`;
                            $('.tb').append(tr);
                        }else{
                            alert('会员号已存在');
                        }
                                
                    })
                }   
        })


        //编辑
        var  $currtr;
        $('.table').on('click','.edi',function(){
            $currtr=$(this).closest('tr');

            var num=$currtr.attr('data-id');
            var name=$currtr.find('.name').text();
            var phone=$currtr.find('.phone').text();
            $currtr.find('.ck').attr({checked:'true'});

            $('.kh').val(num); 
            $('.kh').attr({
                disabled:'true'
            })  
            $('.xm').val(name);    
            $('.dh').val(phone);    
        })    

        /*保存*/
        $('.modal-footer').on('click','.save',function(){
            $currtr.find('.name').text($('.xm').val());
            $currtr.find('.phone').text($('.dh').val());
            $.get(global.apiBaseUrl + 'edi',{num:$('.kh').val(),name:$('.xm').val(),phone:$('.dh').val()},function(res){
                   
            });

        })
        
    })
})
