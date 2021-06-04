const { pool } = require("../models/mysqlcon");

const getGameRules = async (socket, io) => {
    const room = [];
    for (const i of io.sockets.adapter.sids.get(socket.id)) { // room[1]: room
        room.push(i);
    }

    const sql = "SELECT * FROM game_setting_info WHERE room_id = ?";
    const result = await pool.query(sql, room[1]);
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
