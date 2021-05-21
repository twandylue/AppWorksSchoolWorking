function cardGame (socket) {
    let isFlippedOpponent = false;
    socket.on("opposite click card", (cardId) => {
        const cards = document.querySelectorAll(".memory-card");
        isFlippedOpponent = true;
        cards[cardId].click(); // cardId為卡片順序 從左上開始
        isFlippedOpponent = false;
    });

    const cards = document.querySelectorAll(".memory-card");

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let opponentFirstCard, opponentSecondCard;

    function flipCard () {
        if (isFlippedOpponent) {
            console.log("from opponent: " + this.children[0].id);
            if (!opponentFirstCard) {
                console.log("Opponent: fisrt");
                opponentFirstCard = this;
                this.classList.add("flip", "card-color-opponent");
            } else {
                console.log("Opponent: second");
                opponentSecondCard = this;
                this.classList.add("flip", "card-color-opponent");
                unflipCards();
            }
            return;
        } else if (!lockBoard && firstCard !== this) {
            socket.emit("click card", this.children[0].id);
        }

        if (lockBoard) return;
        if (this === firstCard) return;
        this.classList.add("flip", "card-color");

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch () {
        // do cards match?
        const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards () {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
    }

    function unflipCards () {
        if (isFlippedOpponent) {
            setTimeout(() => {
                console.log("Opponent: unflipCards");
                opponentFirstCard.classList.remove("flip", "card-color-opponent");
                opponentSecondCard.classList.remove("flip", "card-color-opponent");
                [opponentFirstCard, opponentSecondCard] = [null, null];
            }, 6000);
            return;
        }

        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flip", "card-color");
            secondCard.classList.remove("flip", "card-color");
            lockBoard = false;
            resetBoard();
        }, 6000);
    }

    function resetBoard () {
        [firstCard, secondCard] = [null, null];
        [hasFlippedCard, lockBoard] = [false, false];
    }

    cards.forEach(card => card.addEventListener("click", flipCard));
}

export { cardGame };
