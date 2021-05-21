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

export { refreshRoundsInfo };
