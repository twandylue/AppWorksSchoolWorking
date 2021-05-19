const { pool } = require("../models/mysqlcon");

const setGameRules = async (rules, socket) => {
    const socketId = socket.id;
    let room;
    for (const i of socket.adapter.rooms.keys()) {
        if (i.length === 5) {
            room = i;
        }
    }
    console.log("room: " + room);
    const data = [room, socketId, rules.type, rules.number, rules.rounds];
    for (let i = 0; i < 3; i++) {
        data.push(rules.targets[i]);
    }
    const sql = "INSERT INTO game_setting_info (game_id, rule_setter, type, number, rounds, targets_1, targets_2, targets_3) VALUES ?";
    pool.query(sql, [[data]]);
};

module.exports = {
    setGameRules
};
