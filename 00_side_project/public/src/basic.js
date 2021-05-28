import { addGameInfo } from "./add_game_info.js";
import { addGameStatusandCards } from "./add_game_status_cards.js";
import { cardGame } from "./card_game.js";
import { gameStat } from "./game_stat.js";
import { initPointsInfo } from "./points_info_init.js";
import { refreshRoundsInfo } from "./refresh_rounds_info.js";
import { startGame } from "./start_game.js";
import { updatePoints } from "./update_points.js";

const token = localStorage.getItem("access_token");
const socket = io({
    auth: {
        token: token
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
// });

const urlParams = new URLSearchParams(window.location.search);
const roomID = urlParams.get("roomID");
socket.emit("in room", { roomID: roomID, token: token });

// select music
const music = document.querySelector("#music");
music.addEventListener("change", () => {
    const song = document.querySelector("#music option:checked");
    console.log(song);
});

// for changing rounds input block number in settting rules
const roundsNumber = document.querySelector("#rounds");
roundsNumber.addEventListener("change", () => {
    const number = document.querySelector("#rounds option:checked");
    const target = document.querySelector("#target");
    const targetList = document.querySelectorAll(".target_item");
    for (let i = 0; i < targetList.length; i++) {
        targetList[i].remove();
    }

    if (number.innerHTML === "Rounds") {
        const roundsItem = document.createElement("input");
        roundsItem.className = "target_item";
        roundsItem.id = "round_1_target";
        roundsItem.placeholder = "Please select round number";
        target.append(roundsItem);
        return;
    }

    for (let i = 0; i < parseInt(number.innerHTML); i++) {
        const roundsItem = document.createElement("input");
        roundsItem.className = "target_item";
        roundsItem.id = `round_${i + 1}_target`;
        roundsItem.placeholder = `Round ${i + 1} target`;
        target.append(roundsItem);
    }
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

// finish rules setting and start to play
const start = document.querySelector("#start");
start.addEventListener("click", () => {
    startGame(socket);
});

socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    chatroom.appendChild(item);
    chatroom.scrollTo(0, chatroom.scrollHeight);
});

socket.on("execute rules", (info) => {
    const gameID = info.gameID;
    localStorage.setItem("gameID", gameID);
    refreshRoundsInfo(info.rules.rounds);
    initPointsInfo();
    addGameInfo(info.rules.type, info.rules.number, info.rules.rounds);
    addGameStatusandCards(info.round, info.rules.number, info.target, info.rules.state, info.cardsSetting);
});

socket.on("countdown in ready", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `Countdown: ${time} s`;
});

socket.on("countdown in game", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `Countdown: ${time} s`;
});

socket.on("start game", (info) => {
    if (info.msg === "start") {
        const cardFrontFaces = document.querySelectorAll(".front-face");
        const cardBackFaces = document.querySelectorAll(".back-face");
        const status = document.querySelector("#status");
        status.innerHTML = `Round ${info.round} Start!`;
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
    alert("GAME OVER!");
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
});
