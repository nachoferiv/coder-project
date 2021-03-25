const ioInitializer = {
    initialize: (io) => {
        io.on('connection', socket => {
            console.log('New user connected at socket ' + socket.id);

            socket.on('item-created', data => {
                //devolver lista de items updateada
                io.sockets.emit('itemlist-updated', 'lista de items');
            });
        });
    }
}

module.exports = ioInitializer;