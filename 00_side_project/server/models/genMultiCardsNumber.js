const { pool } = require("./mysqlcon");
const { getMultiPairs } = require("./getPairNumber");
const genMultiCardsNumber = (target, totalCards) => {
    const multiPairs = getMultiPairs(target);
    // console.log("multi pairs number: " + multiPairs.length);
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
    // console.log("===random pairs===");
    // console.log(randomPairs);

    const randomPairsArr = [];
    for (const i in randomPairs) {
        for (const j in randomPairs[i]) {
            randomPairsArr.push(randomPairs[i][j]);
        }
    }

    let remainNumberList;
    const isTargetEnoughforCountUnique = target > totalCards - randomPairsArr.length;
    if (isTargetEnoughforCountUnique) {
        remainNumberList = randomUnique(target, totalCards - randomPairsArr.length);
    } else {
        remainNumberList = randomNumber(target, totalCards - randomPairsArr.length);
    }

    for (const i in remainNumberList) {
        randomPairsArr.push(remainNumberList[i]);
    }
    // console.log("random pairs array");
    // console.log(randomPairsArr);
    // console.log(randomPairsArr.length);

    remainNumberList = randomUniqueforArrayIndex(totalCards, totalCards);

    const cardsObj = {};
    for (let i = 0; i < remainNumberList.length; i++) {
        cardsObj[i] = randomPairsArr[remainNumberList[i]];
    }
    return cardsObj;
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
