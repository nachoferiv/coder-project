$(document).ready(function() {
var $form = $("#create-product-form");
$form.submit((e) => {
    e.preventDefault();
    var formData = $form.serializeArray();
    var jsonData = {};

    $.map(formData, function(n, i){
        jsonData[n['name']] = n['value'];
    });

    /*createProduct(jsonData);*/
    createProductSocket(jsonData);
})

var $newMessage = $('#create-message-form');
$newMessage.submit((e) => {
    e.preventDefault();
    var messageData = $newMessage.serializeArray();
    var msgJsonData = {};

    $.map(messageData, function(n, i) {
        msgJsonData[n['name']] = n['value'];
    })

    sendNewMessage(msgJsonData);
})
});

var socket = io();

socket.on('newproduct', newProduct => {
$('#products-table tr:last').after(`<tr scope="row"><td>${newProduct.name}</td><td>${newProduct.price}</td><td><img src="${newProduct.thumbnail}" alt="${newProduct.name}" class="img-thumbnail resized_image"></td></tr>`);
});

socket.on('productsList', products => {
    compileProductsTemplate(products)
});

socket.on('chatMessagesList', chatMessages => {
    compileChatMessagesTemplate(chatMessages);
});

socket.on('newMessage', chatMessages => {
    $('#chatMessagesList tr:first').before(`<tr scope="row"><td class="msgUploadDate">${chatMessages.uploadDate}</td><td class="msgEmail">${chatMessages.email}</td><td class="msgMessage">${chatMessages.message}</td></tr>`)
});

socket.on('productCreatedResponse', status => {
    if (status?.error)
        showAlert("#product-create-alert", status.error, "error");
    if (status?.success)
        showAlert("#product-create-alert", status.success, "success");
});

function sendNewMessage(message) {
    socket.emit('newMessage', message);
    $("#create-message-form")[0].reset();
    showAlert("#message-create-alert", "Message sent!", "success")
}

function createProductSocket(prd) {
    socket.emit('newProduct', prd);
    $("#create-product-form")[0].reset();
}

function showAlert(alertId, message, type) {
    var alert = $(alertId)
    alert.removeClass()
    alert.html(message)
    if (type === 'error') {
        alert.addClass("alert alert-danger")
    }

    if (type === 'success') {
        alert.addClass("alert alert-success")
    }

    alert.show('fade');

    $(alertId).delay(3000).slideUp(200, function() {
        $(this).hide('fade');
    });
}

function compileProductsTemplate(products) {
    var productsTemplate = $('#products-template').html();
    var compiledProductsTemplate = Handlebars.compile(productsTemplate);
    var context = {
        "products": products,
        "exists": products.length > 0 
    }

    var tableContainer = $('.table-container');
    tableContainer.html(compiledProductsTemplate({context}));
    $('.datatable').DataTable();
}

function compileChatMessagesTemplate(chatMessages) {
    var chatMessagesTemplate = $('#chatMessages-template').html();
    var compiledChatMessagesTemplate = Handlebars.compile(chatMessagesTemplate);
    var context = {
        "chatMessages": chatMessages,
    }
    var chatConteiner = $('.chat-container');
    chatConteiner.html(compiledChatMessagesTemplate({context}));
    $('.chatDatatable').DataTable({
        "order": [[ 0, "desc" ]]
    });
}

function createNewChatMessage(msg, socket) {
    socket.emit('newMessage', msg);
}