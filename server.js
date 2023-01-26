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

const botName = 'AppChat Bot';

io.on('connection', (socket) => {
    socket.on('joinRoom',({ username, room, is_typing, avatar}) => {
        const user = userJoin(socket.id, username, room, is_typing, avatar);
        socket.join(user.room);
        socket.emit('message', formatMessage(botName,'Welcome here'));
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, user.username+ ' has joined the chat'));

        io.to(user.room).emit('roomUsers',{room : user.room, users: getRoomUsers(user.room)});
    });

    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
  
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, user.username+ ' has left the chat'));
            io.to(user.room).emit('roomUsers',{room : user.room, users: getRoomUsers(user.room)});
        }
    });

    socket.on("privateMessage", ({ recipient, msg }) => {
        // Emit private message event to intended recipient
        const user = getCurrentUser(socket.id);
        console.log("recipient : " + recipient);
        io.to(recipient).emit("privateMessage", formatPrivateMessage(user.username, msg, recipient));
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
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