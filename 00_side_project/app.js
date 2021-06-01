require("dotenv").config();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = PORT;
const { TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");

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

// const { client, getCache } = require("./server/models/cache_model");
// app.get("/test", async (req, res) => {
//     // client.set("test1", "testCache");
//     const test = await getCache("test"); // if not exist, return null
//     console.log(test);
//     res.send("test");
// });

// API routes
app.use("/api/" + API_VERSION,
    [
        require("./server/routes/user_route"),
        require("./server/routes/match_route"),
        require("./server/routes/pairAns_route")
    ]
);

io.use((socket, next) => {
    const { token } = socket.handshake.auth;
    if (token === null) {
        const err = new Error("尚未登入");
        next(err);
    } else {
        jwt.verify(token, TOKEN_SECRET, (err, result) => {
            if (err) {
                const err = new Error("登入失敗");
                next(err);
            } else {
                socket.info = result;
                next();
            }
        });
    }
});

const roomModule = require("./server/models/Room_model");
const socketModule = require("./server/models/socket_model");
io.on("connection", async (socket) => {
    console.log(`user: ${socket.info.email} connected`);
    // console.log(socket.info);
    socketModule.getUserInfo(socket, io);
    socketModule.updateRoomLobbyinfo(socket, io);
    socketModule.Room(socket, io); // join room
    socketModule.processinRoom(socket, io);
    socketModule.ClickCardinGame(socket, io);
    socketModule.chat(socket, io);

    socket.on("disconnect", async () => {
        console.log(`user: ${socket.info.email} disconnected`);
        const roomID = await roomModule.leaveRoom(socket.info.email);
        if (roomID) {
            socket.emit("leave room", "you leave the room"); // 無用 因為重新連線後找不到原始socket id
            socket.to(roomID).emit("opponent leave room", "oppo leave the room");
        }
        // const { token } = socket.handshake.auth;
        // if (token) {
        //     const user = jwt.verify(token, TOKEN_SECRET);
        //     const roomID = await roomModule.leaveRoom(user.email);
        //     if (roomID) {
        //         socket.emit("leave room", "you leave the room"); // 無用 因為重新連線後找不到原始socket id
        //         socket.to(roomID).emit("opponent leave room", "oppo leave the room");
        //     }
        // }
    });
});

// page not found
// app.use(function (req, res, next) {
//     res.status(404).sendFile(__dirname + "/public/404.html");
// });

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
