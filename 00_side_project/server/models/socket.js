const { pool } = require("./mysqlcon");
const { setGameRules } = require("./gameRulesSetting");

const chat = function (socket) {
    socket.on("chat message", (msg) => {
        console.log("message " + msg);
        // console.log(socket.id);
        socket.emit("chat message", msg);
        socket.to("room1").emit("chat message", msg);
    });
};

const settingRules = function (socket) {
    // 在有多人對戰的功能情況下 要考慮room的專一性
    socket.on("rules", async (rules) => {
        console.log(socket.id);
        console.log(rules);
        await setGameRules(rules, socket);
        rules.state = "in ready";
        // rules.state = "start";
        socket.emit("execute rules", rules);
        socket.to("room1").emit("execute rules", rules);
        // 如果要從資料庫抓rules 需要注意存進資料庫沒(await 延遲問題)
    });
};

const countdowninReady = function (socket) {
    socket.on("in ready", (time) => {
        function timeDecrease () {
            if (time >= 0) {
                console.log("time: " + time);
                socket.emit("countdown in ready", time);
                socket.to("room1").emit("countdown in ready", time);
            } else if (time === 0) {
                socket.emit("start game", "start!!!");
                socket.to("room1").emit("start game", "start!!!");
            }
            time--;
        }
        setInterval(timeDecrease, 1000);
    });
};

module.exports = {
    chat,
    settingRules,
    countdowninReady
};
