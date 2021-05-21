// import { sendSettingInfo } from "./matchFetch.js";
import { refreshRoundsInfo } from "./refresh_rounds_info.js";
import { addGameInfo } from "./add_game_info.js";
import { addGameStatusandCards } from "./add_game_status_cards.js";
import { updateRecord } from "./updare_record.js";
import { updatePoints } from "./update_points.js";
import { startGame } from "./start_game.js";
import { cardGame } from "./card_game.js";

const socket = io();
socket.on("connect", () => {
    // 講整段code放入此處 表示連線後才能執行
    console.log(socket.id);
});

// select music
const music = document.querySelector("#music");
music.addEventListener("change", () => {
    const song = document.querySelector("#music option:checked");
    console.log(song);
});

// refresh user name
const submitName = document.querySelector("#submit_name");
submitName.addEventListener("click", () => {
    const name = document.querySelector("#input_name");
    const removeItem = document.querySelector("#input");
    removeItem.remove();
    const userName = document.createElement("div");
    userName.id = "main_user_name";
    userName.innerHTML = name.value;
    const userContainer = document.querySelector("#user_container");
    userContainer.append(userName);
    socket.emit("name decided", name.value);
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

// for chat room
const inputEnter = document.querySelector("#sendmsg #input");
const sendMsg = document.querySelector("#send");
const chatroom = document.querySelector("#messages");

sendMsg.addEventListener("click", () => {
    let userName;
    if (document.querySelector("#main_user_name") !== null) {
        userName = document.querySelector("#main_user_name").innerHTML;
    } else {
        alert("Please enter your name!");
        return;
    }

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

// turn to record page
const record = document.querySelector("#start");
record.addEventListener("click", () => {
    updateRecord();
});

socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    chatroom.appendChild(item);
    chatroom.scrollTo(0, chatroom.scrollHeight);
});

socket.on("opponent name", (name) => {
    const opponentName = document.querySelector("#opposite_user_name");
    opponentName.innerHTML = name;
});

socket.on("execute rules", (info) => {
    console.log(info.rules);
    refreshRoundsInfo(info.rules.rounds);
    updatePoints();
    addGameInfo(info.rules.type, info.rules.number, info.rules.rounds);
    addGameStatusandCards(info.rules.number, info.rules.targets, info.rules.state, info.cardsSetting);
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

socket.on("start game", (rules) => {
    if (rules.state === "start") {
        const cardFrontFaces = document.querySelectorAll(".front-face");
        const cardBackFaces = document.querySelectorAll(".back-face");
        for (let i = 0; i < cardFrontFaces.length; i++) {
            cardFrontFaces[i].innerHTML = "??? 由後端控制"; /// / 待改
            cardFrontFaces[i].classList.add("front-face_start");
            cardBackFaces[i].classList.remove("back-face_ready");
        }
        cardGame(socket);
        socket.emit("in game", socket.id); // start to countdown
    }
});
