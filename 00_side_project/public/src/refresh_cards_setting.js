// refresh cards setting for next found
function refreshCardsSetting (round, number, target, state, cardsSetting) {
    const status = document.querySelector("#status");
    status.innerHTML = `Round ${round} Ready`;
    const goal = document.querySelector("#goal");
    goal.innerHTML = `Target: card1 x card2 = ${target}`;

    const cardFrontFaces = document.querySelectorAll(".front-face");
    const cardBackFaces = document.querySelectorAll(".back-face");
    for (let i = 0; i < cardFrontFaces.length; i++) {
        cardFrontFaces[i].innerHTML = `${cardsSetting[i]}`;
        if (state === "in ready") {
            cardFrontFaces[i].classList.remove("front-face_start");
            cardBackFaces[i].classList.add("back-face_ready");
        }
    }
}

export { refreshCardsSetting };
