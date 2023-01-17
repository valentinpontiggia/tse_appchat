/*const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
    var user_log = ''

    socket.on('login', function (user) {
        user_log = user.username;
    });

    socket.on('welcome message', (username) => {
      io.emit('chat message', username + " has arrived !");
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', "<b>" + user_log + " : </b>" + msg);
    });

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing',data) ;         
    });

    socket.on("disconnect", () => {
        io.emit('chat message', user_log + " left.");
    });
});

let connectedUsers = [];

io.on('connection', (socket) => {
    var user;
    // When a user connects, add them to the connectedUsers list
    socket.on('login', (data) => {
        user = data.username;
        connectedUsers.push(data.username);
        io.emit('updateUsers', connectedUsers);
    });

    // When a user disconnects, remove them from the connectedUsers list
    socket.on('disconnect', () => {
        if (connectedUsers.indexOf(user) != -1) {
            connectedUsers.splice(connectedUsers.indexOf(user), 1);
        }
        io.emit('updateUsers', connectedUsers);
    });
});



server.listen(3000, () => {
    console.log('listening on :3000');
});*/

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

io.on('connection', (socket) => {
    socket.on('joinRoom',({ username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName,'Welcome here'));
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, user.username+ ' has joined the chat'));

        io.to(user.room).emit('roomUsers',{room : user.room, users: getRoomUsers(user.room)});
    });
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);

        if(user){
        io.to(user.room).emit('message', formatMessage(botName, + user.username+ ' has left the chat'));
        io.to(user.room).emit('roomUsers',{room : user.room, users: getRoomUsers(user.room)});
        }
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    /*socket.on('typing', (username)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).broadcast.emit('typing', username) ;         
    });*/
});

const PORT = 3000;

server.listen(PORT, ()=>console.log(`Server running on ${PORT}`));