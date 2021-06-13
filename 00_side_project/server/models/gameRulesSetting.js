const { pool } = require("../models/mysqlcon");

const saveGameRules = async (room, members, rules) => {
    const conn = await pool.getConnection();
    const data = [room, rules.type, rules.number, rules.rounds];
    for (let i = 0; i < 3; i++) {
        data.push(rules.targets[i]);
    }
    data.push(0, 0); // init ready_number and again_number
    data.push(members[0].email, members[1].email); // players in the game
    const sql = "INSERT INTO game_setting_info (room_id, type, number, rounds, targets_1, targets_2, targets_3, ready_number, again_number, player_1, player_2) VALUES ?";

    const result = await conn.query(sql, [[data]]);
    await conn.release();
    return (result[0].insertId);
};

module.exports = {
    saveGameRules
};
