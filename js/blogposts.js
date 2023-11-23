$(document).ready(function() {
    const blogelement = $("#blog-list");
    const filepath = "blogs.html";

    $.ajax({
        url: filepath,
        dataType: 'text',
        async: false,
        success: function(data){
            blogelement.append(data);
            console.log(`Blog posts found.`);
        },
        error: function(){
            console.error(`could not read file`);
        }
    })
})();