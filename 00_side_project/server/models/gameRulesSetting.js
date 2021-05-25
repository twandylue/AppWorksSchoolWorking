const { pool } = require("../models/mysqlcon");

const setGameRules = async (rules, socket) => {
    const socketId = socket.id;
    let room;
    for (const i of socket.adapter.rooms.keys()) {
        if (i.length === 7) { // room名稱待改
            room = i;
        }
    }
    // console.log("room: " + room);
    const data = [room, socketId, rules.type, rules.number, rules.rounds];
    for (let i = 0; i < 3; i++) {
        data.push(rules.targets[i]);
    }
    let sql = "INSERT INTO game_setting_info (game_ID, rule_setter, type, number, rounds, targets_1, targets_2, targets_3) VALUES ?";
    pool.query(sql, [[data]]);

    const roundCountInfo = [room, rules.rounds, 1];
    sql = "INSERT INTO round_count (game_ID, total_rounds, now_round) VALUES ?";
    pool.query(sql, [[roundCountInfo]]);
};

module.exports = {
    setGameRules
};
