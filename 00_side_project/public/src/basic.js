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

// for chat room
const sendMsg = document.querySelector("#send");
sendMsg.addEventListener("click", () => {
    const msg = document.querySelector("#sendmsg input");
    // console.log(msg.value);
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
    // if (isDetailsOK) {
    //     alert("規則設定有誤！");
    //     return;
    // }

    const details = {
        type: type.innerHTML,
        number: number.innerHTML,
        rounds: rounds.innerHTML,
        targets: targetList
    };
    // console.log(details);
    refreshRoundsInfo();
    addPoints();
    addGameInfo();
    const deleteItem = document.querySelector("#middle");
    deleteItem.remove();
    readytoStart();
});

// refresh page for cardgame and set cards
// ============================ 待改
function readytoStart () {
    // const deleteItem = document.querySelector("#middle");
    // deleteItem.remove();
    const middle = document.createElement("div");
    middle.id = "middle";
    const status = document.createElement("div");
    status.id = "status";
    status.className = "game_status";
    status.innerHTML = "Ready";
    const goal = document.createElement("div");
    goal.id = "goal";
    goal.className = "game_status";
    goal.innerHTML = "Target: card1 x card2 = 144"; // wait for ajax()
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.className = "game_status";
    countdown.innerHTML = "Countdown: 10 s"; // wait for ajax()
    const game = document.createElement("div");
    game.id = "game";
    const memoryGame = document.createElement("section");
    memoryGame.className = "memory-game";
    for (let i = 0; i < 16; i++) { // i wati for ajax()
        const card = document.createElement("div");
        card.className = "memory-card";
        // card["data-framework"] = "pair_1";
        card.dataset.framework = `pair_${i}`;
        const frontFace = document.createElement("div");
        frontFace.className = "front-face";
        frontFace.id = "2";
        frontFace.innerHTML = "2";
        const backFace = document.createElement("img");
        backFace.className = "back-face";
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
    cardGame(); // for card game
}

// for cardgame
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

function refreshRoundsInfo () {
    const roundsInfo = document.querySelector("#block");
    roundsInfo.remove();
    const rounds = document.createElement("div");
    rounds.id = "rounds_record";
    const number = document.querySelector("#rounds option:checked");
    // console.log(number.innerHTML);
    for (let i = 0; i < parseInt(number.innerHTML); i++) {
        const roundItem = document.createElement("div");
        roundItem.id = `round_${i + 1}`;
        roundItem.className = "round";
        roundItem.innerHTML = `Round ${i + 1}`;
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
    userPoints.innerHTML = "Points: 123";
    const oppositeUserPoints = document.createElement("div");
    oppositeUserPoints.id = "user_points";
    oppositeUserPoints.className = "points";
    oppositeUserPoints.innerHTML = "Points: 321";
    const left = document.querySelector("#left");
    left.append(userPoints);
    const right = document.querySelector("#right");
    // right.insertBefore(oppositeUserPoints, right.childNodes[6]);
    right.insertBefore(oppositeUserPoints, right.children[right.children.length - 1]);
}

function addGameInfo () {
    const gameInfo = document.createElement("div");
    gameInfo.id = "game_info";
    // wait for ajax()
    const infoTitle = document.createElement("div");
    infoTitle.className = "info";
    infoTitle.innerHTML = "Game info: ";
    const infoType = document.createElement("div");
    infoType.className = "info";
    infoType.innerHTML = "Type: Multi";
    const infoAmount = document.createElement("div");
    infoAmount.className = "info";
    infoAmount.innerHTML = "Cards amount: 4 x 4 ";
    const infoTotal = document.createElement("div");
    infoTotal.className = "info";
    infoTotal.innerHTML = "Total rounds: 3";
    gameInfo.append(infoTitle, infoType, infoAmount, infoTotal);
    const right = document.querySelector("#right");
    // right.insertBefore(gameInfo, right.childNodes[8]); // beware
    right.insertBefore(gameInfo, right.children[right.children.length - 1]);
}

// for record
// const record = document.querySelector("#start");
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
