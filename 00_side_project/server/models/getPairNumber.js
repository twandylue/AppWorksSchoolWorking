const { getFactors } = require("./getFactors"); // 注意非同步問題 因數分解需要時間

const getMultiPairs = (target) => { // target 必須為>1的正整數
    const factors = getFactors(target);
    const obj = count(factors);
    const obj2 = {};
    const arr = [];
    for (const i in obj) {
        const base = i;
        const numbers = [];
        for (let j = 0; j <= obj[i]; j++) {
            numbers.push(Math.pow(base, j));
        }
        obj2[base] = numbers; // 測試使用
        arr.push(numbers);
    }
    // console.log(obj2); // 看底數
    // console.log("arr: ");
    // console.log(arr); // 整理

    const results = [];
    function combination (curArr, combi) {
        const nextArr = arr.shift();
        // console.log("1: ");
        // console.log(combi);
        // console.log(curArr);
        // console.log(nextArr);
        // console.log(arr);
        // console.log("=========");

        for (let i = 0; i < curArr.length; i++) {
            let temp = [];
            temp = combi.map((element) => {
                return element;
            });
            temp.push(curArr[i]);

            if (nextArr) {
                // console.log("2: ");
                // console.log(temp);
                combination(nextArr, temp);
            } else {
                // console.log("3: ");
                // console.log(temp);
                // console.log("---------");
                results.push(temp);
            }
        }
        if (nextArr) {
            // console.log("nextArr: ");
            // console.log(nextArr);
            // console.log("arr if: ");
            // console.log(arr);
            arr.push(nextArr);
        }
    }
    combination(arr.shift(), []);
    // console.log("-------------");
    // console.log(arr);
    // console.log(results);
    // console.log(results.length);

    const pairs = [];
    for (let i = 0; i < parseInt(results.length); i++) {
        let pair1 = 1;
        for (const j in results[i]) {
            pair1 = pair1 * results[i][j];
        }
        const pair2 = target / pair1;
        // console.log([pair1, pair2]);
        pairs.push([pair1, pair2]);
    }

    return pairs;
};

function count (input) {
    const ans = {};
    for (let i = 0; i < input.length; i++) {
        if (ans[input[i]] >= 1) {
            ans[input[i]] += 1;
            continue;
        } else {
            ans[input[i]] = 1;
        }
    }
    return (ans);
}

module.exports = {
    getMultiPairs
};
