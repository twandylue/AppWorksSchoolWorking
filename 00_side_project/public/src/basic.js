import { sendSettingInfo } from "./matchFetch.js";
// select music
const music = document.querySelector("#music");
music.addEventListener("change", () => {
    const song = document.querySelector("#music option:checked");
    console.log(song);
});

// refresh user name
const submitName = document.querySelector("#submit_name");
submitName.addEventListener("click", (event) => {
    const name = document.querySelector("#input_name");
    const removeItem = document.querySelector("#input");
    removeItem.remove();
    const userName = document.createElement("div");
    userName.id = "main_user_name";
    userName.innerHTML = name.value;
    const userContainer = document.querySelector("#user_container");
    userContainer.append(userName);
});

// for changing rounds input block number
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

const socket = io();
// socket.on("connect", () => {
//     console.log(socket.connected); // true
// });

const inputEnter = document.querySelector("#sendmsg #input");
const sendMsg = document.querySelector("#send");
const chatroom = document.querySelector("#messages");

// for chat room
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

socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    chatroom.appendChild(item);
    chatroom.scrollTo(0, chatroom.scrollHeight);
});

socket.on("execute rules", (rules) => {
    // console.log(rules);
    refreshRoundsInfo(rules.rounds);
    addPoints();
    addGameInfo(rules.type, rules.number, rules.rounds);
    addGameStatusandCards(rules.number, rules.targets, rules.state);
});

socket.on("countdown in ready", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `Countdown: ${time} s`;
});

socket.on("start game", (msg) => {
    console.log(msg);
});

socket.on("countdown in game", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `Countdown: ${time} s`;
});

// start to play
const start = document.querySelector("#start");
start.addEventListener("click", () => {
    const type = document.querySelector("#type option:checked");
    const number = document.querySelector("#number_of_cards option:checked");
    const rounds = document.querySelector("#rounds option:checked");
    const targets = document.querySelectorAll(".target_item");

    const targetList = [];
    let isRoundsNumberEmpty = false;
    for (let i = 0; i < targets.length; i++) {
        targetList.push(targets[i].value);
        if (targets[i].value === "") {
            isRoundsNumberEmpty = true;
        }
    }

    const isDetailsOK = type.innerHTML === "Type" || number.innerHTML === "Number of cards" || rounds.innerHTML === "Rounds" || isRoundsNumberEmpty;
    if (isDetailsOK) {
        alert("規則設定有誤！");
        return;
    }

    const rules = {
        type: type.dataset.type,
        number: number.dataset.number,
        rounds: rounds.innerHTML,
        targets: targetList
    };

    socket.emit("rules", rules); // set rules
    socket.emit("in ready", 10); // start to countdown

    // sendSettingInfo(rules).then((result) => {
    //     // 兩端同事變畫面
    //     // refreshRoundsInfo(result.rounds);
    //     // addPoints();
    //     // addGameInfo(result.type, result.number, result.rounds);
    //     // addGameStatusandCards(result.number, result.targets);
    //     socket.emit("status", "ready to go");
    // });
});

function refreshRoundsInfo (roundsNumber) {
    const roundsInfo = document.querySelector("#block");
    roundsInfo.remove();
    const rounds = document.createElement("div");
    rounds.id = "rounds_record";
    for (let i = 0; i < roundsNumber; i++) { // ajax
        const roundItem = document.createElement("div");
        roundItem.id = `round_${i + 1}`;
        roundItem.className = "round";
        roundItem.innerHTML = `Round ${i + 1}`; // ajax
        rounds.append(roundItem);
    }
    const right = document.querySelector("#right");
    right.prepend(rounds);
}

function addPoints () {
    const choiceButtons = document.querySelectorAll(".choice_button");
    for (let i = 0; i < choiceButtons.length; i++) {
        choiceButtons[i].remove();
    }

    const pics = document.querySelector("#paper_scissor_stone");
    pics.remove();

    const userPoints = document.createElement("div");
    userPoints.id = "user_points";
    userPoints.className = "points";
    userPoints.innerHTML = "Points: 123"; // wait for server
    const oppositeUserPoints = document.createElement("div");
    oppositeUserPoints.id = "user_points";
    oppositeUserPoints.className = "points";
    oppositeUserPoints.innerHTML = "Points: 321"; // wait for server
    const left = document.querySelector("#left");
    left.append(userPoints);
    const right = document.querySelector("#right");
    // right.insertBefore(oppositeUserPoints, right.childNodes[6]);
    right.insertBefore(oppositeUserPoints, right.children[right.children.length - 1]);
}

function addGameInfo (type, number, rounds) { /// //////
    const gameInfo = document.createElement("div");
    gameInfo.id = "game_info";
    const infoTitle = document.createElement("div");
    infoTitle.className = "info";
    infoTitle.innerHTML = "Game info: ";
    const infoType = document.createElement("div");
    infoType.className = "info";
    infoType.innerHTML = `Type: ${type}`; // ajax
    const infoAmount = document.createElement("div");
    infoAmount.className = "info";
    infoAmount.innerHTML = `Cards amount: ${number} x ${number} `; // ajax
    const infoTotal = document.createElement("div");
    infoTotal.className = "info";
    infoTotal.innerHTML = `Total rounds: ${rounds}`; // ajax
    gameInfo.append(infoTitle, infoType, infoAmount, infoTotal);
    const right = document.querySelector("#right");
    // right.insertBefore(gameInfo, right.childNodes[8]); // beware
    right.insertBefore(gameInfo, right.children[right.children.length - 1]);
}

// refresh page for cardgame and set cards
function addGameStatusandCards (number, targets, state) {
    const deleteItem = document.querySelector("#middle");
    deleteItem.remove();
    const middle = document.createElement("div");
    middle.id = "middle";
    const status = document.createElement("div");
    status.id = "status";
    status.className = "game_status";
    status.innerHTML = "Ready";
    const goal = document.createElement("div");
    goal.id = "goal";
    goal.className = "game_status";
    goal.innerHTML = `Target: card1 x card2 = ${targets[0]}`; // wait for ajax()
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.className = "game_status";
    countdown.innerHTML = "Countdown: 10 s"; // wait for ajax()
    const game = document.createElement("div");
    game.id = "game";
    const memoryGame = document.createElement("section");
    memoryGame.className = "memory-game";
    for (let i = 0; i < (number * number); i++) { // i wati for ajax()
        const card = document.createElement("div");
        card.classList.add("memory-card", `double${number}`); // double{i} wait for ajax()
        card.dataset.framework = `pair_${i}`; // wait for ajax()
        const frontFace = document.createElement("div");
        // frontFace.className = "front-face";
        frontFace.id = `${i}`; // wait for ajax()
        frontFace.innerHTML = `${i}`; // wait for ajax()
        const backFace = document.createElement("img");
        // backFace.className = "back-face";

        if (state === "in ready") {
            frontFace.className = "front-face";
            backFace.classList.add("back-face", "back-face_ready");
        } else if (state === "start") {
            frontFace.classList.add("front-face", "front-face_start");
            backFace.className = "back-face";
        }

        backFace.src = "./images/question_mark.svg";
        backFace.alt = "Memory Card";
        card.append(frontFace, backFace);
        memoryGame.append(card);
    }
    middle.append(status, goal, countdown, memoryGame);
    const container = document.querySelector("#container");
    // console.log(container.childNodes);
    // container.insertBefore(middle, container.childNodes[2]);
    container.insertBefore(middle, container.children[container.children.length - 1]);

    if (state === "start") {
        cardGame(); // for card game
    }
}

// for cardgame operation
function cardGame () {
    const cards = document.querySelectorAll(".memory-card");

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard () {
        if (lockBoard) return;
        if (this === firstCard) return;
        this.classList.add("flip", "card-color");

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch () {
    // do cards match?
        const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards () {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
    }

    function unflipCards () {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flip", "card-color");
            secondCard.classList.remove("flip", "card-color");
            lockBoard = false;
            resetBoard();
        }, 500);
    }

    function resetBoard () {
        [firstCard, secondCard] = [null, null];
        [hasFlippedCard, lockBoard] = [false, false];
    }

    cards.forEach(card => card.addEventListener("click", flipCard));
}

// for record
const record = document.querySelector("#start");
// record.addEventListener("click", () => {
//     const deleteItem = document.querySelector("#middle");
//     deleteItem.remove();

//     const middle = document.createElement("div");
//     middle.id = "middle";

//     const status = document.createElement("div");
//     status.id = "status";
//     status.className = "game_status";
//     status.innerHTML = "OVER";
//     const goal = document.createElement("div");
//     goal.id = "goal";
//     goal.className = "game_status";
//     goal.innerHTML = "Target: card1 x card2 = 144";
//     const countdown = document.createElement("div");
//     countdown.id = "countdown";
//     countdown.className = "game_status";
//     countdown.innerHTML = "Countdown: 0 s";

//     const recordTitle = document.createElement("div");
//     recordTitle.id = "record";
//     recordTitle.innerHTML = "Record: ";

//     const recordBorder = document.createElement("div");
//     recordBorder.id = "record_border";
//     const correctRate = document.createElement("div");
//     correctRate.className = "record_info";
//     correctRate.id = "correct_rate";
//     correctRate.innerHTML = "Correct rate: 50%";
//     const totalPoints = document.createElement("div");
//     totalPoints.className = "record_info";
//     totalPoints.id = "total_points";
//     totalPoints.innerHTML = "Total Points: 50";
//     const eachRoundPoint = document.createElement("div");
//     eachRoundPoint.className = "record_info";
//     eachRoundPoint.id = "each_round_point";
//     eachRoundPoint.innerHTML = "Each round points: 20/40/30";
//     const eachRoundTime = document.createElement("div");
//     eachRoundTime.className = "record_info";
//     eachRoundTime.id = "each_round_time";
//     eachRoundTime.innerHTML = "Each round time: 13 s/ --/ 16s";
//     const winner = document.createElement("div");
//     winner.className = "record_info";
//     winner.id = "winner";
//     winner.innerHTML = "Winner: Andy";
//     recordBorder.append(correctRate, totalPoints, eachRoundPoint, eachRoundTime, winner);
//     recordTitle.append(recordBorder);

//     const reply = document.createElement("div");
//     reply.id = "reply";
//     const replyTitle = document.createElement("div");
//     replyTitle.id = "reply_title";
//     replyTitle.innerHTML = "Reply: ";
//     const replyItem = document.createElement("select");
//     replyItem.id = "reply_item";
//     const choiceRound = document.createElement("option");
//     choiceRound.innerHTML = "Choose round";
//     replyItem.append(choiceRound);
//     for (let i = 0; i < 3; i++) {
//         const round = document.createElement("option");
//         round.innerHTML = `Round ${i + 1}`;
//         replyItem.append(round);
//     }
//     const all = document.createElement("option");
//     all.innerHTML = "ALL";
//     replyItem.append(all);
//     const submitButton = document.createElement("button");
//     submitButton.id = "comfirm";
//     submitButton.innerHTML = "Submit";
//     reply.append(replyTitle, replyItem, submitButton);

//     const choose = document.createElement("div");
//     choose.id = "choose";
//     const wrap = document.createElement("div");
//     wrap.id = "wrap";
//     const again = document.createElement("button");
//     again.id = "again";
//     again.innerHTML = "Again";
//     const goodbye = document.createElement("button");
//     goodbye.id = "goodbye";
//     goodbye.innerHTML = "Goodbye";
//     wrap.append(again, goodbye);
//     choose.append(wrap);

//     middle.append(status, goal, countdown, recordTitle, reply, choose);

//     const container = document.querySelector("#container");
//     container.insertBefore(middle, container.children[container.children.length - 1]);
// });
