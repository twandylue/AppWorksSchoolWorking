const { pool } = require("./mysqlcon");
const roomModule = require("./Room_model");

async function statRecord (gameID, roomID, rounds) {
    const conn = await pool.getConnection();

    const roomMembers = await roomModule.findRoonMember(roomID); // 前方已可知道roomber 此處不需要再await一次 待改
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
    await conn.query("INSERT INTO game_results (game_id, player_email, round1_points, round2_points, round3_points, total_points, hit_rate, winner_email) VALUES ?", [inserts]);
    await conn.release();

    console.log("record summry: ");
    console.log({ results: stat, winner: winner });
    return ({ results: stat, winner: winner });
}

async function statRecordSingle (gameID, roomID, rounds, members) {
    const conn = await pool.getConnection();
    try {
        const emailtoNameObj = {};
        for (const i in members) {
            emailtoNameObj[members[i].email] = members[i].name;
        }

        const stat = [];
        const winner = [];
        for (const i in members) { // gameID and player_email
            const resultTest = await conn.query("SELECT player_ID, player_email, round, SUM(points), COUNT(*) FROM game_history WHERE game_id = ? AND player_email = ? GROUP BY round;", [gameID, members[i].email]);
            console.log(pool.format("SELECT player_ID, player_email, round, SUM(points), COUNT(*) FROM game_history WHERE game_id = ? AND player_email = ? GROUP BY round;", [gameID, members[i].email]));
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

                stat.push({ player_email: members[i].email, hitRate: hitRate, roundsPoints: roundsPoints, totalPoints: totalPoints });
                // console.log("===has history==");
            } else {
                const hitRate = 0;
                const roundsPoints = [];
                const totalPoints = 0;
                for (let i = 0; i < rounds; i++) {
                    roundsPoints.push(0);
                }
                stat.push({ player_email: members[i].email, hitRate: hitRate, roundsPoints: roundsPoints, totalPoints: totalPoints });
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
        await conn.query("INSERT INTO game_results (game_id, player_email, round1_points, round2_points, round3_points, total_points, hit_rate, winner_email) VALUES ?", [inserts]);
        await conn.release();

        console.log("record summry: ");
        console.log({ results: stat, winner: winner });
        return ({ results: stat, winner: winner });
    } catch (err) {
        console.log(err);
    } finally {
        await conn.release();
    }
}

module.exports = {
    statRecord,
    statRecordSingle
};
