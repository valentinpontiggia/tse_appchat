const express = require('express');
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
    var users = [];
    socket.on('login', function (user) {
        console.log(user);
        user_log = user.username;
    });
    socket.on('welcome message', (username) => {
      console.log('new user : ' + username);
      users.push(username);
      io.emit('chat message', username + " has arrived !");
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', "<b>" + user_log + " : </b>" + msg);
    });

        socket.on('typing', (data)=>{
            socket.broadcast.emit('typing',data) ;         
        });

    socket.on("disconnect", () => {
        console.log(user_log + " left.");
        remove_user(users, user_log);
        io.emit('chat message', user_log + " left.");
    });
    io.emit(users);
});

function remove_user(users, username) {
    for (i = 0; i < users; i++) {
        if (users[i] == username) {
            users.splice(i, 1);
        }
    }
    return users;
}

let connectedUsers = [];

io.on('connection', (socket) => {
    // When a user connects, add them to the connectedUsers list
    socket.on('login', (data) => {
        connectedUsers.push(data.username);
        io.emit('updateUsers', connectedUsers);
    });

    // When a user disconnects, remove them from the connectedUsers list
    socket.on('disconnect', () => {
        const index = connectedUsers.indexOf(socket.username);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            io.emit('updateUsers', connectedUsers);
        }
    });
});



server.listen(3000, () => {
    console.log('listening on :3000');
});