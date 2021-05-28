const { pool } = require("./mysqlcon");

async function recordEveryRound (gameID, socket, round) {
    // console.log("========round over=========");
    // console.log("game ID: " + gameID);
    const IDs = [];
    for (const i of socket.adapter.sids.keys()) {
        IDs.push(i);
    }
    // console.log(IDs);
    // console.log("round: " + round);
    for (const i in IDs) {
        const sql = "SELECT player_email, SUM(points) FROM game_history GROUP BY roundSELECT player_email, round, SUM(points) FROM game_history WHERE player_email = ? GROUP BY round;";
        // const sql = "SELECT player_email, round, SUM(points) FROM  WHERE player_email = ? AND round = ? GROUP BY round";
        // console.log(pool.format(sql, [IDs[i]]));
        await pool.query(sql, [IDs[i]]);
    }
}

module.exports = {
    recordEveryRound
};
