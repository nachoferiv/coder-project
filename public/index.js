var socket = io('http://localhost:3000/');

socket.on('update-items', v => {
    // updatear lista de items en el front end
    console.log(v)
})

$(document).ready(function() {
    $('.datatable').DataTable();
    console.log('asdf')
    $("#create-product-form").submit((e) => {
        e.preventDefault();
        console.log('submit')
    })

    //var productList = $("#products-list").html();
    //var compiledProductList = Handlebars.compile(productList);
    //  console.log(compiledProductList)
});
