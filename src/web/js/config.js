require.config({
    paths:{
        jquery:'../libs/jquery-3.2.1',
        common:'common',
        jqueryUI:'../libs/jquery-ui-1.12.1/jquery-ui',
        global:'../libs/global',
        global_eddie:'../libs/global_eddie',
        qrcode:'../libs/qrcode.min',
        bootstrap:"../libs/bootstrap-3.3.7-dist/js/bootstrap.min",
        socketio:'../libs/socket.io.min',
        excel:'../libs/jquery.table2excel',
        jquery_form:'../libs/jquery.form'

    },
    shim:{
       common:['jquery'],
       jqueryUI:['jquery'],
       qrcode:['jquery'],
       bootstrap:['jquery'],
       socketio:['jquery'],
       excel:['jquery'],
       jquery_form:['jquery']
    }

});