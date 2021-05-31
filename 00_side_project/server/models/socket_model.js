require("dotenv").config();
const { STANDBYTIME, ROUNDTIME } = process.env;
const { TOKEN_SECRET } = process.env;
console.log({ STANDBYTIME, ROUNDTIME });

const jwt = require("jsonwebtoken");
const { getRandomRules } = require("./getRandomRules");
const { saveGameRules } = require("./gameRulesSetting");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");
const { saveCardsSetting } = require("./saveCardsSetting_model");
const { getCardNumber } = require("./getCardNumber");
const { recordEveryStep } = require("./step_record_model");
const { sumRecord } = require("./record_summary_model");
const roomModule = require("./Room_model");
const { client, getCache } = require("./cache_model");

const updateRoomLobbyinfo = function (socket, io) {
    socket.on("update room info", async () => {
        const roomInfo = await roomModule.getRoomLobbyInfo();
        io.emit("room info", roomInfo);
    });
};

const Room = function (socket, io) {
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

    socket.on("in room", async (info) => { // 這邊可能出問題
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

const processinRoom = async function (socket, io) {
    const { token } = socket.handshake.auth;
    const { roomID } = socket.handshake.auth;
    // console.log(token);
    if (token) {
        const user = jwt.verify(token, TOKEN_SECRET);
        console.log(`${user.email} in room: ${roomID}`);
        if (roomID !== undefined) {
            const members = await roomModule.findRoonMember(roomID);
            console.log(members);
            if (members.length === 1) {
                console.log(`wait for opponen in ${roomID}`);
                socket.emit("wait for opponent", "wait for opponent");
            // io.to(roomID).emit("wait for opponent", "wait for opponent");
            }
            if (members.length === 2) { // 一個房間內只能有2人
                const rules = await getRandomRules(); // 隨機產生遊戲規則
                const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
                const gameID = await saveGameRules(roomID, user.email, gameRules);
                console.log(`GameID: ${gameID}`);
                io.to(roomID).emit("both of you in ready", { rules: gameRules, gameID: gameID }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕
            }
        }
    }

    socket.on("I am ready", async (rules) => { // 兩方都點選alert後才開始
        const { roomID } = socket.handshake.auth;
        const { gameID } = rules;
        const isReadyNumberOK = await roomModule.isReadyNumberOK(gameID);
        if (isReadyNumberOK) { // 因為room內只能有2人 記得disable前端按鈕
            console.log("both player click start button");
            io.to(roomID).emit("go", "both player click start button");
            // readyCountMap.delete(roomID);
            gameloop(gameID, rules, socket, io, roomID); // info = rules
        } else {
            console.log("wait for opponent to click start button");
            socket.emit("wait for opponent to click start button", "wait for opponent");
        }
    });

    socket.on("want to play again", async (info) => {
        const { token } = socket.handshake.auth;
        const user = jwt.verify(token, TOKEN_SECRET);
        const { roomID } = socket.handshake.auth;
        const { gameID } = info;
        const isAgainNumberOK = await roomModule.isAgainNumberOK(gameID);
        if (isAgainNumberOK) {
            const rules = await getRandomRules(); // 隨機產生遊戲規則
            const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
            const gameID = await saveGameRules(roomID, user.email, gameRules);
            console.log(`GameID: ${gameID}`);
            console.log("both player click again button");
            io.to(roomID).emit("again", { rules: gameRules, gameID: gameID });
        } else {
            console.log("wait for opponent to click again button");
            socket.emit("wait for opponent to click again button", "wait for opponent");
        }
    });
};

const gameloop = async function (gameID, rules, socket, io, room) {
    for (let i = 0; i < rules.rounds; i++) {
        const round = i + 1; // init
        const target = rules.targets[i];
        rules.state = "in ready";
        const cardsSetting = genMultiCardsNumber(target, rules.number); // 需要await 考量非同步的延遲
        await saveCardsSetting(gameID, room, cardsSetting, round);
        const info = {
            round: round,
            target: target,
            rules: rules,
            cardsSetting: cardsSetting
        };
        if (round === 1) {
            io.to(room).emit("execute rules", info);
        }
        io.to(room).emit("next round execute rules", info);

        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready 注意 會不會影響到其他房間的遊玩？ 因為異步性
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
    // const numberMap = new Map(); // 多人遊玩時可能會碰到問題 每次有人連線 這句話都會被執行 此寫法不支援多人多房間遊玩 導致numberMap被初始化 要用sql解決 待改
    // 回合轉換後 應該初始化redis

    socket.on("click card", async (info) => { // race condition
        // select card value from sql and check if they are in pair.
        try {
            const { gameID, round, source, cardID, time } = info; // for record time: countdown time
            const user = jwt.verify(info.token, TOKEN_SECRET);
            const result = await roomModule.findRoom(user.email);
            const room = result[0].room_id;
            console.log("===========in click card============");
            const oppoInfo = { source: info.source, cardID: info.cardID };
            socket.to(room).emit("opposite click card", oppoInfo); // 對其他人 此處效能待改 送出卡片和數字分離了

            const number = await getCardNumber(gameID, room, info.round, info.cardID); // fill card number 可以改成cache 待改
            console.log(result[0]);
            console.log(`socketID: ${socket.id} click: ${number}`);
            const CardfilledInfo = { cardID: info.cardID, number: number };
            io.to(room).emit("fill card number", CardfilledInfo);

            const utsOrder = new Date().getTime();
            const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };

            // use cache
            const selectedHis = JSON.parse(await getCache(socket.id)); // 不確定
            if (selectedHis !== null) {
                const numberSelected = selectedHis.number;
                const ans = number * numberSelected;
                const MatchInfo = { selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包
                if (parseInt(info.target) === ans) {
                    io.to(room).emit("card number match", MatchInfo);
                    io.to(room).emit("update points", { playerID: socket.id, point: 10 }); // 讓前端計分 配對成功 +10分
                    stepInfo.addPoints = 10; // 得分
                } else {
                    io.to(room).emit("card number not match", MatchInfo);
                }
                client.del(socket.id); // redis delete
            } else {
                client.set(socket.id, JSON.stringify({ cardID: info.cardID, number: number }));
            }
            await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 待改
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { err: "localStorage error" });
        }
    });
};

module.exports = {
    processinRoom,
    updateRoomLobbyinfo,
    Room,
    chat,
    ClickCardinGame
};
