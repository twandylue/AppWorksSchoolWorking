require("dotenv").config();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = PORT;

// Express initialization
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Server = require("socket.io").Server;
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/" + API_VERSION,
    [
        require("./server/routes/match_route"),
        require("./server/routes/chatroom_route")
        // require("./server/routes/countdown_route")
    ]
);

app.get("/test", (req, res) => {
    console.log("test_app");
});

const { chat, getReady, countdownforReady } = require("./server/models/socket");
io.on("connection", (socket) => {
    socket.join("room1");
    console.log("user connected");
    chat(socket);
    getReady(socket);
    countdownforReady(socket);
    // console.log(socket.adapter.rooms.get("room1"));
});

// page not found
// app.use(function (req, res, next) {
//     res.status(404).sendFile(__dirname + "/public/404.html");
// });

// if (NODE_ENV !== "production") {
//     app.listen(port, () => {
//         console.log(`App listening on port: ${port}`);
//     });
// }

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

// app.listen(3000, () => {
//     console.log("App listening on port: 3000");
// });

module.exports = app;
