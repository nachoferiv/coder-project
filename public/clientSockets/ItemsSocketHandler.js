class ItemsSocketHandler {
    constructor(socket) {
        this.socket = socket;
        this.setEvents();
    }

    setEvents = () => {
        this.socket.on('itemlist-updated', itemsList => {
            // updatear lista de items en el front end
        })
    }
    
    sendItemCreatedMessage = (item) => this.socket.emit('item-created', `Item ${item.name} has been created`);
}

module.exports = ItemsSocketHandler;