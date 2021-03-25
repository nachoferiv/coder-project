const socket = io('http://localhost:3000/');
const ItemsSocketHandler = require('./clientSockets/ItemsSocketHandler');

const itemsSocketHandler = ItemsSocketHandler(socket);