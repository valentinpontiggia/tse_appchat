const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require("socket.io");
const {formatMessage, formatPrivateMessage} = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const ChatBot = {avatar: "https://cdn-icons-png.flaticon.com/512/1786/1786548.png", username: "AppChat Bot"};

io.on('connection', (socket) => {
    socket.on('joinRoom',({ username, room, is_typing, avatar}) => {
        if (room.startsWith('private-')) {
            // Get the recipient's username from the room name
            const recipient = room.split('-')[1];
            // Have the user join the private room
            console.log("recipieeent :"+recipient);
            console.log("room : "+room);
            const user = userJoin(socket.id, username, room, is_typing, avatar);
            socket.join(user.room);
            //socket.to(user.room).emit('message', formatMessage(botName,'Private room...'));
            if(io.sockets.adapter.rooms[user.room]){
                socket.to(user.room).emit('message', formatMessage(botName,'Private room...'));
            }
        
        } else {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(ChatBot.avatar, ChatBot.username, 'Welcome here'));
        socket.broadcast.to(user.room).emit('message', formatMessage(ChatBot.avatar, ChatBot.username, user.username + ' has joined the chat.'));

        io.to(user.room).emit('roomUsers', {room : user.room, users: getRoomUsers(user.room)});
        }
    });

    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
  
        if(user){
            io.to(user.room).emit('message', formatMessage(ChatBot.avatar, ChatBot.username, user.username + ' has left the chat.'));
            io.to(user.room).emit('roomUsers', {room : user.room, users: getRoomUsers(user.room)});
        }
    });

    socket.on("privateMessage", ({ recipient, msg }) => {
        // Emit private message event to intended recipient
        const user = getCurrentUser(socket.id);
        console.log("recipient : " + recipient );
        io.to(recipient.id).emit("privateMessage", formatPrivateMessage(user.username, msg, recipient));
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.avatar, user.username, msg));
        // If a message is sent, the user is done with typing. The following lines update the user status.
        user.is_typing = "";
        io.to(user.room).emit('roomUsers', {room : user.room, users: getRoomUsers(user.room)});
    });

    // This part updates the user status while the user is typing
    socket.on('updateUserStatus', (is_typing) => {
        const user = getCurrentUser(socket.id);
        user.is_typing = is_typing;
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
    });
});

const PORT = 3000;

server.listen(PORT, ()=>console.log(`Server running on ${PORT}`));