// for record
function updateRecord () {
    const deleteItem = document.querySelector("#middle");
    deleteItem.remove();

    const middle = document.createElement("div");
    middle.id = "middle";

    const status = document.createElement("div");
    status.id = "status";
    status.className = "game_status";
    status.innerHTML = "OVER";
    const goal = document.createElement("div");
    goal.id = "goal";
    goal.className = "game_status";
    goal.innerHTML = "Target: card1 x card2 = 144";
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.className = "game_status";
    countdown.innerHTML = "Countdown: 0 s";

    const recordTitle = document.createElement("div");
    recordTitle.id = "record";
    recordTitle.innerHTML = "Record: ";

    const recordBorder = document.createElement("div");
    recordBorder.id = "record_border";
    const correctRate = document.createElement("div");
    correctRate.className = "record_info";
    correctRate.id = "correct_rate";
    correctRate.innerHTML = "Correct rate: 50%";
    const totalPoints = document.createElement("div");
    totalPoints.className = "record_info";
    totalPoints.id = "total_points";
    totalPoints.innerHTML = "Total Points: 50";
    const eachRoundPoint = document.createElement("div");
    eachRoundPoint.className = "record_info";
    eachRoundPoint.id = "each_round_point";
    eachRoundPoint.innerHTML = "Each round points: 20/40/30";
    const eachRoundTime = document.createElement("div");
    eachRoundTime.className = "record_info";
    eachRoundTime.id = "each_round_time";
    eachRoundTime.innerHTML = "Each round time: 13 s/ --/ 16s";
    const winner = document.createElement("div");
    winner.className = "record_info";
    winner.id = "winner";
    winner.innerHTML = "Winner: Andy";
    recordBorder.append(correctRate, totalPoints, eachRoundPoint, eachRoundTime, winner);
    recordTitle.append(recordBorder);

    const reply = document.createElement("div");
    reply.id = "reply";
    const replyTitle = document.createElement("div");
    replyTitle.id = "reply_title";
    replyTitle.innerHTML = "Reply: ";
    const replyItem = document.createElement("select");
    replyItem.id = "reply_item";
    const choiceRound = document.createElement("option");
    choiceRound.innerHTML = "Choose round";
    replyItem.append(choiceRound);
    for (let i = 0; i < 3; i++) {
        const round = document.createElement("option");
        round.innerHTML = `Round ${i + 1}`;
        replyItem.append(round);
    }
    const all = document.createElement("option");
    all.innerHTML = "ALL";
    replyItem.append(all);
    const submitButton = document.createElement("button");
    submitButton.id = "comfirm";
    submitButton.innerHTML = "Submit";
    reply.append(replyTitle, replyItem, submitButton);

    const choose = document.createElement("div");
    choose.id = "choose";
    const wrap = document.createElement("div");
    wrap.id = "wrap";
    const again = document.createElement("button");
    again.id = "again";
    again.innerHTML = "Again";
    const goodbye = document.createElement("button");
    goodbye.id = "goodbye";
    goodbye.innerHTML = "Goodbye";
    wrap.append(again, goodbye);
    choose.append(wrap);

    middle.append(status, goal, countdown, recordTitle, reply, choose);

    const container = document.querySelector("#container");
    container.insertBefore(middle, container.children[container.children.length - 1]);
}

export { updateRecord };
