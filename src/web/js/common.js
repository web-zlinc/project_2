// 导出excel
function exportExcel(){
     $('.export').click(function(){
         $(".table").table2excel({
            exclude: ".cbox",
            name: "Excel Document Name",
            filename: $('title').html(),
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
     })
}