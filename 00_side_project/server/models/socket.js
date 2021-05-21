const { pool } = require("./mysqlcon");
const { setGameRules } = require("./gameRulesSetting");
const { getGameRules } = require("./getGameRules");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");

const chat = function (socket) {
    socket.on("chat message", (msg) => {
        console.log("message " + msg);
        socket.emit("chat message", msg);
        socket.to("room1").emit("chat message", msg);
    });
};

const getOpponentName = function (socket) {
    socket.on("name decided", (name) => {
        socket.to("room1").emit("opponent name", name);
    });
};

const setRules = function (socket) {
    // 在有多人對戰的功能情況下 要考慮room的專一性
    socket.on("rules", async (rules) => {
        console.log(socket.id);
        console.log(rules);
        await setGameRules(rules, socket);
        rules.state = "in ready";
        const cardsSetting = genMultiCardsNumber(rules.rounds, rules.targets, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲
        const info = {
            rules: rules,
            cardsSetting: cardsSetting
        };
        // save into mysql--------
        console.log(info);
        console.log(info.cardsSetting[0].cardsObj);
        // socket.emit("execute rules", info);
        // socket.to("room1").emit("execute rules", info);
        // 如果要從資料庫抓rules 需要注意存進資料庫沒(await 延遲問題)
    });
};

const countdowninReady = function (socket) {
    let time = 5;
    socket.on("in ready", () => {
        function timeDecrease (socketId) {
            if (time < 0) {
                return;
            }
            console.log("Ready time: " + time);
            socket.emit("countdown in ready", time);
            socket.to("room1").emit("countdown in ready", time);
            if (time === 0) {
                getRulesandStart(socket);
            }
            time--;
        }
        setInterval(timeDecrease, 1000);
    });
};

const getRulesandStart = function (socket) {
    const rules = getGameRules(socket);
    rules.state = "start";
    socket.emit("start game", rules);
    socket.to("room1").emit("start game", rules);
};

const countdowninGame = function (socket) {
    let time = 6000;
    socket.on("in game", (socketId) => {
        function timeDecrease () {
            if (time < 0) {
                return;
            }
            console.log(`${socketId} Game time: ` + time);
            socket.emit("countdown in game", time); // 對自己
            socket.to("room1").emit("countdown in game", time); // 對其他人
            time--;
        }
        setInterval(timeDecrease, 1000);
    });
};

const inGameClickCard = function (socket) {
    socket.on("click card", async (cardId) => {
        socket.to("room1").emit("opposite click card", cardId); // 對其他人
        console.log(socket.id + " click card: " + cardId);
    });
};

module.exports = {
    chat,
    getOpponentName,
    setRules,
    countdowninReady,
    countdowninGame,
    inGameClickCard
};
