function cardGame (socket, round, target) {
    let hasEmitCheckMatch = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let opponentFirstCard, opponentSecondCard;
    const cards = document.querySelectorAll(".memory-card");

    socket.on("opposite click card", (oppoInfo) => {
        cards[oppoInfo.cardID].classList.add("flip", "card-color-opponent");
        if (!opponentFirstCard) {
            opponentFirstCard = cards[oppoInfo.cardID];
        } else {
            opponentSecondCard = cards[oppoInfo.cardID];
        }
    });

    function flipCard () {
        if (!lockBoard && this !== firstCard) {
            if (this === opponentFirstCard || this === opponentSecondCard) { // can't flip cards which are already flipped by oppo
                return;
            }

            this.classList.add("flip", "card-color"); // card flipped by local
            if (!firstCard) {
                firstCard = this; // first flipped card
            } else {
                secondCard = this;
                lockBoard = true; // be able to flip only two card
            }
            const info = {
                source: socket.id,
                cardID: this.children[0].id,
                round: round,
                target: target
            };
            socket.emit("click card", info);

            if (secondCard && !hasEmitCheckMatch) {
                const checkMatchInfo = {
                    source: socket.id,
                    number1: [firstCard.children[0].id, firstCard.children[0].innerHTML],
                    number2: [secondCard.children[0].id, secondCard.children[0].innerHTML],
                    round: round,
                    target: target
                };
                socket.emit("ckeck match", checkMatchInfo); // check if match
                hasEmitCheckMatch = true;
            }
        }
    }

    socket.on("card number match", (cardMatchInfo) => {
        if (cardMatchInfo.selecterID === socket.id) { // fliped by local
            firstCard.removeEventListener("click", flipCard);
            secondCard.removeEventListener("click", flipCard);
            resetBoard();
        } else { // filped by oppo
            opponentFirstCard.removeEventListener("click", flipCard);
            opponentSecondCard.removeEventListener("click", flipCard);
            [opponentFirstCard, opponentSecondCard] = [null, null];
        }
    });

    socket.on("card number not match", (cardMatchInfo) => {
        // console.log("=====================SELECTER ID: " + cardMatchInfo.selecterID);
        // console.log("=====================LOCAL ID: " + socket.id);

        if (cardMatchInfo.selecterID === socket.id) {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove("flip", "card-color");
                secondCard.classList.remove("flip", "card-color");
                [firstCard.children[0].innerHTML, secondCard.children[0].innerHTML] = ["", ""];
                resetBoard();
            }, 800);
        } else {
            setTimeout(() => {
                opponentFirstCard.classList.remove("flip", "card-color-opponent");
                opponentSecondCard.classList.remove("flip", "card-color-opponent");
                [opponentFirstCard.children[0].innerHTML, opponentSecondCard.children[0].innerHTML] = ["", ""];
                [opponentFirstCard, opponentSecondCard] = [null, null];
            }, 800);
        }
    });

    function resetBoard () {
        [firstCard, secondCard] = [null, null];
        [hasEmitCheckMatch, lockBoard] = [false, false];
    }

    cards.forEach(card => card.addEventListener("click", flipCard));
}

export { cardGame };
