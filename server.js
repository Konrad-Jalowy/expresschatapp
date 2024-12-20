const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};
let users_number = 0;

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render("chat");
});

io.on('connection', (socket) => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        users_number++;
        socket.broadcast.emit('user-connected', name);
        io.emit("users-number-change", users_number);
      });

    socket.on('send-chat-message', message => {
        io.emit('chat-message', { message: message, name: users[socket.id] })
      })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id];
        users_number--;
        io.emit("users-number-change", users_number);
      })
  });

server.listen(3000, () => {
  console.log('listening on http://localhost:3000/');
});