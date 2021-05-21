function startGame (socket) {
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
    socket.emit("in ready", socket.id); // start to countdown
}

export { startGame };
