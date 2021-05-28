const { pool } = require("./mysqlcon");

const joinRoom = async (roomID, email) => {
    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");
        let sql = "UPDATE lobby_table SET player = player + 1 WHERE room_id = ?";
        let insert = roomID;
        await conn.query(sql, insert);

        sql = "SELECT room_id, player, player_limit, watcher FROM lobby_table WHERE room_id = ?;";
        insert = roomID;
        const result = await conn.query(sql, [insert]);
        // console.log(result[0][0]);
        if (result[0][0].player > result[0][0].player_limit) { // 房間數超過上限時
            const err = new Error("too many people");
            throw (err);
        }
        sql = "INSERT INTO room (room_id, email, count) VALUES ?;";
        insert = [roomID, email, 1];
        await conn.query(sql, [[insert]]);
        await conn.query("COMMIT");
        return true;
    } catch (err) {
        console.log(err);
        await conn.query("ROLLBACK");
        return false;
    } finally {
        await conn.release();
    }
};

const leaveRoom = async (email) => {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query("SELECT room_id, count FROM room WHERE email = ?", email);
        if (result[0].length === 0) {
            console.log("not in any room");
            return (false);
        }
        // console.log("===========");
        // console.log(result[0][0]);
        if (result[0][0].count <= 1) {
            console.log(email + " 第一次斷線 不算離開房間");
            const result = await conn.query("UPDATE room SET count = count + 1 WHERE email = ?", email);
            return (false);
        }

        const roomID = result[0][0].room_id;
        await conn.query("START TRANSACTION");
        await conn.query("UPDATE lobby_table SET player = player - 1 WHERE room_id = ?", roomID);
        await conn.query("DELETE FROM room WHERE email = ?;", email);

        await conn.query("COMMIT");
        console.log(email + " 第一次之後的斷線 算離開房間");
        return (roomID);
    } catch (err) {
        console.log(err);
        await conn.query("ROLLBACK");
    } finally {
        await conn.release();
    }
};

const watchJoinRoom = async (roomID) => {
    const sql = "UPDATE lobby_table SET watch = watch + 1 WHERE room_id = ?";
    const insert = roomID;
    await pool.query(sql, insert);
};

const watchLeaveRoom = async (roomID) => {
    const sql = "UPDATE lobby_table SET watch = watch - 1 WHERE room_id = ?";
    const insert = roomID;
    await pool.query(sql, insert);
};

const findRoom = async (email) => {
    const conn = await pool.getConnection();
    const sql = "SELECT room.room_id, room.email, user.name FROM room INNER JOIN user ON room.email = user.email WHERE room.email = ?;";
    const insert = [[email]];
    const result = await conn.query(sql, insert);
    // console.log(result[0]);
    await conn.release();
    if (result.length !== 0) {
        return result[0];
    } else {
        return false;
    }
};

const findRoonMember = async (roomID) => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT user.name, room.email FROM room INNER JOIN user ON room.email = user.email WHERE room_id = ?", roomID);
    await conn.release();
    return (result[0]);
};

const getRoomLobbyInfo = async () => {
    const conn = await pool.getConnection();
    const sql = "SELECT room_id, player, player_limit, watcher FROM lobby_table;";
    const results = await conn.query(sql);
    await conn.release();
    return results[0];
};

module.exports = {
    joinRoom,
    leaveRoom,
    watchJoinRoom,
    watchLeaveRoom,
    findRoom,
    findRoonMember,
    getRoomLobbyInfo
};
