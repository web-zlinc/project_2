require(['config'], function() {
    require(['jquery','global','bootstrap'], function() {
        
        $(".close").click(function(){
            $("#myAlert").alert();
        });

        //登录
        $('#btnLogin').click(function(){
            var name=$('#username').val();
            var pwd=$('#password').val();
            var idt=$('#identity').val();
            if(name!=''&&pwd!=''&&idt!=''){
                $.post(global.apiBaseUrl + 'login',{username: name, password: pwd},function(res){
                    console.log(res);
                    if(res.state){
                        var token=res.data.token;
                        window.localStorage.setItem('token',token);
                        var identity=res.data.limit;
                        
                        $("#myAlert").css({
                            display:'block'
                        })

                        if(identity==='管理员'){
                            window.location.href = `index.html?token=${token}`;
                        }else if(identity==='员工'){
                            window.location.href = 'purchase/staff.html?token=${token}';
                        // }else if(identity==='会员'){
                        //     window.location.href = 'purchase/member.html';
                        }
                        
                    } else {
                        alert('用户名或密码不正确');
                    }
                })
            }else{
                alert('字段不能为空！');
            }
            
        })
        //注册
        $('#btnregister').click(function(){
            var name=$('#username').val();
            var pwd=$('#password').val();
            var idt=$('#identity').val();
            console.log(name,pwd,idt);
            if(name!=''&&pwd!=''&&idt!=''){
                $.post(global.apiBaseUrl + 'regis',{username: name, password: pwd,limit:idt}, function(res){
                    if(res.state){
                        alert('注册成功')
                    } else {
                        alert('注册失败');
                    }
                })
            }else{
                alert('字段不能为空！');
            }
            
        })
        
       
    });
});