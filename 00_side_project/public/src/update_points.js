function updatePoints () {
    const choiceButtons = document.querySelectorAll(".choice_button");
    for (let i = 0; i < choiceButtons.length; i++) {
        choiceButtons[i].remove();
    }

    const pics = document.querySelector("#paper_scissor_stone");
    pics.remove();

    const userPoints = document.createElement("div");
    userPoints.id = "user_points";
    userPoints.className = "points";
    userPoints.innerHTML = "Points: 123"; // wait for server
    const oppositeUserPoints = document.createElement("div");
    oppositeUserPoints.id = "user_points";
    oppositeUserPoints.className = "points";
    oppositeUserPoints.innerHTML = "Points: 321"; // wait for server
    const left = document.querySelector("#left");
    left.append(userPoints);
    const right = document.querySelector("#right");
    // right.insertBefore(oppositeUserPoints, right.childNodes[6]);
    right.insertBefore(oppositeUserPoints, right.children[right.children.length - 1]);
}

export { updatePoints };
