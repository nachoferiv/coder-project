const fs = require('fs');
const path = require("path");

class DALChatMessages {
    constructor() {
        this.filepath = path.resolve(__dirname, `./storage/chatMessages.js`);
    };

    read = async function () {
        try {
            const chatMessagesJSON = await fs.promises.readFile(this.filepath);
            const rawChatMessages = JSON.parse(chatMessagesJSON.toString());

            return rawChatMessages;
        } catch {
            return [];
        }
    }

    save = async function (chatMessage) {
        try {
            const fileContent = await this.read();
            const latestObj = fileContent.reduce((prev, curr) => {
                return (prev.id > curr.id) ?  prev : curr
            });

            const id = latestObj.id + 1;
            const d = new Date();;
            const uploadDate = String(d.getDate()).padStart(2, "0")  + '/' + (String(d.getMonth()+1).padStart(2, "0")) + '/' + String(d.getFullYear()).padStart(2, "0") + ' ' + String(d.getHours()).padStart(2, "0") + ':' + String(d.getMinutes()).padStart(2, "0") + ':' + String(d.getSeconds()).padStart(2, "0");

            const dbChatMessage = {
                id,
                email: chatMessage.email,
                message: chatMessage.message,
                uploadDate: uploadDate
            }

            fileContent.push(dbChatMessage)
            await fs.promises.writeFile(this.filepath, JSON.stringify(fileContent, null, '\t'))  
            
            return chatMessage;

        } catch(e) {
            console.log(e)
            return false;
        }
    }
}

module.exports = DALChatMessages;