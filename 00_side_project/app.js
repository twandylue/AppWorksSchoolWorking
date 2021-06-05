require("dotenv").config();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = PORT;
const { TOKEN_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const path = require("path");

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

// const { statRecordSingle } = require("./server/models/record_summary_model");
// const { pool } = require("./server/models/mysqlcon");
// app.post("/test", async (req, res) => {
//     const { gameID, roomID, rounds } = req.body.data;
//     // const members = ["robot", "amy@gmail.com"];
//     const members = [{ email: "test_robot", name: "Robot" }, { email: "amy@gmail.com", name: "amy" }]; // 待確認

//     // console.log({ gameID, roomID, rounds });
//     const conn = await pool.getConnection();
//     await statRecordSingle(gameID, roomID, rounds, members);
//     await conn.release();
//     res.send("finished");
// });

// API routes
app.use("/api/" + API_VERSION,
    [
        require("./server/routes/user_route"),
        require("./server/routes/replay_route")
    ]
);

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "/public/gamelobby.html"));
});

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

    socket.on("disconnect", async () => { // play with robot 會無法刪除gameID and roomID 因為沒把相關資料存進DB中
        try {
            console.log(`user: ${socket.info.email} disconnected`);

            const gameID = await roomModule.findGameID(socket.info.email);
            if (gameID) {
                console.log(`gameID: ${gameID} is over`);
                client.del(socket.info.email); // 中途離開時初始化cache 該使用者點擊過的卡片
                client.del(socket.info.roomID); // 中途離開時 或遊戲結束時 初始化cache 該房間的倒數計器
                client.del(gameID); // 斷線時 初始化cache 該gameID的cardSstting
                client.del(`${gameID}_matchNumberList`); // 單人模式中有使用 初始化已配對卡片清單
                client.del(`${gameID}_switch`); // 單人模式中有使用 停止robot運作 關機
                client.del(`${gameID}_robot`); // 單人模式中使用 玩家中途離開時初始化cache 該遊戲中機器人點擊過的卡片
            }

            if (socket.info.status === 1) {
                const state = await roomModule.leaveRoomwithRobot(socket.info.email);
                if (state) {
                    socket.emit("leave room", "you have left the room"); // 無用 因為重新連線後找不到原始socket id
                    // console.log(socket.info.roomID);
                    // socket.to(socket.info.roomID).emit("opponent leave room", "oppo leave the room");
                }
            } else if (socket.info.status === 2) {
                const roomID = await roomModule.leaveRoom(socket.info.email);
                if (roomID) {
                    socket.emit("leave room", "you have left the room"); // 無用 因為重新連線後找不到原始socket id
                    socket.to(roomID).emit("opponent leave room", "oppo leave the room");
                }
            }
            const roomInfo = await roomModule.getRoomLobbyInfo();
            io.emit("room info", roomInfo); // 更新大廳資訊
        } catch (err) {
            console.log(`disconnect err: ${err}`);
        }
    });
});

// page not found
// app.use(function (req, res, next) {
//     res.status(404).sendFile(__dirname + "/public/404.html");
// });

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
