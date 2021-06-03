function cardGame (socket, gameID, round, target) { // 第一回合有選中 第二回合會出現問題
    // let hasEmitCheckMatch = false;
    let hasEmitedTwice = false;
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

            const countdownTime = document.querySelector("#countdown").innerHTML;
            const time = countdownTime.split(" ")[1];
            // const token = localStorage.getItem("access_token"); // 此時token裡面應該帶有 gameID roomID rules等資訊
            // const gameID = localStorage.getItem("gameID");
            const info = {
                source: socket.id,
                cardID: this.children[0].id,
                round: round,
                target: target,
                time: time,
                // token: token, // 此處待確認 可否不用帶著token在body中？
                gameID: gameID
            };

            if (!hasEmitedTwice) {
                if (secondCard) {
                    hasEmitedTwice = true;
                }
                socket.emit("click card", info);
            }
        }
    }

    socket.on("card number match", (cardMatchInfo) => {
        if (cardMatchInfo.selecterID === socket.id) { // fliped by local
            firstCard = cards[cardMatchInfo.cardIDs[0]];
            secondCard = cards[cardMatchInfo.cardIDs[1]];
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
            firstCard = cards[cardMatchInfo.cardIDs[0]]; // 指定element
            secondCard = cards[cardMatchInfo.cardIDs[1]];
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove("flip", "card-color");
                secondCard.classList.remove("flip", "card-color");
                [firstCard.children[0].innerHTML, secondCard.children[0].innerHTML] = ["", ""];
                resetBoard();
            }, 800);
        } else {
            opponentFirstCard = cards[cardMatchInfo.cardIDs[0]]; // 指定element
            opponentSecondCard = cards[cardMatchInfo.cardIDs[1]];
            setTimeout(() => {
                opponentFirstCard.classList.remove("flip", "card-color-opponent"); //
                opponentSecondCard.classList.remove("flip", "card-color-opponent"); //
                [opponentFirstCard.children[0].innerHTML, opponentSecondCard.children[0].innerHTML] = ["", ""];
                [opponentFirstCard, opponentSecondCard] = [null, null];
            }, 800);
        }
    });

    function resetBoard () {
        [firstCard, secondCard] = [null, null];
        [hasEmitedTwice, lockBoard] = [false, false];
    }

    cards.forEach(card => card.addEventListener("click", flipCard));
}

export { cardGame };
