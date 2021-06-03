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

// const { statRecord } = require("./server/models/record_summary_model");
// const { pool } = require("./server/models/mysqlcon");
// app.post("/test", async (req, res) => {
//     const { gameID, roomID, rounds } = req.body.data;
//     // console.log({ gameID, roomID, rounds });
//     const conn = await pool.getConnection();
//     // console.log(pool.format("SELECT id, rounds FROM game_setting_info WHERE id > ? ", 1344));
//     const results = await conn.query("SELECT id, rounds FROM game_setting_info WHERE id >= ? ", 1343);
//     console.log(results[0]);
//     for (const i in results[0]) {
//         await statRecord(results[0][i].id, roomID, results[0][i].rounds);
//         console.log(`${i} =======`);
//     }
//     await conn.release();

//     // await statRecord(gameID, roomID, rounds);
//     res.send("finished");
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
const { client } = require("./server/models/cache_model");
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
        try {
            console.log(`user: ${socket.info.email} disconnected`);
            const gameID = await roomModule.findGameID(socket.info.email);
            if (gameID) {
                console.log(`gameID: ${gameID} is over`);
                client.del(gameID); // 斷線時 初始化cache 該gameID的cardSstting
            }
            client.del(socket.info.email); // 中途離開時初始化cache 該使用者點擊過的卡片
            client.del(socket.info.roomID); // 中途離開時 或遊戲結束時 初始化cache 該房間的倒數計器
            const roomID = await roomModule.leaveRoom(socket.info.email);
            if (roomID) {
                socket.emit("leave room", "you leave the room"); // 無用 因為重新連線後找不到原始socket id
                socket.to(roomID).emit("opponent leave room", "oppo leave the room");
            }
            const roomInfo = await roomModule.getRoomLobbyInfo();
            io.emit("room info", roomInfo); // 更新大廳資訊
        } catch (err) {
            console.log(`disconnect err: ${err}`);
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
