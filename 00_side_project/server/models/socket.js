const { pool } = require("./mysqlcon");
const { setGameRules } = require("./gameRulesSetting");
const { getGameRules } = require("./getGameRules");

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
    socket.on("in ready", async (time) => {
        async function timeDecrease () {
            if (time === 0) {
                const rules = await getGameRules(socket);
                // console.log(rules);
                rules.state = "start";
                socket.emit("start game", rules);
                socket.to("room1").emit("start game", rules);
                // socket.emit("start game", "start!!!");
                // socket.to("room1").emit("start game", "start!!!");
            } else if (time < 0) {
                return;
            }
            console.log("Ready time: " + time);
            socket.emit("countdown in ready", time);
            socket.to("room1").emit("countdown in ready", time);
            time--;
        }
        await setInterval(timeDecrease, 1000);
    });
};

const countdowninGame = function (socket) {
    socket.on("in game", async (time) => {
        async function timeDecrease () {
            if (time < 0) {
                return;
            }
            console.log("Game time: " + time);
            socket.emit("countdown in game", time); // 對自己
            socket.to("room1").emit("countdown in game", time); // 對其他人
            time--;
        }
        await setInterval(timeDecrease, 1000);
    });
};

module.exports = {
    chat,
    settingRules,
    countdowninReady,
    countdowninGame
};
