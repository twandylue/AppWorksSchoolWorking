// refresh page for cardgame and set cards
function addGameStatusandCards (number, targets, state, cardsSetting) {
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
    countdown.innerHTML = "Countdown: 5 s"; // wait for ajax()
    const game = document.createElement("div");
    game.id = "game";
    const memoryGame = document.createElement("section");
    memoryGame.className = "memory-game";
    for (let i = 0; i < (number * number); i++) { // i wati for ajax()
        const card = document.createElement("div");
        card.classList.add("memory-card", `double${number}`); // double{i} wait for ajax()
        card.dataset.framework = `pair_${i}`; // wait for ajax() pair ans 待改
        const frontFace = document.createElement("div");
        frontFace.id = `${i}`; // wait for ajax() pair ans
        frontFace.innerHTML = `${cardsSetting[i]}`; // wait for ajax() pair ans
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
