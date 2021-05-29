const { pool } = require("../models/mysqlcon");

const saveGameRules = async (room, email, rules) => {
    const conn = await pool.getConnection();
    const data = [room, email, rules.type, rules.number, rules.rounds];
    for (let i = 0; i < 3; i++) {
        data.push(rules.targets[i]);
    }
    data.push(0, 0); // init ready_number and again_number
    const sql = "INSERT INTO game_setting_info (room_id, rule_setter, type, number, rounds, targets_1, targets_2, targets_3, ready_number, again_number) VALUES ?";
    const result = await conn.query(sql, [[data]]);
    // console.log(result[0].insertId);
    await conn.release();
    return (result[0].insertId);
};

module.exports = {
    saveGameRules
};
