var socket = require('socket.io');
var express = require('express');
var http = require('http');

var app = express();
app.use(express.static('public'));
var server = http.createServer(app);

//server.use
var io = socket.listen(server);
server.listen(3000);

var userArrs = [];

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

app.get('/', function (req, res) {
    res.sendFile('views/index.html', {root: __dirname})
});

io.on("connection", function (socket) {
    console.log('co nguoi');

    socket.on('client-send-username', function (data) {
        if (userArrs.indexOf(data) >= 0) {
            socket.emit('client-regist-fail', data);
        } else {
            userArrs.push(data);
            socket.username = data;
            socket.usercolor = getRandomColor();
            socket.emit('client-regist-success', data);
            io.sockets.emit('update-user', userArrs);
        }
    });
    socket.on('logout', function () {
        var index = userArrs.indexOf(socket.username);
        if (index > -1) {
            userArrs.splice(index, 1);
        }
        socket.broadcast.emit('update-user', userArrs);
        socket.emit('client-logout', socket.username);
        socket.broadcast.emit('other-logout', socket.username);
    });

    socket.on('client-send-message', function (data) {
        io.sockets.emit('update-message', {user: socket.username, message: data, color: socket.usercolor});
    });
    socket.on('typing', function () {
        socket.broadcast.emit('other-typing', {user: socket.username, color: socket.usercolor});
    });
    socket.on('stop-typing', function () {
        socket.broadcast.emit('other-stop-typing');
    });
});