const { pool } = require("./mysqlcon");

const getRandomRules = async () => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT COUNT(*) FROM game_rules_random;");
    const totalRows = result[0][0]["COUNT(*)"];
    const randomNumber = Math.floor(Math.random() * totalRows);
    const row = await conn.query("SELECT * FROM game_rules_random WHERE id = ?", randomNumber);
    // console.log(row[0][0]);
    const rule = {
        type: row[0][0].type,
        card_number: row[0][0].card_number,
        rounds: row[0][0].rounds,
        targets: [row[0][0].target_1, row[0][0].target_2, row[0][0].target_3]
    };
    // console.log(info);
    return rule;
};

module.exports = {
    getRandomRules
};
