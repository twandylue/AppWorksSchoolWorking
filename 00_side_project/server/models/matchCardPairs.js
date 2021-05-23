const { getCardNumber } = require("./getCardNumber");

const matchCardNumberPairs = async (gameID, cardID, round, target) => {
    const number = await getCardNumber(gameID, cardID, round);
};

module.exports = {
    matchCardNumberPairs
};
