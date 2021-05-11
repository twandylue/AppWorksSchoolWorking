const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const Server = require("socket.io").Server;
const io = new Server(server);

app.get("/", (req, res) => {
    // res.send("<h1>Hello world</h1>");
    // console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    // console.log(socket);
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        socket.emit("chat message", msg);
    });
    // socket.on("disconnect", () => {
    //     console.log("user disconnected");
    // });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});