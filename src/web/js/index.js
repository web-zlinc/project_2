require(['config'], function() {
    require(['jquery', 'jqueryUI','global'], function() {
        $("#accordion").accordion({
            heightStyle: "content"
        });
       
       	var token=window.localStorage.getItem("token");

       	$.ajax({
                type:"POST",
                url:global.apiBaseUrl +"index",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function(res){
                    console.log(res)
                    // if(res.name && res.name == "JsonWebTokenError"){
                    //    location.href = "./html/login.html";
                    // }else{
                    //     position=(res.position)
                    //      $('.mh_hed').find('.username').html(res.username);

                    //           show(position);
                        
                         
                    // }
                }
            });
    });
});