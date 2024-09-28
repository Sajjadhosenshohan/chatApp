const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    senderUsername: String,
    receiverUsername: String,
    message: String,
    avatar: String,
    timestamp: {type: Date, default: Date.now}
})

const Chat = mongoose.model('chatMe', chatSchema)
module.exports = Chat
