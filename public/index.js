$(document).ready(function() {
    var form = $("#create-product-form");

    form.submit((e) => {
        e.preventDefault();
        var formData = form.serializeArray();
        var jsonData = {};

        $.map(formData, function(n, i){
            jsonData[n['name']] = n['value'];
        });

        createProduct(jsonData);
    })

    var socket = io('http://localhost:3000/');

    socket.on('newproduct', newProduct => {
    $('#products-table tr:last').after(`<tr scope="row"><td>${newProduct.name}</td><td>${newProduct.price}</td><td><img src="${newProduct.thumbnail}" alt="${newProduct.name}" class="img-thumbnail resized_image"></td></tr>`);
    });

    socket.on('productsList', products => {
        var productsTemplate = $('#products-template').html()
        var compiledProductsTemplate = Handlebars.compile(productsTemplate);
        var context = {
            "products": products,
            "exists": products.length > 0 
        }

        var tableContainer = $('.table-container');
        tableContainer.html(compiledProductsTemplate({context}));
        $('.datatable').DataTable();
    })

    
function createProduct(data){
    $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/productos/guardar",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            success: function (data, status) {
                $("#create-product-form")[0].reset();
                showAlert(data.message, status); 
            },
            error: function (data, status) {
                showAlert(data.responseJSON.error, status);
            }
         });
}

function showAlert(message, type) {
    var alert = $("#product-create-alert")
    alert.removeClass()
    alert.html(message)
    if (type === 'error') {
        alert.addClass("alert alert-danger")
    }

    if (type === 'success') {
        alert.addClass("alert alert-success")
    }

    alert.show('fade');

    $("#product-create-alert").delay(3000).slideUp(200, function() {
        $(this).hide('fade');
    });
}
});

