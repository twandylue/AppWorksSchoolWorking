const { pool } = require("./mysqlcon");

const updateNowRound = async (socket) => {
    let room;
    for (const i of socket.adapter.rooms.keys()) {
        if (i.length === 7) { // room名稱待改
            room = i;
        }
    }
    let sql = "SELECT * FROM round_count WHERE game_id = ?";
    const data = [room];
    const result = await pool.query(sql, [[data]]);
    // console.log("=======update round=============================");
    // console.log("old round: " + result[0][0].now_round);

    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");
        sql = "DELETE FROM round_count WHERE game_id = ?";
        const deleteInfo = await conn.query(sql, [[data]]);
        // console.log("delete info: ");
        // console.log(deleteInfo);
        // console.log("------end");

        sql = "INSERT INTO round_count (game_id, total_rounds, now_round) VALUES ?";
        const nextRound = result[0][0].now_round + 1;
        const newdata = [result[0][0].game_id, result[0][0].total_rounds, nextRound];
        const test2 = await conn.query(sql, [[newdata]]);
        // console.log(test2);
        // console.log("--------end");
        // console.log("next round: " + nextRound);
        await conn.query("COMMIT");
        console.log("new data: ");
        console.log(newdata);
        return nextRound;
    } catch (err) {
        await conn.query("ROLLBACK");
        return err;
    }
};

module.exports = {
    updateNowRound
};
