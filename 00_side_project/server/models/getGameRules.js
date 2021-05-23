const { pool } = require("../models/mysqlcon");

const getGameRules = async (socket) => {
    let room;
    for (const i of socket.adapter.rooms.keys()) {
        if (i.length === 7) { // room名稱待改
            room = i;
        }
    }
    const sql = "SELECT * FROM game_setting_info WHERE game_id = ?";
    const result = await pool.query(sql, room);
    const rawTargets = [result[0][0].targets_1, result[0][0].targets_2, result[0][0].targets_3];
    const targets = [];
    for (const i in rawTargets) {
        if (rawTargets[i] !== null) {
            targets.push(rawTargets[i]);
        }
    }

    const rules = {
        type: result[0][0].type,
        number: result[0][0].number,
        rounds: result[0][0].rounds,
        targets: targets
    };

    return (rules);
};

module.exports = {
    getGameRules
};
