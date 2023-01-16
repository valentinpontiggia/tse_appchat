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
    socket.on('login', function (user) {
        console.log(user);
        user_log = user.username
    });
    socket.on('welcome message', (username) => {
      console.log('new user : ' + username);
      io.emit('chat message', username+ " est arrivé !");
  });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', "<b>"+user_log+" : </b>" + msg);
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});