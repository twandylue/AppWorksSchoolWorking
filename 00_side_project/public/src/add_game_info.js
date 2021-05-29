function addGameInfo (type, number, rounds) {
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
    infoAmount.innerHTML = `Cards amount: ${number}`; // ajax
    const infoTotal = document.createElement("div");
    infoTotal.className = "info";
    infoTotal.innerHTML = `Total rounds: ${rounds}`; // ajax
    gameInfo.append(infoTitle, infoType, infoAmount, infoTotal);
    const right = document.querySelector("#right");
    // right.insertBefore(gameInfo, right.childNodes[8]); // beware
    right.insertBefore(gameInfo, right.children[right.children.length - 1]);
}

export { addGameInfo };
