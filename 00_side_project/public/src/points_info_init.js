function initPointsInfo () {
    // const choiceButtons = document.querySelectorAll(".choice_button");
    // for (let i = 0; i < choiceButtons.length; i++) {
    //     choiceButtons[i].remove();
    // }

    const userPoints = document.createElement("div");
    userPoints.id = "player_points";
    userPoints.className = "points";
    userPoints.innerHTML = "得分: 0"; // wait for server
    const oppositeUserPoints = document.createElement("div");
    oppositeUserPoints.id = "oppo_player_points"; // oppo_user_points
    oppositeUserPoints.className = "points";
    oppositeUserPoints.innerHTML = "對手得分: 0"; // wait for server
    const left = document.querySelector("#left");
    left.append(userPoints);
    const right = document.querySelector("#right");
    // right.insertBefore(oppositeUserPoints, right.childNodes[6]);
    // right.insertBefore(oppositeUserPoints, right.children[right.children.length - 1]);
    right.append(oppositeUserPoints);
}

export { initPointsInfo };
