const { pool } = require("./mysqlcon");

async function recordEveryStep (info) {
    const sql = "INSERT INTO game_history (game_ID, round, player_ID, card_ID, number, points, time, uts_order) VALUES ?";
    const inserts = [info.gameID, info.round, info.source, info.cardID, info.number, info.addPoints, info.time, info.utsOrder];
    // console.log(pool.format(sql, [[inserts]]));
    const result = await pool.query(sql, [[inserts]]);
}

module.exports = {
    recordEveryStep
};
