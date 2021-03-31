const ChatMessage = require('../entities/ChatMessage');
const DALChatMessages = require('../db/DALChatMessages');
const validator = new (require('../utils/Validator'))();

class ChatMessageController {
    constructor() {
        this.db = new DALChatMessages();
    }

    getAll = async() => {
        const rawData = await this.db.read();
        const chatMessages = rawData.map( m => new ChatMessage(m.email, m.message, m.uploadDate));

        return chatMessages;
    }

    create = (chatMessage) => {
        return this.db.save(chatMessage);
    }

    setChatMessagesListEvent = io => {
        io.on('connection', async socket => {
          const chatMessages = await this.getAll();
          socket.join('chat');
          io.sockets.in('chat').emit('chatMessagesList', chatMessages);

          socket.on('newMessage', async msg => {
            if (!msg.email) {
                socket.emit('invalidMessageCreation', { error: 'Email must be setted' });
                return;
            }
            if (!msg.message) {
                socket.emit('invalidMessageCreation', { error: 'Message must be setted' });
                return;
            }
                
            
            const newMessage = await this.create(msg);
            console.log(newMessage)
            io.sockets.in('chat').emit('newMessage', newMessage)
          });
        });
      }
}

module.exports = ChatMessageController;