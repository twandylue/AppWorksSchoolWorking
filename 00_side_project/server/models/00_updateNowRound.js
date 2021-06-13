const { pool } = require("./mysqlcon");

const updateNowRound = async (socket, io) => {
    // let room;
    // for (const i of socket.adapter.rooms.keys()) {
    //     if (i.length === 7) { // room名稱待改
    //         room = i;
    //     }
    // }

    const room = [];
    for (const i of io.sockets.adapter.sids.get(socket.id)) { // room[1]: room
        room.push(i);
    }

    let sql = "SELECT * FROM round_count WHERE room_id = ?";
    const data = [room[1]];
    const result = await pool.query(sql, [[data]]);
    // console.log("=======update round=============================");
    // console.log("old round: " + result[0][0].now_round);

    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");
        sql = "DELETE FROM round_count WHERE room_id = ?";
        const deleteInfo = await conn.query(sql, [[data]]);
        // console.log("delete info: ");
        // console.log(deleteInfo);
        // console.log("------end");

        sql = "INSERT INTO round_count (room_id, total_rounds, now_round) VALUES ?";
        const nextRound = result[0][0].now_round + 1;
        const newdata = [result[0][0].room_id, result[0][0].total_rounds, nextRound];
        const test2 = await conn.query(sql, [[newdata]]);
        // console.log(test2);
        // console.log("--------end");
        // console.log("next round: " + nextRound);
        await conn.query("COMMIT");
        // console.log("new data: ");
        // console.log(newdata);
        return nextRound;
    } catch (err) {
        console.log(`error in updateNowRound: ${err}`);
        await conn.query("ROLLBACK");
        return err;
    }
};

module.exports = {
    updateNowRound
};
