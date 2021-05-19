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
    let time = 2;
    socket.on("in ready", () => {
        function timeDecrease (socketId) {
            if (time < 0) {
                return;
            }
            console.log("Ready time: " + time);
            socket.emit("countdown in ready", time);
            socket.to("room1").emit("countdown in ready", time);
            if (time === 0) {
                const rules = getGameRules(socket);
                rules.state = "start";
                socket.emit("start game", rules);
                socket.to("room1").emit("start game", rules);
            }
            time--;
        }
        setInterval(timeDecrease, 1000);
    });
};

const countdowninGame = function (socket) {
    let time = 6000;
    socket.on("in game", (socketId) => { // 會有倒數延遲的問題
        function timeDecrease () {
            if (time < 0) {
                return;
            }
            console.log(`${socketId} Game time: ` + time); //
            socket.emit("countdown in game", time); // 對自己
            socket.to("room1").emit("countdown in game", time); // 對其他人
            time--;
        }
        setInterval(timeDecrease, 1000);
    });
};

const inGameClickCard = function (socket) {
    socket.on("click card", async (cardId) => {
        // const msg = socket.id + ": " + index;
        socket.to("room1").emit("opposite click card", cardId); // 對其他人
        console.log(socket.id + ": " + cardId);
    });
};

module.exports = {
    chat,
    settingRules,
    countdowninReady,
    countdowninGame,
    inGameClickCard
};
