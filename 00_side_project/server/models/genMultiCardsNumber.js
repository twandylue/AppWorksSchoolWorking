const { getMultiPairs } = require("./getPairNumber");
const genMultiCardsNumber = (target, totalCards) => {
    const multiPairs = getMultiPairs(target);
    // console.log("multi pairs number: " + multiPairs.length);
    const isGenPiarsEnough = multiPairs.length >= totalCards / 2;
    const randomPairs = [];
    // const isGenPiarsEnough = parseInt(multiPairs.length / 2) + 1 >= totalCards / 4;
    let randomUniqueList;
    let randomList;
    if (isGenPiarsEnough) {
        randomUniqueList = randomUniqueforArrayIndex(multiPairs.length, totalCards / 2);
        for (const i in randomUniqueList) {
            randomPairs.push(multiPairs[randomUniqueList[i]]);
        }
    } else {
        randomList = randomNumberforArrayIndex(multiPairs.length, totalCards / 2);
        for (const i in randomList) {
            randomPairs.push(multiPairs[randomList[i]]);
        }
    }

    // const randomPairs = [];
    // for (const i in randomUniqueList) {
    //     randomPairs.push(multiPairs[randomUniqueList[i]]);
    // }
    // console.log("===random pairs===");
    // console.log(randomPairs);

    const randomPairsArr = [];
    for (const i in randomPairs) {
        for (const j in randomPairs[i]) {
            randomPairsArr.push(randomPairs[i][j]);
        }
    }
    // console.log(randomPairsArr);

    // 取有數量限制的卡片對
    // let remainNumberList;
    // const isTargetEnoughforCountUnique = target > totalCards - randomPairsArr.length;
    // if (isTargetEnoughforCountUnique) {
    //     remainNumberList = randomUnique(target, totalCards - randomPairsArr.length);
    // } else {
    //     remainNumberList = randomNumber(target, totalCards - randomPairsArr.length);
    // }

    // for (const i in remainNumberList) {
    //     randomPairsArr.push(remainNumberList[i]);
    // }
    // console.log("random pairs array");
    // console.log(randomPairsArr);
    // console.log(randomPairsArr.length);

    const remainNumberList = randomUniqueforArrayIndex(totalCards, totalCards);

    // const cardsObj = {};
    // for (let i = 0; i < remainNumberList.length; i++) {
    //     cardsObj[i] = randomPairsArr[remainNumberList[i]];
    // }

    const cardsObj = {};
    for (let i = 0; i < remainNumberList.length; i++) {
        cardsObj[i] = randomPairsArr[remainNumberList[i]];
    }
    // console.log(cardsObj);
    return cardsObj;
};

const randomNumber = (range, count) => { // 不含0
    const randomNumberArr = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * range) + 1;
        randomNumberArr.push(randomNumber);
    }
    return randomNumberArr;
};

const randomNumberforArrayIndex = (range, count) => { // 0
    const randomNumberArr = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * range);
        randomNumberArr.push(randomNumber);
    }
    return randomNumberArr;
};

const randomUnique = (range, count) => { // 不含0
    if (range < count) {
        return null;
    }
    const nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range) + 1);
    }
    return [...nums];
};

const randomUniqueforArrayIndex = (range, count) => { // 包含0
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
