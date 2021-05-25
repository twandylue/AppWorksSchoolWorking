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
const { recordEveryStep } = require("./step_record_model");
// const { recordEveryRound } = require("./round_record_model");
const { sumRecord } = require("./record_summary_model");

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

const gameloop = async function (socket, rules) { // 整理成loop
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
        // round record
        // recordEveryRound(ROOM_TEST, socket, round); //不需要？ 可以game over 後一起統計

        // round結束
        round = round + 1;
        // const rules = await getGameRules(socket); // rules 中的 rounds 也不需要從db中拿出來 已經有現成的
        // const nowRound = await updateNowRound(socket); // 似乎不需要存在db中 不需要利用db記錄round

        console.log("now round: " + round);

        if (round > rules.rounds) {
            // console.log("break i: " + i);
            // console.log(`rounds limit: ${rules.rounds}`);
            // console.log("break round: " + round);
            break; //  注意
        }

        target = rules.targets[round - 1]; // get target of round
        const cardsSetting = genMultiCardsNumber(target, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲

        // --- save cardsSetting into mysql
        await saveCardsSetting(cardsSetting, socket, round); /// 可簡化成loop？

        rules.state = "in ready";
        const nextRoundInfo = { // 此資訊用於設定下個round
            round: round,
            target: target,
            rules: rules,
            cardsSetting: cardsSetting
        };
        socket.emit("next round execute rules", nextRoundInfo);
        socket.to(ROOM_TEST).emit("next round execute rules", nextRoundInfo);
    }

    console.log("========game over========");
    // 統計遊玩資訊
    const rounds = round - 1; // round - 1 因為搭配上發寫法
    const gameStat = await sumRecord(ROOM_TEST, socket, rounds);
    socket.emit("game over", gameStat);
    socket.to(ROOM_TEST).emit("game over", gameStat);
    // console.log(gameStat);
};

function delay (delayTime) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("delay"); }, delayTime);
    });
}

const ClickCardinGame = function (socket) {
    const numberMap = new Map();

    socket.on("click init", () => { // 待改
        // 回合轉換後 應該初始化numberMap
    });

    socket.on("click card", async (info) => { // race condition
        // select card value from sql and check if they are in pair.
        const oppoInfo = { source: info.source, cardID: info.cardID };
        socket.to(ROOM_TEST).emit("opposite click card", oppoInfo); // 對其他人

        const number = await getCardNumber(ROOM_TEST, info.round, info.cardID); // fill card number
        const CardfilledInfo = { cardID: info.cardID, number: number };
        socket.emit("fill card number", CardfilledInfo);
        socket.to(ROOM_TEST).emit("fill card number", CardfilledInfo);

        // console.log(socket.id + ` in Round: ${info.round} click cardID: ` + info.cardID);
        // console.log(socket.id + ` select number: ${number}`);

        const { round, source, cardID, time } = info; // for record time: countdown time
        const utsOrder = new Date().getTime();
        const gameID = ROOM_TEST;
        const stepInfo = { gameID: gameID, round: round, source: source, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };
        // number, order(用接收到的unittimestemp？), accumulated points(count in mysql)

        // check if match
        if (numberMap.has(socket.id)) { // click twice
            const selectedHis = numberMap.get(socket.id);
            const numberSelected = selectedHis.number;
            const ans = number * numberSelected;
            // console.log(socket.id + " Multi ans: " + ans);
            // console.log("Round target: " + info.target);
            const MatchInfo = { selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包

            if (parseInt(info.target) === ans) {
                // console.log("MATCH!");
                socket.emit("card number match", MatchInfo);
                socket.to(ROOM_TEST).emit("card number match", MatchInfo);
                // 計分
                socket.emit("update points", { playerID: socket.id, point: 10 });
                socket.to(ROOM_TEST).emit("update points", { playerID: socket.id, point: 10 });
                stepInfo.addPoints = 10;
            } else {
                // console.log("NOT MATCH!");
                socket.emit("card number not match", MatchInfo);
                socket.to(ROOM_TEST).emit("card number not match", MatchInfo);
            }
            // console.log("=======2=======");
            // console.log(numberMap);
            numberMap.delete(socket.id);
        } else {
            numberMap.set(socket.id, { cardID: info.cardID, number: number });
        }
        // console.log("=======1=======");
        // console.log(numberMap);
        // 記錄每一步進sql and 即時更新分數 回合結束後再統一記錄？
        await recordEveryStep(stepInfo);
    });
};

// const checkMatch = function (socket) { // check if match
//     socket.on("ckeck match", async (checkMatchInfo) => {
//         const target = parseInt(checkMatchInfo.target);
//         const number1 = await getCardNumber(ROOM_TEST, checkMatchInfo.round, checkMatchInfo.number1[0]); // 可否簡化成一次query?
//         const number2 = await getCardNumber(ROOM_TEST, checkMatchInfo.round, checkMatchInfo.number2[0]);
//         const info = {
//             selecterID: checkMatchInfo.source,
//             firstCardID: checkMatchInfo.number1[0],
//             secondCardID: checkMatchInfo.number2[0]
//         };
//         if (target === number1 * number2) { // 計分系統
//             socket.emit("card number match", info);
//             socket.to(ROOM_TEST).emit("card number match", info);
//         } else {
//             socket.emit("card number not match", info);
//             socket.to(ROOM_TEST).emit("card number not match", info);
//         }
//     });
// };

module.exports = {
    chat,
    getOpponentName,
    ClickCardinGame,
    startGameLoop
    // checkMatch
};
