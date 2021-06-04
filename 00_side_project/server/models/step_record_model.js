const { pool } = require("./mysqlcon");

async function recordEveryStep (info) {
    const conn = await pool.getConnection();
    try {
        const sql = "INSERT INTO game_history (game_id, room_id, round, player_ID, player_email, card_ID, number, points, time, uts_order, status) VALUES ?";
        const inserts = [info.gameID, info.room, info.round, info.source, info.email, info.cardID, info.number, info.addPoints, info.time, info.utsOrder, info.status];
        await conn.query(sql, [[inserts]]);
    } catch (err) {
        console.log(err);
    } finally {
        await conn.release();
    }
}

module.exports = {
    recordEveryStep
};
