require.config({
    paths:{
        jquery:'../web/libs/jquery-3.2.1',
        common:'common',
        jqueryUI:'../web/libs/jquery-ui-1.12.1/jquery-ui'

    },
    shim:{
       common:['jquery'],
       jqueryUI:['jquery']
      
    }

});