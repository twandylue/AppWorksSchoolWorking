// const { mysql } = require("./mysqlcon");
// const joinRoom = function (socket) {

// }

const chat = function (socket) {
    socket.on("chat message", (msg) => {
        // mysql.query(...)
        console.log("message: " + msg);
        socket.emit("chat message", msg);
        socket.to("room1").emit("chat message", msg);
        console.log(socket.adapter.rooms.get("room1"));
    });
};

const getReady = function (socket) {
    socket.on("status", (msg) => {
        if (msg === "ready to go") {
            console.log("in!");
            socket.emit("status", "read_to_start");
            socket.to("room1").emit("status", "read_to_start");
        }
    });
};

const countdownforReady = function (socket) {
    socket.on("join_game", (time) => {
        function timeDecrease () {
            if (time > 0) {
                console.log("time: " + time);
                time--;
                socket.emit("count_down_ready", time);
                socket.to("room1").emit("count_down_ready", time);
            }
        }
        setInterval(timeDecrease, 1000);
    });
};

module.exports = {
    // chat: chat
    chat,
    getReady,
    countdownforReady
};
