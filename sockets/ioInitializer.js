const ioInitializer = {
    initialize: (io) => {
        io.on('connection', socket => {
            console.log('New user connected at socket ' + socket.id);
        });
    }
}

module.exports = ioInitializer;