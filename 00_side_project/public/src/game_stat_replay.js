// for record page
function gameStatReplay (hitRate, totalPointsNumber, roundsPoints, winnerStatus) {
    const deleteItem = document.querySelector("#middle");
    deleteItem.remove();

    const middle = document.createElement("div");
    middle.id = "middle";
    middle.className = "middle-Stat";
    const status = document.createElement("div");
    status.id = "status-stat";
    status.className = "game_status";
    status.innerHTML = "遊戲結束！";
    const goal = document.createElement("div");
    goal.id = "goal-stat";
    goal.className = "game_status";
    // goal.innerHTML = "Target: card1 x card2 = 144";
    goal.innerHTML = "THANKS!";
    const countdown = document.createElement("div");
    countdown.id = "countdown-stat";
    countdown.className = "game_status";
    countdown.innerHTML = "看看自己的成績吧！";

    const record = document.createElement("div");
    record.id = "record";
    const recordTitle = document.createElement("div");
    recordTitle.id = "record-title";
    recordTitle.innerHTML = "遊戲記錄: ";
    const recordBorder = document.createElement("div");
    recordBorder.id = "record_border";
    const correctRate = document.createElement("div");
    correctRate.className = "record_info";
    correctRate.id = "correct_rate";
    correctRate.innerHTML = `點擊命中率(正確率): ${(hitRate * 100).toFixed(2)}%`;
    const totalPoints = document.createElement("div");
    totalPoints.className = "record_info";
    totalPoints.id = "total_points";
    totalPoints.innerHTML = `總得分: ${totalPointsNumber}`;
    const eachRoundPoint = document.createElement("div");
    eachRoundPoint.className = "record_info";
    eachRoundPoint.id = "each_round_point";
    const strRoundsPoints = roundsPoints.toString().replace(/,/g, "/");
    eachRoundPoint.innerHTML = "每回合得分: " + strRoundsPoints;
    // console.log(roundsPoints);
    // console.log(strRoundsPoints);

    // const eachRoundTime = document.createElement("div");
    // eachRoundTime.className = "record_info";
    // eachRoundTime.id = "each_round_time";

    const winner = document.createElement("div");
    winner.className = "record_info";
    winner.id = "winner";
    winner.innerHTML = `遊戲勝負結果:  ${winnerStatus}`;
    recordBorder.append(correctRate, totalPoints, eachRoundPoint, winner);

    record.append(recordTitle, recordBorder);

    const replay = document.createElement("div");
    replay.id = "replay";
    const replayTitle = document.createElement("div");
    replayTitle.id = "replay_title";
    replayTitle.innerHTML = "重播(回合): ";
    const replayItem = document.createElement("select");
    replayItem.id = "replay_item";
    const choiceRound = document.createElement("option");
    choiceRound.innerHTML = "想要看第幾回合呢？";
    replayItem.append(choiceRound);
    for (let i = 0; i < roundsPoints.length; i++) {
        const round = document.createElement("option");
        round.innerHTML = `第 ${i + 1} 回合`;
        replayItem.append(round);
    }
    const all = document.createElement("option");
    all.innerHTML = "ALL";
    replayItem.append(all);
    const submitButton = document.createElement("button");
    submitButton.id = "comfirm";
    submitButton.innerHTML = "送出";
    const replayWrapper = document.createElement("div");
    replayWrapper.id = "replay-wrapper";
    replayWrapper.append(replayTitle, replayItem, submitButton);
    replay.append(replayWrapper);

    const choose = document.createElement("div");
    choose.id = "choose";
    const wrap = document.createElement("div");
    wrap.id = "wrap";
    const again = document.createElement("button");
    again.id = "again";
    again.innerHTML = "再看一次";
    again.style = "cursor: pointer";
    const goodbye = document.createElement("button");
    goodbye.id = "goodbye";
    goodbye.innerHTML = "不了！掰掰";
    goodbye.style = "cursor: pointer";
    wrap.append(again, goodbye);
    choose.append(wrap);

    // middle.append(status, goal, countdown, record, replay, choose);
    middle.append(status, countdown, record, replay, choose);

    const container = document.querySelector("#container");
    container.insertBefore(middle, container.children[container.children.length - 1]);
}

export { gameStatReplay };
