require("dotenv").config();
const { STANDBYTIME, ROUNDTIME } = process.env;
const { POINTS } = process.env;
const { TOKEN_SECRET } = process.env;
console.log({ STANDBYTIME, ROUNDTIME, POINTS });

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

const getUserInfo = function (socket, io) {
    socket.on("get user name", () => {
        console.log("=======================");
        console.log(socket.info.name);
        socket.emit("show my name", socket.info.name);
        // try {
        //     const { token } = socket.handshake.auth;
        //     const user = jwt.verify(token, TOKEN_SECRET);
        //     socket.emit("show my name", user);
        // } catch (err) {
        //     console.log(err);
        // }
    });
};

const updateRoomLobbyinfo = function (socket, io) {
    socket.on("update room info", async () => {
        const roomInfo = await roomModule.getRoomLobbyInfo();
        io.emit("room info", roomInfo);
    });
};

const Room = function (socket, io) { // join room
    socket.on("join room", async (info) => {
        try {
            // const { token } = socket.handshake.auth;
            // const user = jwt.verify(token, TOKEN_SECRET);
            // const user = jwt.verify(info.token, TOKEN_SECRET);
            const pass = await roomModule.joinRoom(info.roomID, socket.info.email);
            if (pass) {
                socket.join(info.roomID);
                console.log(`join room: ${info.roomID}`);
                const accessToken = jwt.sign({ provider: socket.info.provider, name: socket.info.name, email: socket.info.email, roomID: info.roomID }, TOKEN_SECRET);
                socket.emit("join success", { token: accessToken, roomID: info.roomID }); // 此token第一次帶有roomID
            } else {
                socket.emit("join failed", { error: "Forbidden" });
            }
        } catch (err) {
            socket.emit("join failed", { error: "Forbidden" });
        }
        const roomInfo = await roomModule.getRoomLobbyInfo();
        io.emit("room info", roomInfo); // update rooms info on lobby
    });

    socket.on("in room", async (info) => { // 這邊可能出問題 有時候會來不及建立on
        try {
            // const { token } = socket.handshake.auth;
            // const user = jwt.verify(token, TOKEN_SECRET);
            const user = socket.info; // token中應該已帶有roomID資訊
            const { roomID } = user;
            socket.join(roomID);
            console.log(`in the room: ${roomID}`);
            socket.emit("fill name", user.name);
            const members = await roomModule.findRoonMember(roomID);
            console.log(members);
            for (const i in members) {
                if (members[i].email === user.email) {
                    socket.emit("fill name", members[i].name);
                    socket.to(roomID).emit("fill opponent name", members[i].name);
                    // socket.emit("fill opponent name", result[i].name); // 測試使用 因為一個瀏覽器只能儲存一組token 所以jtw justify後email會重複
                } else {
                    socket.emit("fill opponent name", members[i].name);
                }
            }

            // console.log(socket.adapter);

            if (members.length === 1) {
                console.log(`wait for opponen in ${roomID}`);
                socket.emit("wait for opponent", "wait for opponent");
            }
            if (members.length === 2) { // 一個房間內只能有2人
                const rules = await getRandomRules(); // 隨機產生遊戲規則
                const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
                const gameID = await saveGameRules(roomID, user.email, gameRules);
                // const accessToken = jwt.sign({ type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets, gameID: gameID }, TOKEN_SECRET);
                // console.log(`GameID: ${gameID}`);
                // io.to(roomID).emit("both of you in ready", { accessToken: accessToken }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕

                // const accessToken = jwt.sign({ provider: socket.info.provider, name: socket.info.name, email: socket.info.email, roomID: socket.info.roomID, rules: gameRules, gameID: gameID }, TOKEN_SECRET); // 需不需要await?
                // io.to(roomID).emit("both of you in ready", { token: accessToken, rules: gameRules }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕 此處token第一次帶有rules 和 gameID 資訊 token會被覆寫
                console.log(`room: ${roomID}`);
                io.to(roomID).emit("both of you in ready", { rules: gameRules, gameID: gameID }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕 此處第一次出現gameID

                // socket.emit("join success", { token: accessToken, roomID: info.roomID }); // 此token第一次帶有roomID
            }
            // const result = await roomModule.findRoom(user.email);
            // const roomID = result[0].room_id;
            // if (result) {
            //     // console.log(`join room: ${roomID}`);
            //     // socket.join(result[0].room_id); // join room 多此一舉
            //     // const members = await roomModule.findRoonMember(roomID);
            //     // for (const i in members) {
            //     //     if (members[i].email === user.email) {
            //     //         socket.emit("fill name", members[i].name);
            //     //         socket.to(roomID).emit("fill opponent name", members[i].name);
            //     //         // socket.emit("fill opponent name", result[i].name); // 測試使用 因為一個瀏覽器只能儲存一組token 所以jtw justify後email會重複
            //     //     } else {
            //     //         socket.emit("fill opponent name", members[i].name);
            //     //     }
            //     // }
            // } else {
            //     socket.emit("join failed", { error: "Forbidden" });
            // }
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { error: "Forbidden" });
        }
    });
};

const processinRoom = async function (socket, io) {
    // const { token } = socket.handshake.auth;
    // const { roomID } = socket.handshake.auth;
    // console.log(token);
    // const user = socket.info;
    // const { roomID } = socket.info;
    // console.log(`${user.email} in room: ${roomID}`);

    // if (token) {
    //     // const user = jwt.verify(token, TOKEN_SECRET);
    //     // console.log(`${user.email} in room: ${roomID}`);
    //     if (roomID !== undefined) {
    //         // const members = await roomModule.findRoonMember(roomID);
    //         // console.log(members);
    //         // if (members.length === 1) {
    //         //     console.log(`wait for opponen in ${roomID}`);
    //         //     socket.emit("wait for opponent", "wait for opponent");
    //         // // io.to(roomID).emit("wait for opponent", "wait for opponent");
    //         // }
    //         // if (members.length === 2) { // 一個房間內只能有2人
    //         //     const rules = await getRandomRules(); // 隨機產生遊戲規則
    //         //     const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
    //         //     const gameID = await saveGameRules(roomID, user.email, gameRules);
    //         //     // const accessToken = jwt.sign({ type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets, gameID: gameID }, TOKEN_SECRET);
    //         //     // console.log(`GameID: ${gameID}`);
    //         //     // io.to(roomID).emit("both of you in ready", { accessToken: accessToken }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕
    //         //     io.to(roomID).emit("both of you in ready", { rules: gameRules, gameID: gameID }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕
    //         // }
    //     }
    // }

    socket.on("I am ready", async (info) => { // 兩方都點選alert後才開始
        // const { roomID } = socket.handshake.auth;
        // const { gameID } = rules;
        const user = socket.info;
        const { roomID } = socket.info;
        console.log(`${user.email} in room: ${roomID}`);

        const { rules, gameID } = info; // rules, gameID 從前端來
        console.log(`GameID: ${gameID}`);
        const isReadyNumberOK = await roomModule.isReadyNumberOK(gameID);
        if (isReadyNumberOK) { // 因為room內只能有2人 記得disable前端按鈕
            console.log("both player click start button");
            io.to(roomID).emit("go", "both player click start button");
            // readyCountMap.delete(roomID);
            gameloop(gameID, rules, roomID, socket, io); // socket.info應該已經有rules gameID 開始遊戲
        } else {
            console.log("wait for opponent to click start button");
            socket.emit("wait for opponent to click start button", "wait for opponent");
        }
    });

    socket.on("want to play again", async (info) => {
        // const { token } = socket.handshake.auth;
        // const user = jwt.verify(token, TOKEN_SECRET);
        const user = socket.info;
        // const { roomID } = socket.handshake.auth;
        const { roomID } = socket.info;
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

const gameloop = async function (gameID, rules, room, socket, io) {
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
        } else {
            io.to(room).emit("next round execute rules", info);
        }
        // io.to(room).emit("next round execute rules", info); // 這樣有問題

        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready 注意 應該要隨著離開room而初始化(結束)
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
            // const { gameID, round, source, cardID, time } = info; // for record time: countdown time
            // const user = jwt.verify(info.token, TOKEN_SECRET);
            const { gameID, source, cardID, round, target, time, token } = info; // for record time: countdown time // 此處token中已有roomID gameID資訊
            const user = jwt.verify(token, TOKEN_SECRET);
            // // const result = await roomModule.findRoom(user.email);
            // // const room = result[0].room_id;
            // const { gameID } = user;
            const room = user.roomID;
            console.log("===========in click card============");
            // const oppoInfo = { source: info.source, cardID: info.cardID };
            const oppoInfo = { source: source, cardID: cardID };
            socket.to(room).emit("opposite click card", oppoInfo); // 對其他人 此處效能待改 送出卡片和數字分離了

            const number = await getCardNumber(gameID, room, info.round, info.cardID); // fill card number 可以改成cache 待改
            // console.log(result[0]);
            console.log(`Room ID: ${room}`);
            console.log(`socketID: ${socket.id} email: ${user.email} click: ${number}`);
            // const CardfilledInfo = { cardID: info.cardID, number: number };
            const CardfilledInfo = { cardID: cardID, number: number };
            io.to(room).emit("fill card number", CardfilledInfo);

            const utsOrder = new Date().getTime();
            const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };

            // use cache
            const selectedHis = JSON.parse(await getCache(socket.id)); // 待確認 應該可
            if (selectedHis !== null) {
                const numberSelected = selectedHis.number;
                const ans = number * numberSelected;
                const MatchInfo = { selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包 // 有時候前端番卡出現問題 應該是此處有問題
                if (parseInt(target) === ans) {
                    io.to(room).emit("card number match", MatchInfo);
                    io.to(room).emit("update points", { playerID: socket.id, point: parseInt(POINTS) }); // 讓前端計分 配對成功 +10分
                    stepInfo.addPoints = parseInt(POINTS); // 得分
                } else {
                    io.to(room).emit("card number not match", MatchInfo);
                }
                client.del(socket.id); // redis delete
            } else {
                client.set(socket.id, JSON.stringify({ cardID: cardID, number: number }));
            }
            await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 待改
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { err: "localStorage error" });
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

module.exports = {
    getUserInfo,
    updateRoomLobbyinfo,
    processinRoom,
    Room,
    ClickCardinGame,
    chat
};
