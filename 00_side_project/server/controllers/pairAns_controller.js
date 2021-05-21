const { getMultiPairs } = require("../models/getPairNumber");

const pairAnsGenerator = async (req, res) => {
    const target = req.body.data.target;
    const pairsNumber = req.body.data.pairsNumber;
    const pairs = getMultiPairs(target, pairsNumber);
    res.send(pairs);
};

module.exports = {
    pairAnsGenerator
};
