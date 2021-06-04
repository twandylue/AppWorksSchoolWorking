const { pool } = require("./mysqlcon");

const saveCardsSetting = async (gameID, room, cardsSetting, round) => {
    const cardIds = Object.keys(cardsSetting);
    const data = [];
    for (const id in cardIds) {
        data.push([gameID, room, round, id, cardsSetting[id]]);
    }
    const conn = await pool.getConnection();
    const sql = "INSERT INTO cards_setting_info (game_id, room_id, round, card_ID, number) VALUES ?";
    await conn.query(sql, [data]);
    await conn.release();
};

module.exports = {
    saveCardsSetting
};
