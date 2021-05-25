const { pool } = require("./mysqlcon");

const getCardNumber = async (gameID, round, cardID) => {
    const sql = "SELECT number FROM cards_setting_info WHERE game_ID = ? AND card_ID = ? AND round = ?";
    const inserts = [gameID, cardID, round];
    const result = await pool.query(sql, inserts);
    // console.log(result[0][0].number);
    return result[0][0].number;
};

module.exports = {
    getCardNumber
};
