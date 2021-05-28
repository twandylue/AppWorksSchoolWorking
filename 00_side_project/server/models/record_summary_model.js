const { pool } = require("./mysqlcon");

async function sumRecord (gameID, room, socket, rounds) {
    const results = [];
    const IDs = [];
    for (const i of socket.adapter.sids.keys()) {
        IDs.push(i);
    }
    for (const i in IDs) {
        const sql = "SELECT room_id, player_ID, round, SUM(points), COUNT(*) FROM game_history WHERE player_ID = ? AND room_id = ? GROUP BY round;";
        const result = await pool.query(sql, [IDs[i], room]);
        let totalPoints = 0;
        let totalClick = 0;

        const roundsPointsMap = new Map();
        for (const i in result[0]) {
            roundsPointsMap.set(result[0][i].round - 1, parseInt(result[0][i]["SUM(points)"]));
            totalPoints += parseInt(result[0][i]["SUM(points)"]);
            totalClick += parseInt(result[0][i]["COUNT(*)"]);
        }
        const roundsPoints = [];
        for (let i = 0; i < rounds; i++) {
            if (roundsPointsMap.has(i)) {
                roundsPoints[i] = roundsPointsMap.get(i);
            } else {
                roundsPoints[i] = 0;
            }
        }

        // 統計命中率 hit rate
        let hitRate;
        if (totalClick !== 0) {
            hitRate = (totalPoints * 2 / 10) / totalClick;
        } else {
            hitRate = 0;
        }

        results.push({ playerID: IDs[i], hitRate: hitRate, roundsPoints: roundsPoints, totalPoints: totalPoints });
    }

    const arrResults = results.map((ele) => {
        return ele;
    });
    for (let i = 0; i < arrResults.length; i++) {
        for (let j = 0; j < arrResults.length - 1; j++) {
            if (arrResults[j].totalPoints > arrResults[j + 1].totalPoints) {
                const temp = arrResults[j];
                arrResults[j] = arrResults[j + 1];
                arrResults[j + 1] = temp;
            }
        }
    }

    const winner = [];
    if (arrResults[0].totalPoints === arrResults[1].totalPoints) {
        winner.push(arrResults[0].playerID, arrResults[1].playerID);
    } else {
        winner.push(arrResults[1].playerID);
    }
    return ({ results: results, winner: winner });
}

module.exports = {
    sumRecord
};
