const { pool } = require("./mysqlcon");

async function recordEveryStep (info) {
    const sql = "INSERT INTO game_history (game_id, room_id, round, player_ID, player_email, card_ID, number, points, time, uts_order) VALUES ?";
    const inserts = [info.gameID, info.room, info.round, info.source, info.email, info.cardID, info.number, info.addPoints, info.time, info.utsOrder];
    // console.log(pool.format(sql, [[inserts]]));
    const result = await pool.query(sql, [[inserts]]);
}

module.exports = {
    recordEveryStep
};
