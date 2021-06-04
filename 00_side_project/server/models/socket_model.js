require("dotenv").config();
const { STANDBYTIME, ROUNDTIME, ROBOTSTEP } = process.env;
const { POINTS } = process.env;
const { TOKEN_SECRET } = process.env;
console.log({ STANDBYTIME, ROUNDTIME, POINTS });

const jwt = require("jsonwebtoken");
const { getRandomRules } = require("./getRandomRules");
const { saveGameRules } = require("./gameRulesSetting");
const { genMultiCardsNumber } = require("./genMultiCardsNumber");
const { saveCardsSetting } = require("./saveCardsSetting_model");
const { getCardNumber } = require("./getCardNumber"); // 保留 從sql中拿取數字
const { recordEveryStep } = require("./step_record_model");
const { statRecord, statRecordSingle } = require("./record_summary_model");
const roomModule = require("./Room_model");
const { client, getCache, getCardNumberinCache } = require("./cache_model");

const getUserInfo = function (socket, io) {
    socket.on("get user name", () => {
        socket.emit("show my info", { name: socket.info.name, email: socket.info.email });
    });

    socket.on("get user room", () => {
        socket.emit("show roomID", { roomID: socket.info.roomID });
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
            const pass = await roomModule.joinRoom(info.roomID, socket.info.email);
            if (pass) {
                // socket.join(info.roomID); // 需要嗎！？ 因為轉跳頁面會斷線 所以現在join沒有用 所以不需要
                console.log(`join room: ${info.roomID}`);
                const accessToken = jwt.sign({ provider: socket.info.provider, name: socket.info.name, email: socket.info.email, roomID: info.roomID, status: 2 }, TOKEN_SECRET); // status: 2 play with opponent
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

    socket.on("in room", async () => { // 這邊可能出問題 有時候會來不及建立on
        try {
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
                const gameID = await saveGameRules(roomID, members, gameRules); // gameID 第一次出現
                await roomModule.bindGameIDinRoom(gameID, roomID); // save gameID with room 此時room是唯一的 能綁定gameID
                console.log(`room: ${roomID}`);
                io.to(roomID).emit("both of you in ready", { rules: gameRules, gameID: gameID }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕 此處第一次出現gameID
            }
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { error: "Forbidden" });
        }
    });

    socket.on("join room with robot", async () => {
        // const roomID = "robot_" + socket.info.email;
        const roomID = `${socket.info.name}_robot_room`;
        await roomModule.joinRoomwithRobot(roomID, socket.info.email); // 加入房間 和robot一起
        const accessToken = jwt.sign({ provider: socket.info.provider, name: socket.info.name, email: socket.info.email, roomID: roomID, status: 1 }, TOKEN_SECRET); // status: 1 single mode
        socket.emit("join room with robot success", { token: accessToken, roomID: roomID }); // 此token第一次帶有roomID 單人模式
    });

    socket.on("in room with robot", async () => {
        const user = socket.info; // token中應該已帶有roomID資訊
        const { roomID } = user;
        socket.join(roomID);
        const members = [{ email: `${user.name}_robot` }, { email: user.email }]; // 待確認
        const rules = await getRandomRules(); // 隨機產生遊戲規則
        const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
        const gameID = await saveGameRules(roomID, members, gameRules); // gameID 第一次出現
        await roomModule.bindGameIDinRoom(gameID, roomID); // save gameID with room 此時room是唯一的 能綁定gameID
        console.log(`room: ${roomID}`);
        io.to(roomID).emit("ready in single mode", { rules: gameRules, gameID: gameID }); // 讓雙方都能看到規則 and 讓前端能點選開始鈕 此處第一次出現gameID
    });
};

const processinRoom = async function (socket, io) {
    socket.on("I am ready", async (info) => { // 兩方都點選alert後才開始
        const user = socket.info;
        const { roomID } = socket.info;
        console.log(`${user.email} in room: ${roomID}`);

        const { rules, gameID } = info; // rules, gameID 從前端來
        console.log(`GameID: ${gameID}`);
        const isReadyNumberOK = await roomModule.isReadyNumberOK(gameID);
        if (isReadyNumberOK) { // 因為room內只能有2人 記得disable前端按鈕
            console.log("both player click start button");
            io.to(roomID).emit("go", "both player click start button");
            // 待改 此處可以await find room members 就當參數傳入gameloop 因此不用每次回合結束都await一次 find members
            gameloop(gameID, rules, roomID, socket, io); // 開始遊戲
        } else {
            console.log("wait for opponent to click start button");
            socket.emit("wait for opponent to click start button", "wait for opponent");
        }
    });

    socket.on("want to play again", async (info) => {
        const user = socket.info;
        const { roomID } = socket.info;
        const { gameID } = info;
        const isAgainNumberOK = await roomModule.isAgainNumberOK(gameID);
        if (isAgainNumberOK) {
            console.log(`AGAIN: DEL ${info.gameID}`);
            client.del(info.gameID);// 初始化cache cardSetting by old gameID
            const rules = await getRandomRules(); // 隨機產生遊戲規則
            const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
            const gameID = await saveGameRules(roomID, user.email, gameRules);
            await roomModule.bindGameIDinRoom(gameID, roomID); // room table中 也要更新gameID
            console.log(`New GameID: ${gameID}`);
            console.log("both player click again button");
            io.to(roomID).emit("again", { rules: gameRules, gameID: gameID });
        } else {
            console.log("wait for opponent to click again button");
            socket.emit("wait for opponent to click again button", "wait for opponent");
        }
    });

    socket.on("I am ready in single mode", async (info) => {
        const user = socket.info;
        const { roomID } = socket.info;
        const { rules, gameID } = info; // rules, gameID 從前端來
        console.log(`${user.email} in room: ${roomID}`);
        console.log(`robot is ready too. Start game: ${gameID}`);
        const members = [{ email: `${gameID}_robot`, name: `${gameID}_robot` }, { email: user.email, name: user.name }]; // 待確認
        gameloopwithRobot(gameID, rules, roomID, members, socket, io); // 開始遊戲 單人模式
    });

    socket.on("want to play again in single mode", async (info) => {
        const user = socket.info;
        const { roomID } = socket.info;
        console.log(`AGAIN: DEL ${info.gameID}`);
        client.del(info.gameID);// 初始化cache cardSetting by old gameID
        const rules = await getRandomRules(); // 隨機產生遊戲規則
        const gameRules = { type: rules.type, number: rules.card_number, rounds: rules.rounds, targets: rules.targets };
        const gameID = await saveGameRules(roomID, user.email, gameRules);
        await roomModule.bindGameIDinRoom(gameID, roomID); // room table中 也要更新gameID
        console.log(`New GameID: ${gameID}`);
        console.log("player want to play again with robot");
        io.to(roomID).emit("again", { rules: gameRules, gameID: gameID });
    });
};

const gameloopwithRobot = async function (gameID, rules, roomID, members, socket, io) {
    client.set(roomID, "working"); // 表示房間現在正在被使用
    for (let i = 0; i < rules.rounds; i++) {
        const matchNumberList = []; // 用來記錄配對成功的cardID
        client.set(`${gameID}_matchNumberList`, JSON.stringify({ list: matchNumberList })); // 每回合初始化

        const round = i + 1; // init
        const target = rules.targets[i];
        rules.state = "in ready";
        const cardsSetting = genMultiCardsNumber(target, rules.number); // 需要await 考量非同步的延遲 // 搭配cache使用 先存後取
        await saveCardsSetting(gameID, roomID, cardsSetting, round); // 一回合存一次 如果有cache 或許不用await 待改
        const objinCache = {}; // 一份存cache
        objinCache[round] = cardsSetting;
        const CardSettinginCache = JSON.stringify(objinCache);
        client.set(gameID, CardSettinginCache); // 儲存卡片編號和對應數字

        const info = {
            round: round,
            target: target,
            rules: rules,
            cardsSetting: cardsSetting
        };
        if (round === 1) {
            io.to(roomID).emit("execute rules", info);
        } else {
            io.to(roomID).emit("next round execute rules", info);
        }

        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready 注意 應該要隨著離開room而初始化(結束)
            io.to(roomID).emit("countdown in ready", standbyTime);
            await delay(1000);
            standbyTime--;
            const status = await getCache(roomID); // 倒數計時器終止 如果有人中離 理應會回傳null
            if (status !== "working") {
                return; // 終止
            }
        }

        const startGameInfo = {
            msg: "start",
            round: round,
            target: target
        };
        io.to(roomID).emit("start game", startGameInfo);

        client.set(`${gameID}_switch`, 1); // 開啟robotClicker
        robotClicker(rules.number, gameID, roomID, members[0].email, members[1].email, target, round, 0, io); // robot

        let roundTime = parseInt(ROUNDTIME);
        while (roundTime >= 0) { // countdown in game
            io.to(roomID).emit("countdown in game", roundTime);
            await delay(1000);
            roundTime--;
            const status = await getCache(roomID); // 倒數計時器終止 如果有人中離
            if (status !== "working") {
                return; // 終止
            }
        }
        client.del(`${gameID}_switch`); // 關閉robotClicker
        // round結束
        for (const i in members) { // 每回合結束時 初始化cahce 去除上回合點擊過的卡片 包含機器人和玩家
            client.del(members[i].email);
        }
    }
    console.log("========game over========");
    const rounds = rules.rounds;
    const gameStat = await statRecordSingle(gameID, roomID, rounds, members);
    client.del(`${gameID}_matchNumberList`); // 在遊戲結束後 初始化_matchNumberList
    io.to(roomID).emit("game over", gameStat);
};

const gameloop = async function (gameID, rules, room, socket, io) {
    client.set(room, "working"); // 表示房間現在正在被使用
    for (let i = 0; i < rules.rounds; i++) {
        const round = i + 1; // init
        const target = rules.targets[i];
        rules.state = "in ready";
        const cardsSetting = genMultiCardsNumber(target, rules.number); // 需要await 考量非同步的延遲 // 搭配cache使用 先存後取
        await saveCardsSetting(gameID, room, cardsSetting, round); // 一回合存一次 如果有cache 或許不用await
        // 一份存cache
        const objinCache = {};
        objinCache[round] = cardsSetting;
        const CardSettinginCache = JSON.stringify(objinCache);
        client.set(gameID, CardSettinginCache); // 斷線時會初始化 注意 重新開始時應當要初始化

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

        let standbyTime = parseInt(STANDBYTIME);
        while (standbyTime >= 0) { // countdown in ready 注意 應該要隨著離開room而初始化(結束)
            io.to(room).emit("countdown in ready", standbyTime);
            await delay(1000);
            standbyTime--;
            const status = await getCache(room); // 倒數計時器終止 如果有人中離 理應會回傳null
            if (status !== "working") {
                return; // 終止
            }
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
            const status = await getCache(room); // 倒數計時器終止 如果有人中離
            if (status !== "working") {
                return; // 終止
            }
        }
        // round結束
        const members = await roomModule.findRoonMember(room); // 找出房內所有人 用於cache初始化 待改 不用每次回合結束後都await一次
        for (const i in members) { // 每回合結束時 初始化cahce 去除上回合點擊過的卡片
            client.del(members[i].email);
        }
    }
    console.log("========game over========");
    const rounds = rules.rounds;
    const gameStat = await statRecord(gameID, room, rounds);
    io.to(room).emit("game over", gameStat);
};

function delay (delayTime) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve("delay"); }, delayTime);
    });
}

const ClickCardinGame = function (socket, io) {
    // 等等將socketid用email代替 並配合sql可以得知房內email 以此可以初始化cache
    // 回合轉換後 應該初始化redis

    socket.on("click card", async (info) => { // race condition
        // select card value from cahce and check if they are in pair.
        try {
            const { gameID, source, cardID, round, target, time } = info; // for record time: countdown time // 此處token中已有roomID gameID資訊
            const user = socket.info;
            const room = user.roomID;
            console.log("===========in click card============");
            const oppoInfo = { source: source, cardID: cardID };
            socket.to(room).emit("opposite click card", oppoInfo); // 對其他人 此處效能待改 送出卡片和數字分離了 如是用cache 就沒啥差 因為cache很快
            const number = await getCardNumberinCache(gameID, info.round, info.cardID); // use cache
            console.log(`socketID: ${socket.id} | email: ${user.email} in room: ${room} click: ${number}`);
            const CardfilledInfo = { cardID: cardID, number: number };
            io.to(room).emit("fill card number", CardfilledInfo);

            const utsOrder = new Date().getTime();
            // const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };
            const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder, status: socket.info.status };

            // use cache
            const selectedHis = JSON.parse(await getCache(user.email));
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
                client.del(user.email); // redis delete
            } else {
                client.set(user.email, JSON.stringify({ cardID: cardID, number: number, gameID: gameID })); // gameID for cache init after each round over
            }
            await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 待改
        } catch (err) {
            console.log(err);
            socket.emit("join failed", { err: "localStorage error" }); // 待改
        }
    });

    socket.on("click card in single mode", async (info) => {
        const { gameID, source, cardID, round, target, time } = info; // for record time: countdown time // 此處token中已有roomID gameID資訊
        const user = socket.info;
        const room = user.roomID;
        console.log("===========in click card============");
        const oppoInfo = { source: source, cardID: cardID };
        socket.to(room).emit("opposite click card", oppoInfo); // 對其他人 此處效能待改 送出卡片和數字分離了 如是用cache 就沒啥差 因為cache很快

        const number = await getCardNumberinCache(gameID, info.round, info.cardID); // use cache
        console.log(`socketID: ${socket.id} | email: ${user.email} in room: ${room} click: ${number}`);
        const CardfilledInfo = { cardID: cardID, number: number };
        io.to(room).emit("fill card number", CardfilledInfo);

        const utsOrder = new Date().getTime();
        // const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder };
        const stepInfo = { gameID: gameID, room: room, round: round, source: source, email: user.email, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder, status: socket.info.status };

        // use cache
        const selectedHis = JSON.parse(await getCache(user.email));
        if (selectedHis !== null) {
            const numberSelected = selectedHis.number;
            const ans = number * numberSelected;
            const MatchInfo = { selecterID: socket.id, cardIDs: [selectedHis.cardID, info.cardID] }; // 點擊兩次後送出的資料封包 // 有時候前端番卡出現問題 應該是此處有問題
            if (parseInt(target) === ans) {
                // 記錄配對成功的卡片
                const matchNumber = JSON.parse(await getCache(`${gameID}_matchNumberList`));
                const matchNumberList = matchNumber.list.map((ele) => {
                    return ele;
                });
                for (const i in MatchInfo.cardIDs) {
                    matchNumberList.push(MatchInfo.cardIDs[i]);
                }
                client.set(`${gameID}_matchNumberList`, JSON.stringify({ list: matchNumberList }));

                io.to(room).emit("card number match", MatchInfo);
                io.to(room).emit("update points", { playerID: socket.id, point: parseInt(POINTS) }); // 讓前端計分 配對成功 +10分
                stepInfo.addPoints = parseInt(POINTS); // 得分
            } else {
                io.to(room).emit("card number not match", MatchInfo);
            }
            client.del(user.email); // redis delete
        } else {
            client.set(user.email, JSON.stringify({ cardID: cardID, number: number, gameID: gameID })); // gameID for cache init after each round over
        }
        await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 待改
    });
};

const robotClicker = async function (cardNumber, gameID, roomID, robotName, player, target, round, time, io) { // 機器人
    let cardClickNumber = 0;
    let isCardAllMatch = false;
    while (!isCardAllMatch) {
        const switchStatus = await getCache(`${gameID}_switch`);
        if (switchStatus === null) { // 關閉robotClicker
            console.log("robotClicker dead");
            return; // 關閉robotClicker
        }

        let playerHisCardID; // 玩家點擊過的卡片
        const playerCard = JSON.parse(await getCache(player)); // 玩家點擊過的卡片
        if (playerCard !== null) {
            playerHisCardID = playerCard.cardID;
            console.log("======================playerHisCardID: " + playerHisCardID);
        }

        let robotHisCardID; // robot點擊過的卡片
        const robotHis = JSON.parse(await getCache(robotName));
        if (robotHis !== null) {
            robotHisCardID = robotHis.cardID;
            console.log("======================robotHisCardID: " + robotHisCardID);
        }

        const matchNumber = JSON.parse(await getCache(`${gameID}_matchNumberList`)); // 已經配對成功的卡片
        const matchNumberList = matchNumber.list.map((ele) => {
            return parseInt(ele);
        });

        let cardID;
        let isCardIDAllowed;
        while (true) {
            const cardIDArr = randomNumberforArrayIndex(cardNumber, 1); // return array e.g. [3] 隨機選卡
            isCardIDAllowed = cardIDArr[0] !== parseInt(playerHisCardID) && cardIDArr[0] !== parseInt(robotHisCardID) && !matchNumberList.includes(cardIDArr[0]);
            console.log(`cardID: ${cardIDArr[0]}`);
            console.log("matchNumberList: ");
            console.log(matchNumberList);
            console.log(`cardIDArr[0] !== parseInt(playerHisCardID): ${cardIDArr[0] !== parseInt(playerHisCardID)}`);
            console.log(`cardIDArr[0] !== parseInt(robotHisCardID): ${cardIDArr[0] !== parseInt(robotHisCardID)}`);
            console.log(`matchNumberList.includes[cardIDArr[0]]: ${matchNumberList.includes(cardIDArr[0])}`);
            console.log(`isCardIDAllowed: ${isCardIDAllowed}`);

            if (isCardIDAllowed) {
                cardID = cardIDArr[0];
                console.log("======================robot choose CardID: " + cardID);
                break;
            }

            console.log(`cardNumber: ${cardNumber}`);
            console.log(`matchNumberList.length: ${matchNumberList.length}`);
            if (cardNumber === matchNumberList.length) {
                isCardAllMatch = true;
                break; // 卡片全部配對完成
            }
        }
        const oppoInfo = { source: "robot", cardID: cardID };
        io.to(roomID).emit("opposite click card", oppoInfo);
        const number = await getCardNumberinCache(gameID, round, cardID); // use cache
        console.log(`Robot in room: ${roomID} click: CardID ${cardID} Number ${number}`);
        const CardfilledInfo = { cardID: cardID, number: number };
        io.to(roomID).emit("fill card number", CardfilledInfo);

        const utsOrder = new Date().getTime();
        const stepInfo = { gameID: gameID, room: roomID, round: round, source: `${gameID}_robot`, email: `${gameID}_robot`, cardID: parseInt(cardID), number: number, addPoints: 0, time: parseInt(time), utsOrder: utsOrder, status: 1 };

        const selectedHis = JSON.parse(await getCache(robotName)); // gameID + _robot
        if (selectedHis !== null) {
            const numberSelected = selectedHis.number;
            const ans = number * numberSelected;
            const MatchInfo = { selecterID: "robot", cardIDs: [selectedHis.cardID, cardID] };
            if (parseInt(target) === ans) {
                // 記錄配對成功的卡片
                const matchNumber = JSON.parse(await getCache(`${gameID}_matchNumberList`));
                const matchNumberList = matchNumber.list.map((ele) => {
                    return ele;
                });
                for (const i in MatchInfo.cardIDs) {
                    matchNumberList.push(MatchInfo.cardIDs[i]);
                }
                client.set(`${gameID}_matchNumberList`, JSON.stringify({ list: matchNumberList }));

                io.to(roomID).emit("card number match", MatchInfo);
                io.to(roomID).emit("update points", { playerID: robotName, point: parseInt(POINTS) }); // 讓前端計分 配對成功 +10分
                stepInfo.addPoints = parseInt(POINTS); // 得分
            } else {
                io.to(roomID).emit("card number not match", MatchInfo);
            }
            client.del(robotName); // redis delete
        } else {
            client.set(robotName, JSON.stringify({ cardID: cardID, number: number, gameID: gameID })); // gameID for cache init after each round over
        }
        await recordEveryStep(stepInfo); // 可否改為遊戲結束後一次insert? 機器人的記錄

        cardClickNumber += 1; // robotClicker點擊次數
        if (cardClickNumber === 2) {
            await delay(200);
            cardClickNumber = 0;
        }
        await delay(ROBOTSTEP);
    }
    console.log("================================所有卡片被選完==============================="); // 待改 或許可以提早終止？
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

const randomNumberforArrayIndex = (range, count) => { // 0
    const randomNumberArr = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * range);
        randomNumberArr.push(randomNumber);
    }
    return randomNumberArr;
};

module.exports = {
    getUserInfo,
    updateRoomLobbyinfo,
    processinRoom,
    Room,
    ClickCardinGame,
    chat
};
