require("dotenv").config();
const { STANDBYTIME, ROUNDTIME } = process.env;
const { ROOM_TEST } = process.env;
console.log({ STANDBYTIME, ROUNDTIME });
console.log({ ROOM_TEST });

const { pool } = require("./mysqlcon");
const { setGameRules } = require("./gameRulesSetting");
// const { getGameRules } = require("./getGameRules");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");
// const { updateNowRound } = require("./updateNowRound");
const { saveCardsSetting } = require("./saveCardsSetting_model");
const { getCardNumber } = require("./getCardNumber");

const chat = function (socket) {
    socket.on("chat message", (msg) => {
        console.log("message " + msg);
        socket.emit("chat message", msg);
        socket.to(ROOM_TEST).emit("chat message", msg);
    });
};

const getOpponentName = function (socket) {
    socket.on("name decided", (name) => {
        socket.to(ROOM_TEST).emit("opponent name", name);
    });
};

const startGameLoop = function (socket) {
    socket.on("start game loop", (rules) => {
        gameloop(socket, rules);
    });
};

const gameloop = async function (socket, rules) {
    let round = 1; // init
    // 設置卡片
    console.log(rules);
    await setGameRules(rules, socket);
    rules.state = "in ready";
    let target = rules.targets[0]; // 初始化
    const cardsSetting = genMultiCardsNumber(target, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲
    const info = {
        round: round,
        target: target,
        rules: rules,
        cardsSetting: cardsSetting
    };
    // --- save cardsSetting into mysql
    await saveCardsSetting(cardsSetting, socket, round); /// 可簡化成一個loop？
    socket.emit("execute rules", info); // init
    socket.to(ROOM_TEST).emit("execute rules", info);

    for (let i = 0; i < 3; i++) {
        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready
            socket.emit("countdown in ready", standbyTime);
            socket.to(ROOM_TEST).emit("countdown in ready", standbyTime);
            await delay(1000);
            standbyTime--;
        }

        const info = {
            msg: "start",
            round: round,
            target: target
        };
        socket.emit("start game", info); // start game 翻牌遮住數字
        socket.to(ROOM_TEST).emit("start game", info);

        let roundTime = parseInt(ROUNDTIME);
        while (roundTime >= 0) { // countdown in game
            socket.emit("countdown in game", roundTime); // 對自己
            socket.to(ROOM_TEST).emit("countdown in game", roundTime); // 對其他人
            await delay(1000);
            roundTime--;
        }

        // round結束
        round = round + 1;
        // const rules = await getGameRules(socket); // rules 中的 rounds 也不需要從db中拿出來 已經有現成的
        // const nowRound = await updateNowRound(socket); // 似乎不需要存在db中 不需要利用db記錄round

        console.log("now round: " + round);

        if (round > rules.rounds) {
            console.log("================");
            console.log("break i: " + i);
            console.log("break now round: " + round);
            break; //  注意
        }
        // const nowTarget = rules.targets[round - 1]; // get target of round
        // const cardsSetting = genMultiCardsNumber(nowTarget, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲

        target = rules.targets[round - 1]; // get target of round
        const cardsSetting = genMultiCardsNumber(target, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲

        // --- save cardsSetting into mysql
        await saveCardsSetting(cardsSetting, socket, round); /// 可簡化成loop？

        rules.state = "in ready";
        const nextRoundInfo = {
            round: round,
            target: target,
            rules: rules,
            cardsSetting: cardsSetting
        };
        socket.emit("next round execute rules", nextRoundInfo);
        socket.to(ROOM_TEST).emit("next round execute rules", nextRoundInfo);
    }

    console.log("========over========");
    socket.emit("game over", "over!!!"); // 可以傳送遊戲統計資訊
    socket.to(ROOM_TEST).emit("game over", "over!!!"); // 可以傳送遊戲統計資訊
};

function delay (Time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("1s"); }, Time);
    });
}

const ClickCardinGame = function (socket) {
    // const numberMap = new Map();

    socket.on("click card", async (info) => { // race condition and record
        // select card value from sql and check if they are in pair.
        const oppoInfo = { source: info.source, cardID: info.cardID };
        // const selfInfo = { source: info.source, cardID: info.cardID };
        // socket.emit("self click card", selfInfo); // 對自己
        socket.to(ROOM_TEST).emit("opposite click card", oppoInfo); // 對其他人

        const number = await getCardNumber(ROOM_TEST, info.round, info.cardID);
        const oppoCardfilledInfo = { cardID: info.cardID, number: number };
        const selfCardfilledInfo = { cardID: info.cardID, number: number };
        socket.emit("fill card number", selfCardfilledInfo);
        socket.to(ROOM_TEST).emit("fill card number", oppoCardfilledInfo);

        console.log(socket.id + ` in Round: ${info.round} click cardID: ` + info.cardID);
        console.log(socket.id + ` select number: ${number}`);

        // // check if match
        // if (numberMap.has(socket.id)) {
        //     const selectedHis = numberMap.get(socket.id);
        //     const numberSelected = selectedHis.number;
        //     const ans = number * numberSelected;
        //     console.log(socket.id + " Multi ans: " + ans);
        //     console.log("Round target: " + info.target);
        //     const oppoCardMatchInfo = { source: "opponent", selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包
        //     const selfCardMatchInfo = { source: "self", selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] };

        //     // await delay(200); //
        //     if (parseInt(info.target) === ans) {
        //         console.log("MATCH!");
        //         socket.emit("card number match", selfCardMatchInfo);
        //         socket.to(ROOM_TEST).emit("card number match", oppoCardMatchInfo);
        //     } else {
        //         console.log("NOT MATCH!");
        //         socket.emit("card number not match", selfCardMatchInfo);
        //         socket.to(ROOM_TEST).emit("card number not match", oppoCardMatchInfo);
        //     }
        //     numberMap.delete(socket.id);
        // } else {
        //     numberMap.set(socket.id, { cardID: info.cardID, number: number });
        // }
    });
};

const checkMatch = function (socket) { // check if match
    socket.on("ckeck match", async (checkMatchInfo) => {
        const target = parseInt(checkMatchInfo.target);
        const number1 = await getCardNumber(ROOM_TEST, checkMatchInfo.round, checkMatchInfo.number1[0]); // 可否簡化成一次query?
        const number2 = await getCardNumber(ROOM_TEST, checkMatchInfo.round, checkMatchInfo.number2[0]);
        const info = {
            selecterID: checkMatchInfo.source,
            firstCardID: checkMatchInfo.number1[0],
            secondCardID: checkMatchInfo.number2[0]
        };
        if (target === number1 * number2) { // 計分系統
            socket.emit("card number match", info);
            socket.to(ROOM_TEST).emit("card number match", info);
        } else {
            socket.emit("card number not match", info);
            socket.to(ROOM_TEST).emit("card number not match", info);
        }
    });
};

// const getRulesandStart = function (socket) {
//     // const sql = "SELECT now_round FROM round_count WHERE game_id = ?"
//     // let room;
//     // for (const i of socket.adapter.rooms.keys()) {
//     //     if (i.length === 7) { // room名稱待改
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
//     socket.to(ROOM_TEST).emit("start game", info);

//     const roundTime = 10;
//     // countdowninGame(roundTime, socket);
// };

module.exports = {
    chat,
    getOpponentName,
    ClickCardinGame,
    startGameLoop,
    checkMatch
};
