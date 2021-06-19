var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

const users = [];

io.on('connection', function(socket){
    console.log('a user connected:' + socket.id);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', `${socket.id.substring(0,4)}: ${msg}`);
    });
});

if (require.main === module) {
    http.listen(3000, function(){
        console.log('listening on port: 3000');
    });
}

module.exports = http;
