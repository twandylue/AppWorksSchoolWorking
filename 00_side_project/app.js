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
        require("./server/routes/chatroom_route"),
        require("./server/routes/pairAns_route")
    ]
);

const { genMultiCardsNumber } = require("./server/models/genMultiCardsNumber");
app.post("/test", (req, res) => {
    const target = req.body.data.target;
    const totalCards = req.body.data.number;
    const cardsObj = genMultiCardsNumber(target, totalCards);
    // console.log(cardsObj);
    res.send(cardsObj);
});

const { chat, getOpponentName, setRules, countdowninReady, countdowninGame, inGameClickCard } = require("./server/models/socket");
io.on("connection", (socket) => {
    socket.join("room1"); // 有多人配對功能時 不能寫死 待改
    console.log(`user: ${socket.id} connected`);

    chat(socket);
    getOpponentName(socket);
    setRules(socket);
    countdowninReady(socket);
    inGameClickCard(socket);
    countdowninGame(socket);

    socket.on("disconnect", () => {
        console.log(`user: ${socket.id} 
        disconnected`);
        // console.log(socket.adapter.rooms.get("room1"));
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

module.exports = app;
