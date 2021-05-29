function combineMatchPageforAgain (socket) {
    const middle = document.querySelector("#middle");
    while (middle.firstChild) { // 移除middle下 每個項目
        middle.removeChild(middle.lastChild);
    };
    const ruleSetting = document.createElement("div");
    ruleSetting.id = "rule_setting";
    ruleSetting.innerHTML = "Rules setting";
    const settingDetails = document.createElement("div");
    settingDetails.id = "setting_details";
    const type = document.createElement("div");
    type.id = "type";
    type.className = "details";
    const numberofCards = document.createElement("div");
    numberofCards.id = "number_of_cards";
    numberofCards.className = "details";
    const rounds = document.createElement("div");
    rounds.id = "rounds";
    rounds.className = "details";
    const target = document.createElement("div");
    target.id = "target";
    target.className = "details";
    settingDetails.append(type, numberofCards, rounds, target);
    const startButton = document.createElement("button");
    startButton.id = "start";
    startButton.className = "button";
    startButton.innerHTML = "我準備好了！";
    middle.append(ruleSetting, settingDetails, startButton);
}

export { combineMatchPageforAgain };
