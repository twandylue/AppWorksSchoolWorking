import { addGameInfo } from "./add_game_info.js";
import { addGameStatusandCards } from "./add_game_status_cards.js";
import { cardGame } from "./card_game.js";
import { gameStat } from "./game_stat.js";
import { initPointsInfo } from "./points_info_init.js";
import { refreshRoundsInfo } from "./refresh_rounds_info.js";
import { updatePoints } from "./update_points.js";
import { showGameRules } from "./showGameRules.js";
import { combineMatchPageforAgain } from "./combMatchPage.js";

const token = localStorage.getItem("access_token");
const roomID = localStorage.getItem("roomID");
const socket = io({
    auth: {
        token: token,
        roomID: roomID
    }
});

socket.on("connect", () => {
    // 講整段code放入此處 表示連線後才能執行?
    console.log(socket.id);
});

socket.on("leave room", (msg) => {
    console.log(msg);
    Swal.fire({
        icon: "warning",
        title: "你斷線囉",
        text: "回到遊戲大廳!",
        confirmButtonText: "確認"
    }).then(() => {
        window.location.href = "./gamelobby.html";
    });
});

socket.on("opponent leave room", (msg) => {
    console.log(msg);
    Swal.fire({
        icon: "warning",
        title: "對手斷線了",
        text: "回到遊戲大廳!",
        confirmButtonText: "確認"
    }).then(() => {
        window.location.href = "./gamelobby.html";
    });
});

socket.on("join failed", (msg) => {
    Swal.fire({
        icon: "error",
        title: "加入房間失敗",
        text: "請重新加入房加!",
        confirmButtonText: "好的"
    }).then(() => {
        window.location.href = "/gamelobby.html";
    });
});

// Swal.fire({ // sweet alert寫法 不同體驗 先保留
//     icon: "warning",
//     title: "準備好了嗎？",
//     text: "要開始了唷!",
//     confirmButtonText: "確認"
// }).then((result) => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const roomID = urlParams.get("roomID");
//     socket.emit("in room", { roomID: roomID, token: token });
//     socket.emit("get user name", "get my name");
// });

socket.emit("in room", { roomID: roomID, token: token }); // 不好的寫法
socket.emit("get user name", "get my name");

socket.on("show my name", (user) => {
    document.querySelector("#user_name").innerHTML = `Hi! ${user.name}`;
});

socket.on("fill name", (name) => {
    document.querySelector("#user_container #name").innerHTML = name;
});
socket.on("fill opponent name", (oppoName) => {
    document.querySelector("#opposite_user_name").innerHTML = oppoName;
});

// for chat room
const inputEnter = document.querySelector("#sendmsg #input");
const sendMsg = document.querySelector("#send");
const chatroom = document.querySelector("#messages");

sendMsg.addEventListener("click", () => {
    const userName = document.querySelector("#user_container #name").innerHTML;
    if (inputEnter.value) {
        socket.emit("chat message", userName + ": " + inputEnter.value);
        inputEnter.value = "";
    }
});

inputEnter.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMsg.click();
    }
});

socket.on("wait for opponent", () => { // 目前應該為等待畫面 不會顯示規則
    Swal.fire({
        icon: "warning",
        title: "尚未配對成功",
        text: "等一下對手出現",
        confirmButtonText: "確認"
    });
    const startButton = document.querySelector("#start");
    startButton.disabled = true;
    startButton.innerHTML = "等待對手中";
});

socket.on("both of you in ready", (info) => { // gameID 第一次出現 在info中
    const { gameID } = info;
    localStorage.setItem("gameID", gameID);
    localStorage.setItem("rules", JSON.stringify(info.rules));
    showGameRules(info.rules);

    const startButton = document.querySelector("#start");
    if (startButton) {
        startButton.disabled = false;
        startButton.innerHTML = "我準備好了！";
    }
});

const start = document.querySelector("#start");
start.addEventListener("click", () => {
    start.disabled = "disabled";
    Swal.fire({
        icon: "warning",
        title: "準備完成！",
        text: "等待對手準備...",
        confirmButtonText: "確認"
    }).then(() => {
        const gameID = localStorage.getItem("gameID");
        const rules = localStorage.getItem("rules");
        const gameRules = JSON.parse(rules);
        if (gameRules) {
            gameRules.gameID = gameID;
            socket.emit("I am ready", (gameRules));
        }
    });
});

socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    chatroom.appendChild(item);
    chatroom.scrollTo(0, chatroom.scrollHeight);
});

socket.on("execute rules", (info) => {
    // refreshRoundsInfo(info.rules.rounds); // 待改
    // initPointsInfo(); // 不用了 一開始就設定好
    addGameInfo(info.rules.type, info.rules.number, info.rules.rounds, info.rules.targets);
    addGameStatusandCards(info.round, info.rules.number, info.target, info.rules.state, info.cardsSetting);
});

socket.on("countdown in ready", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `遊戲倒數時間: ${time} s`;
});

socket.on("countdown in game", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `遊戲倒數時間: ${time} s`;
});

socket.on("start game", (info) => { // 翻牌(問號面)
    if (info.msg === "start") {
        const cardFrontFaces = document.querySelectorAll(".front-face");
        const cardBackFaces = document.querySelectorAll(".back-face");
        const status = document.querySelector("#status");
        // status.innerHTML = `Round ${info.round} Start!`;
        status.innerHTML = `第 ${info.round} 回合 Start！`;
        for (let i = 0; i < cardFrontFaces.length; i++) {
            cardFrontFaces[i].innerHTML = "";
            cardFrontFaces[i].classList.add("front-face_start");
            cardBackFaces[i].classList.remove("back-face_ready");
        }

        cardGame(socket, info.round, info.target);
    }
});

socket.on("fill card number", (cardfilledInfo) => {
    const cardFrontFaces = document.querySelectorAll(".front-face");
    cardFrontFaces[cardfilledInfo.cardID].innerHTML = cardfilledInfo.number;
});

socket.on("next round execute rules", (info) => { // 要刪除game()
    addGameStatusandCards(info.round, info.rules.number, info.target, info.rules.state, info.cardsSetting);
});

socket.on("update points", (pointsInfo) => {
    updatePoints(socket, pointsInfo);
});

socket.on("game over", (gameStatInfo) => {
    Swal.fire({
        icon: "success",
        title: "遊戲結束！",
        text: "看看自己的成績吧",
        confirmButtonText: "確認"
    });

    let hitRate, roundsPoints, totalPoints, winnerStatus;
    for (const i in gameStatInfo.results) {
        if (socket.id === gameStatInfo.results[i].playerID) {
            hitRate = gameStatInfo.results[i].hitRate;
            roundsPoints = gameStatInfo.results[i].roundsPoints.map((element) => { return element; });
            totalPoints = gameStatInfo.results[i].totalPoints;
        }
    }
    if (gameStatInfo.winner[0] === socket.id) {
        winnerStatus = "You win";
    } else {
        winnerStatus = "You lose";
    }
    if (gameStatInfo.winner.length === 2) {
        winnerStatus = "Tie";
    }
    gameStat(hitRate, totalPoints, roundsPoints, winnerStatus);

    const again = document.querySelector("#again");
    again.addEventListener("click", () => {
        const roomID = localStorage.getItem("roomID");
        const gameID = localStorage.getItem("gameID");
        const info = { gameID: gameID, roomID: roomID };
        socket.emit("want to play again", info);
        Swal.fire({
            icon: "info",
            title: "已送出再玩一次的邀請",
            text: "請等待對手回應",
            confirmButtonText: "好的"
        }).then(() => {
            again.disabled = true;
            again.innerHTML = "等待對手回應";
        });
    });

    const goodbye = document.querySelector("#goodbye");
    goodbye.addEventListener("click", () => {
        Swal.fire({
            icon: "warning",
            title: "離開遊戲房間",
            text: "再見",
            confirmButtonText: "Bye"
        }).then(() => {
            window.location.href = "/gamelobby.html";
        });
    });
});

socket.on("again", (info) => {
    // console.log(info);
    // console.log(`gameID: ${info.gameID}`);
    localStorage.setItem("gameID", info.gameID);
    localStorage.setItem("rules", JSON.stringify(info.rules)); // 更新規則 危險 會有被前端串改的風險 機制待改
    combineMatchPageforAgain(socket);
    showGameRules(info.rules);

    const startButton = document.querySelector("#start");
    startButton.addEventListener("click", () => {
        startButton.disabled = "disabled";
        Swal.fire({
            icon: "warning",
            title: "準備完成！",
            text: "等待對手準備...",
            confirmButtonText: "確認"
        }).then(() => {
            const gameID = localStorage.getItem("gameID");
            const rules = localStorage.getItem("rules");
            const gameRules = JSON.parse(rules);
            gameRules.gameID = gameID;
            socket.emit("I am ready", (gameRules));
        });
    });

    Swal.fire({
        icon: "warning",
        title: "對手也想再玩一局！",
        text: "轉跳至準備頁面",
        confirmButtonText: "確認"
    });
});
