const { pool } = require("./mysqlcon");
const { setGameRules } = require("./gameRulesSetting");
const { getGameRules } = require("./getGameRules");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");
const { updateNowRound } = require("./updateNowRound");

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

const startGameLoop = function (socket) {
    socket.on("start game loop", (rules) => {
        gameloop(socket, rules);
    });
};

const gameloop = async function (socket, rules) {
    // 設置卡片
    console.log(rules);
    await setGameRules(rules, socket);
    rules.state = "in ready";
    const target = rules.targets[0]; // 初始化
    const cardsSetting = genMultiCardsNumber(target, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲
    // --- save cardsSetting into mysql
    const info = {
        round: 1, // round init
        target: target,
        rules: rules,
        cardsSetting: cardsSetting
    };
    // save cardsSetting into mysql--------
    socket.emit("execute rules", info); // 初始化
    socket.to("room1").emit("execute rules", info);

    for (let i = 0; i < 3; i++) {
        let readyTime = 5;
        while (readyTime >= 0) { // countdown in ready
            socket.emit("countdown in ready", readyTime);
            socket.to("room1").emit("countdown in ready", readyTime);
            await delay(1000);
            readyTime--;
        }

        const info = {
            msg: "start"
        };
        socket.emit("start game", info); // start game 翻牌
        socket.to("room1").emit("start game", info);

        let gameTime = 10;
        while (gameTime >= 0) { // countdown in game
            socket.emit("countdown in game", gameTime); // 對自己
            socket.to("room1").emit("countdown in game", gameTime); // 對其他人
            await delay(1000);
            gameTime--;
        }

        // round結束
        const rules = await getGameRules(socket);
        const nowRound = await updateNowRound(socket);

        console.log("now round: " + nowRound);

        if (nowRound > rules.rounds) {
            console.log("================");
            console.log("break i: " + i);
            console.log("break now round: " + nowRound);
            break; //  注意
        }
        const nowTarget = rules.targets[nowRound - 1]; // get target of round
        const cardsSetting = genMultiCardsNumber(nowTarget, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲
        // --- save cardsSetting into mysql

        rules.state = "in ready";
        const nextRoundInfo = {
            round: nowRound,
            target: nowTarget,
            rules: rules,
            cardsSetting: cardsSetting
        };
        socket.emit("next round execute rules", nextRoundInfo);
        socket.to("room1").emit("next round execute rules", nextRoundInfo);
    }

    console.log("========over========");
    socket.emit("game over", "over!!!"); // 可以傳送由系統係資訊
    socket.to("room1").emit("game over", "over!!!"); // 可以傳送由系統係資訊
};

function delay (Time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("1s"); }, Time);
    });
}

// const getRulesandStart = function (socket) {
//     // const sql = "SELECT now_round FROM round_count WHERE game_id = ?"
//     // let room;
//     // for (const i of socket.adapter.rooms.keys()) {
//     //     if (i.length === 5) { // room名稱待改
//     //         room = i;
//     //     }
//     // }
//     // const sql = "SELECT * FROM round_count WHERE game_id = ?";
//     // const data = [room];
//     // const result = await pool.query(sql, [[data]]); // 出現幻讀 ?
//     // const nowRound = result[0][0].now_round;
//     // console.log("Start now round: " + nowRound);
//     const info = {
//         msg: "start"
//         // round: nowRound
//     };
//     socket.emit("start game", info);
//     socket.to("room1").emit("start game", info);

//     const gameTime = 10;
//     // countdowninGame(gameTime, socket);
// };

const inGameClickCard = function (socket) {
    socket.on("click card", async (cardId) => {
        // select card value from sql and check if they are in pair.
        socket.to("room1").emit("opposite click card", cardId); // 對其他人
        console.log(socket.id + " click card: " + cardId);
    });
};

module.exports = {
    chat,
    getOpponentName,
    inGameClickCard,
    startGameLoop
};
