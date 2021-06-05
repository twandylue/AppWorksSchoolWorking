// refresh page for cardgame and set cards
function addGameStatusandCards (round, number, target, state, cardsSetting) {
    const deleteItem = document.querySelector("#middle");
    deleteItem.remove();
    const middle = document.createElement("div");
    middle.id = "middle";
    const status = document.createElement("div");
    status.id = "status";
    status.className = "game_status";
    status.innerHTML = `第 ${round} 回合 Standby`; // 待改
    const goal = document.createElement("div");
    goal.id = "goal";
    goal.className = "game_status";
    goal.innerHTML = `目標: 卡片1數字 x 卡片2數字 = ${target}`; // 待改
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.className = "game_status";
    // countdown.innerHTML = "Countdown: 10 s"; // 待改
    countdown.innerHTML = "準備倒數時間: 10 s"; // 待改
    const game = document.createElement("div"); // 雞肋？ 待改
    game.id = "game";
    const memoryGame = document.createElement("section");
    memoryGame.className = "memory-game";
    for (let i = 0; i < number; i++) {
        const card = document.createElement("div");
        card.classList.add("memory-card", `double${number}`);
        card.id = `cardID_${i}`;
        card.dataset.framework = `card_${i}`; // wait for ajax() pair ans 待改
        const frontFace = document.createElement("div");
        frontFace.id = `${i}`;
        frontFace.innerHTML = `${cardsSetting[i]}`;
        const backFace = document.createElement("img");

        if (state === "in ready") {
            frontFace.className = "front-face";
            backFace.classList.add("back-face", "back-face_ready");
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
}

export { addGameStatusandCards };
