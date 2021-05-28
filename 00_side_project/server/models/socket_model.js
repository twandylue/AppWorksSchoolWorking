require("dotenv").config();
const { STANDBYTIME, ROUNDTIME } = process.env;
const { TOKEN_SECRET } = process.env;
console.log({ STANDBYTIME, ROUNDTIME });

const jwt = require("jsonwebtoken");
const { setGameRules } = require("./gameRulesSetting");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");
const { saveCardsSetting } = require("./saveCardsSetting_model");
const { getCardNumber } = require("./getCardNumber");
const { recordEveryStep } = require("./step_record_model");
const { sumRecord } = require("./record_summary_model");
const roomModule = require("./Room_model");

const updateRoominfo = function (socket, io) {
    socket.on("update room info", async () => {
        const roomInfo = await roomModule.getRoomLobbyInfo();
        io.emit("room info", roomInfo);
    });
};

const Room = function (socket, io) {
    // console.log(socket.handshake.auth); // socket token
    socket.on("join room", async (info) => {
        try {
            const user = jwt.verify(info.token, TOKEN_SECRET);
            const pass = await roomModule.joinRoom(info.roomID, user.email);
            if (pass) {
                socket.join(info.roomID);
                socket.emit("join success", info.roomID);
            } else {
                socket.emit("join failed", { error: "Forbidden" });
            }
        } catch (err) {
            socket.emit("join failed", { error: "Forbidden" });
        }

        const roomInfo = await roomModule.getRoomLobbyInfo();
        io.emit("room info", roomInfo); // show rooms info on lobby
    });

    socket.on("in room", async (info) => {
        try {
            const { token } = socket.handshake.auth;
            const user = jwt.verify(token, TOKEN_SECRET);
            const result = await roomModule.findRoom(user.email);
            const roomID = result[0].room_id;
            if (result) {
                console.log(`join room: ${roomID}`);
                socket.join(result[0].room_id); // join room
                const members = await roomModule.findRoonMember(roomID);
                for (const i in members) {
                    if (members[i].email === user.email) {
                        socket.emit("fill name", members[i].name);
                        socket.to(roomID).emit("fill opponent name", members[i].name);
                        // socket.emit("fill opponent name", result[i].name); // 測試使用 因為一個瀏覽器只能儲存一組token 所以jtw justify後email會重複
                    } else {
                        socket.emit("fill opponent name", members[i].name);
                    }
                }
            } else {
                socket.emit("join failed", { error: "Forbidden" });
            }
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { error: "Forbidden" });
        }
    });
};

const chat = function (socket, io) {
    socket.on("chat message", (msg) => {
        console.log(`FROM ${socket.id} | message ${msg}`);
        const room = [];
        for (const i of io.sockets.adapter.sids.get(socket.id)) { // room[1]: room
            room.push(i);
        }
        io.to(room[1]).emit("chat message", msg);
    });
};

const startGameLoop = function (socket, io) {
    socket.on("start game loop", (info) => {
        const user = jwt.verify(info.token, TOKEN_SECRET);
        gameloop(socket, info, io, user.email);
    });
};

const gameloop = async function (socket, rules, io, eamil) {
    // 以下不能用socket中的資訊找room_id 必須透過query mysql 找出對應房間(條件 透過token中的email資訊 在room table中找出room_id)

    const result = await roomModule.findRoom(eamil);
    const room = result[0].room_id;

    const gameID = await setGameRules(room, eamil, rules);
    console.log(`GameID: ${gameID}`);
    console.log(rules); // 遊戲規則

    for (let i = 0; i < rules.rounds; i++) {
        const round = i + 1; // init
        const target = rules.targets[i];
        rules.state = "in ready";
        const cardsSetting = genMultiCardsNumber(target, (rules.number) * (rules.number)); // 需要await 考量非同步的延遲
        await saveCardsSetting(gameID, room, cardsSetting, round);
        const info = {
            round: round,
            target: target,
            rules: rules,
            cardsSetting: cardsSetting,
            gameID: gameID
        };
        if (round === 1) {
            io.to(room).emit("execute rules", info);
        }
        io.to(room).emit("next round execute rules", info);

        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready
            io.to(room).emit("countdown in ready", standbyTime);
            await delay(1000);
            standbyTime--;
        }

        const startGameInfo = {
            msg: "start",
            round: round,
            target: target
        };
        io.to(room).emit("start game", startGameInfo);

        let roundTime = parseInt(ROUNDTIME);
        while (roundTime >= 0) { // countdown in game
            io.to(room).emit("countdown in game", roundTime);
            await delay(1000);
            roundTime--;
        }
        // round結束
    }
    console.log("========game over========");
    const rounds = rules.rounds; // round 因為搭配上發寫法
    const gameStat = await sumRecord(gameID, room, socket, rounds); // 統計遊玩資訊
    io.to(room).emit("game over", gameStat);
};

function delay (delayTime) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("delay"); }, delayTime);
    });
}

const ClickCardinGame = function (socket, io) {
    const numberMap = new Map();

    socket.on("click init", () => { // 待改
        // 回合轉換後 應該初始化numberMap
    });

    socket.on("click card", async (info) => { // race condition
        // select card value from sql and check if they are in pair.
        const { gameID, round, source, cardID, time } = info; // for record time: countdown time
        const user = jwt.verify(info.token, TOKEN_SECRET);
        const result = await roomModule.findRoom(user.email);
        const room = result[0].room_id;
        console.log("===========in click card============");
        const oppoInfo = { source: info.source, cardID: info.cardID };
        socket.to(room).emit("opposite click card", oppoInfo); // 對其他人 此處效能待改 送出卡片和數字分離了

        const number = await getCardNumber(gameID, room, info.round, info.cardID); // fill card number
        console.log(result[0]);
        console.log(`socketID: ${socket.id} click: ${number}`);
        const CardfilledInfo = { cardID: info.cardID, number: number };
        io.to(room).emit("fill card number", CardfilledInfo);

        const utsOrder = new Date().getTime();
        const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };

        // check if match
        if (numberMap.has(socket.id)) { // click twice
            const selectedHis = numberMap.get(socket.id);
            const numberSelected = selectedHis.number;
            const ans = number * numberSelected;
            // console.log(socket.id + " Multi ans: " + ans);
            // console.log("Round target: " + info.target);
            const MatchInfo = { selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包

            if (parseInt(info.target) === ans) {
                io.to(room).emit("card number match", MatchInfo);
                // 計分
                io.to(room).emit("update points", { playerID: socket.id, point: 10 }); // 配對成功 +10分
                stepInfo.addPoints = 10; // 得分
            } else {
                io.to(room).emit("card number not match", MatchInfo);
            }
            numberMap.delete(socket.id);
        } else {
            numberMap.set(socket.id, { cardID: info.cardID, number: number });
        }
        await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 待改
    });
};

module.exports = {
    updateRoominfo,
    Room,
    chat,
    startGameLoop,
    ClickCardinGame
};
