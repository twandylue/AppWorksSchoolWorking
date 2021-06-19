const io = require('socket.io-client');
const assert = require('assert');
const http = require("../app");
const port = 3001

// Start server for testing
http.listen(port, function(){console.log(`start test server at port ${port}`)});

const socketURL = `http://localhost:${port}`;
const options ={
    transports: ['websocket'],
    'force new connection': true
};

describe("Chat Server",function(){
    it('Should broadcast new user to all users', function(done){
        const client1 = io.connect(socketURL, options);
        const client2 = io.connect(socketURL, options);
        const client1SendMessage = "I'm client 1";
        client2.on('chat message', function(msg){
            assert.equal(msg, `${client1.id.substring(0,4)}: ${client1SendMessage}`);
            done();
        });
        client1.emit("chat message", client1SendMessage)
    });
});