const { pool } = require("./mysqlcon");
const { getMultiPairs } = require("./getPairNumber");
const genMultiCardsNumber = (rounds, targets, totalCards) => {
    const cardsObjs = [];
    for (const i in targets) {
        const multiPairs = getMultiPairs(targets[i]);
        console.log("multi pairs number: " + multiPairs.length);
        const isGenPiarsEnough = parseInt(multiPairs.length / 2) + 1 >= totalCards / 4;
        let randomUniqueList;
        if (isGenPiarsEnough) {
            randomUniqueList = randomUniqueforArrayIndex(parseInt(multiPairs.length / 2) + 1, totalCards / 4);
        } else {
            randomUniqueList = randomUniqueforArrayIndex(parseInt(multiPairs.length / 2) + 1, parseInt(multiPairs.length / 2) + 1);
        }

        const randomPairs = [];
        for (const i in randomUniqueList) {
            randomPairs.push(multiPairs[randomUniqueList[i]]);
        }
        console.log("===random pairs===");
        console.log(randomPairs);

        const randomPairsArr = [];
        for (const i in randomPairs) {
            for (const j in randomPairs[i]) {
                randomPairsArr.push(randomPairs[i][j]);
            }
        }

        let remainNumberList;
        const isTargetEnoughforCountUnique = targets[i] > totalCards - randomPairsArr.length;
        if (isTargetEnoughforCountUnique) {
            remainNumberList = randomUnique(targets[i], totalCards - randomPairsArr.length);
        } else {
            remainNumberList = randomNumber(targets[i], totalCards - randomPairsArr.length);
        }

        for (const i in remainNumberList) {
            randomPairsArr.push(remainNumberList[i]);
        }
        console.log("random pairs array");
        console.log(randomPairsArr);
        console.log(randomPairsArr.length);

        remainNumberList = randomUniqueforArrayIndex(totalCards, totalCards);

        const cardsObj = {};
        for (let i = 0; i < remainNumberList.length; i++) {
            cardsObj[i] = randomPairsArr[remainNumberList[i]];
        }
        cardsObjs.push({
            round: parseInt(i) + 1,
            cardsObj
        });
    }

    return cardsObjs;
};

const randomNumber = (range, count) => {
    const randomNumberArr = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * range) + 1;
        randomNumberArr.push(randomNumber);
    }
    return randomNumberArr;
};

const randomUnique = (range, count) => {
    if (range < count) {
        return null;
    }
    const nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range) + 1);
    }
    return [...nums];
};

const randomUniqueforArrayIndex = (range, count) => {
    if (range < count) {
        return null;
    }
    const nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range));
    }
    return [...nums];
};

module.exports = {
    genMultiCardsNumber
};
