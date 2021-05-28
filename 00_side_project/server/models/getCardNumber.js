const { pool } = require("./mysqlcon");

const getCardNumber = async (gameID, room, round, cardID) => {
    const conn = await pool.getConnection();
    const sql = "SELECT number FROM cards_setting_info WHERE game_id = ? AND room_id = ? AND card_ID = ? AND round = ?";
    const inserts = [gameID, room, cardID, round];
    const result = await conn.query(sql, inserts);
    // console.log(pool.format(sql, inserts));
    // console.log(result[0][0].number);
    await conn.release();
    return result[0][0].number;
};

module.exports = {
    getCardNumber
};
