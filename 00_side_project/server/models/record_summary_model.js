const { pool } = require("./mysqlcon");
const roomModule = require("./Room_model");

async function sumRecord (gameID, room, socket, rounds) {
    const results = [];
    const IDs = []; // 此處要改 改成用email
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

    console.log(arrResults);

    const winner = [];
    if (arrResults[0].totalPoints === arrResults[1].totalPoints) {
        winner.push(arrResults[0].playerID, arrResults[1].playerID);
    } else {
        winner.push(arrResults[1].playerID);
    }
    console.log({ results: results, winner: winner });
    return ({ results: results, winner: winner });
}

async function statRecord (gameID, roomID, rounds) {
    const conn = await pool.getConnection();

    const roomMembers = await roomModule.findRoonMember(roomID);
    const members = [];
    for (const i in roomMembers) {
        members.push(roomMembers[i].email);
    };

    // const members = ["test@email.com", "amy@gmail.com"]; // 測試使用

    const names = await conn.query("SELECT email, name FROM user WHERE email in ?", [[members]]);
    const emailtoNameObj = {};
    for (const i in names[0]) {
        emailtoNameObj[names[0][i].email] = names[0][i].name;
    }
    // console.log(emailtoNameObj);

    const stat = [];
    const winner = [];
    for (const i in members) { // gameID and player_email
        const resultTest = await conn.query("SELECT player_ID, player_email, round, SUM(points), COUNT(*) FROM game_history WHERE game_id = ? AND player_email = ? GROUP BY round;", [gameID, members[i]]);
        // console.log(resultTest[0]);
        if (resultTest[0].length !== 0) { // 有點擊記錄
            let totalPoints = 0;
            let totalClick = 0;
            const roundsPoints = [];
            for (let i = 0; i < rounds; i++) {
                if (resultTest[0][i]) {
                    roundsPoints.push(parseInt(resultTest[0][i]["SUM(points)"]));
                    totalPoints += parseInt(resultTest[0][i]["SUM(points)"]);
                    totalClick += parseInt(resultTest[0][i]["COUNT(*)"]);
                    continue;
                }
                roundsPoints.push(0);
            }

            // 統計命中率 hit rate
            let hitRate;
            if (totalClick !== 0) {
                hitRate = (totalPoints * 2 / 10) / totalClick;
            } else {
                hitRate = 0;
            }

            stat.push({ player_email: members[i], hitRate: hitRate, roundsPoints: roundsPoints, totalPoints: totalPoints });
            // console.log("===has history==");
        } else {
            const hitRate = 0;
            const roundsPoints = [];
            const totalPoints = 0;
            for (let i = 0; i < rounds; i++) {
                roundsPoints.push(0);
            }
            stat.push({ player_email: members[i], hitRate: hitRate, roundsPoints: roundsPoints, totalPoints: totalPoints });
            // console.log("===no history==");
        }
    }
    // console.log(stat);

    if (stat[0].totalPoints > stat[1].totalPoints) {
        winner.push({ email: stat[0].player_email, name: emailtoNameObj[stat[0].player_email] });
    } else if (stat[0].totalPoints < stat[1].totalPoints) {
        winner.push({ email: stat[1].player_email, name: emailtoNameObj[stat[1].player_email] });
    } else {
        winner.push({ eamil: "Tie", name: "Tie" });
    }

    const inserts = [];
    for (const i in stat) {
        inserts.push([gameID, stat[i].player_email, stat[i].roundsPoints[0], stat[i].roundsPoints[1], stat[i].roundsPoints[2], stat[i].totalPoints, stat[i].hitRate, winner[0].email]);
    }
    // console.log(pool.format("INSERT INTO game_results (game_id, player_email, round1_points, round2_points, round3_points, total_points, hit_rate, winner_email) VALUES ?", [inserts]));
    await conn.query("INSERT INTO game_results (game_id, player_email, round1_points, round2_points, round3_points, total_points, hit_rate, winner_email) VALUES ?", [inserts]);
    await conn.release();

    console.log("record summry: ");
    console.log({ results: stat, winner: winner });
    return ({ results: stat, winner: winner });
}

module.exports = {
    sumRecord,
    statRecord
};
