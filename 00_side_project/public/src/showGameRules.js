function showGameRules (rules) {
    document.querySelector("#type").innerHTML = rules.type;
    document.querySelector("#number_of_cards").innerHTML = rules.number;
    document.querySelector("#rounds").innerHTML = rules.rounds;
    const target = document.querySelector("#target");
    for (let i = 0; i < rules.targets.length; i++) {
        const item = document.createElement("div");
        item.innerHTML = rules.targets[i];
        target.append(item);
    }
}

export { showGameRules };
