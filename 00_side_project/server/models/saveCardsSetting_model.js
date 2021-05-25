const { pool } = require("./mysqlcon");

const saveCardsSetting = async (cardsSetting, socket, round) => {
    let room;
    for (const i of socket.adapter.rooms.keys()) {
        if (i.length === 7) { // room名稱待改
            room = i;
        }
    }

    const cardIds = Object.keys(cardsSetting);
    const data = [];
    for (const id in cardIds) {
        data.push([room, round, id, cardsSetting[id]]);
    }
    // console.log(data);
    const sql = "INSERT INTO cards_setting_info (game_ID, round, card_ID, number) VALUES ?";
    const result = await pool.query(sql, [data]);
    // console.log(result);
};

// const saveCardsSetting = async (cardsSetting, room, round) => {
//     const cardIds = Object.keys(cardsSetting);
//     const data = [];
//     for (const id in cardIds) {
//         data.push([room, round, id, cardsSetting[id]]);
//     }
//     console.log(data);
//     const sql = "INSERT INTO cards_setting_info (game_ID, round, card_ID, number) VALUES ?";
//     const result = await pool.query(sql, [data]);
//     // console.log(result)
// };

module.exports = {
    saveCardsSetting
};
