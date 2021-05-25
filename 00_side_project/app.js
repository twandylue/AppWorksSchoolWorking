require("dotenv").config();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = PORT;
const { ROOM_TEST } = process.env;
// console.log(ROOM_TEST);

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
        require("./server/routes/chatroom_route"),
        require("./server/routes/pairAns_route")
    ]
);

const { genMultiCardsNumber } = require("./server/models/genMultiCardsNumber");
app.post("/test1", (req, res) => {
    const target = req.body.data.target;
    const totalCards = req.body.data.number;
    const cardsObj = genMultiCardsNumber(target, totalCards);
    // console.log(cardsObj);
    res.send(cardsObj);
});

const { saveCardsSetting } = require("./server/models/saveCardsSetting_model");
app.post("/test2", (req, res) => {
    const cardsSetting = req.body.data.cardsSetting;
    const room = req.body.data.game_id;
    const round = req.body.data.round;
    // console.log(cardsSetting);
    const cardsObj = saveCardsSetting(cardsSetting, room, round);
    // console.log(cardsObj);
    res.send("cardsObj");
});

const socketModule = require("./server/models/socket_model");
io.on("connection", (socket) => {
    socket.join(ROOM_TEST); // 有多人配對功能時 不能寫死 待改
    console.log(`user: ${socket.id} connected`);

    // console.log("==================");
    // console.log(io.sockets.adapter.sids.get(socket.id)); // 可以找到room
    // console.log("==================");

    // console.log(socket.adapter.rooms);
    // socketModule.joinRomm(socket);
    socketModule.chat(socket);
    socketModule.getOpponentName(socket);
    socketModule.ClickCardinGame(socket);
    socketModule.startGameLoop(socket);
    // socketModule.checkMatch(socket);

    socket.on("disconnect", () => {
        console.log(`user: ${socket.id} 
        disconnected`);
        // console.log(socket.adapter.rooms.get(ROOM_TEST));
    });
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

// module.exports = {
//     app
// };
