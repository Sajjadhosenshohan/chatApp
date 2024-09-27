const express = require('express');
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const Connection = require('./db.js');
const Chat = require('./models/Chat.js');

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

Connection();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Load previous messages for the room
const loadMessages = async (socket, sender, receiver) => {
    try {
        const messages = await Chat.find({
            $or: [
                { senderUsername: sender, receiverUsername: receiver },
                { senderUsername: receiver, receiverUsername: sender }
            ]
        }).sort({ timestamp: 1 }).exec();

        // Emit the chat messages to the client
        socket.emit('chat', messages);
    } catch (err) {
        console.log(err);
    }
}

io.on("connection", (socket) => {
    console.log("connected");

    // Join room and load previous chat messages
    socket.on('joinRoom', ({ sender, receiver }) => {
        const room = [sender, receiver].sort().join('-'); // Room ID based on sender and receiver
        socket.join(room); // Join the room
        loadMessages(socket, sender, receiver); // Load messages for the room
    });

    // Handle new messages
    socket.on('newMessage', async (msg) => {
        const room = [msg.senderUsername, msg.receiverUsername].sort().join('-'); // Use same room ID
        try {
            const newMessage = new Chat(msg);
            await newMessage.save();
            io.to(room).emit('message', msg); // Send message only to the room
        } catch (err) {
            console.log(err);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("disconnect");
    });
});

server.listen(PORT, () => {
    console.log("running on port 8080");
});
