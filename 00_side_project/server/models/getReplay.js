const { pool } = require("./mysqlcon");

const getReplay = async (gameID) => {
    const conn = await pool.getConnection();
    try {
        let stepHis, members, rules, cardsSetting, gameStat;
        const status = await conn.query("SELECT status FROM game_history WHERE game_id = ?", gameID);
        if (status[0][0].status === 1) { // 或許只提供真人對戰重播 待改
            stepHis = await conn.query("SELECT game_setting_info.type, game_setting_info.number AS cards_number, game_history.game_id, game_history.room_id, game_history.round, game_history.player_email, game_history.card_ID, game_history.number, game_history.points, game_history.time, game_history.uts_order FROM game_history INNER JOIN game_setting_info ON game_setting_info.id = game_history.game_id WHERE game_id = ? ORDER BY uts_order ASC", [gameID]);
        } else {
            rules = await conn.query("SELECT room_id, type, number, rounds, targets_1, targets_2, targets_3 FROM game_setting_info WHERE id = ?;", [gameID]);
            members = await conn.query("SELECT user.name, game_history.player_email FROM game_history INNER JOIN user ON user.email = game_history.player_email WHERE game_history.game_id = ? GROUP by game_history.player_email;", gameID);
            stepHis = await conn.query("SELECT user.name, game_setting_info.type, game_setting_info.number AS cards_number, game_history.game_id, game_history.room_id, game_history.round, game_history.player_email, game_history.card_ID, game_history.number, game_history.points, game_history.time, game_history.uts_order FROM game_history INNER JOIN user ON user.email = game_history.player_email INNER JOIN game_setting_info ON game_setting_info.id = game_history.game_id WHERE game_id = ? ORDER BY uts_order ASC", [gameID]);
            cardsSetting = await conn.query("SELECT game_id, room_id, round, card_ID, number, selecter FROM cards_setting_info WHERE game_id = ?", [gameID]);
            gameStat = await conn.query("SELECT user.name AS winnerName, game_results.game_id, game_results.player_email, game_results.round1_points, game_results.round2_points, game_results.round3_points, game_results.total_points, game_results.hit_rate, game_results.winner_email FROM SideProject.game_results INNER JOIN user ON user.email = game_results.winner_email WHERE game_id = ?;", [gameID]);
        }

        return ({ stepList: stepHis[0], members: members[0], rules: rules[0][0], cardsSetting: cardsSetting[0], gameStatData: gameStat[0] });
    } catch (err) {
        console.log(`err in getReplay: ${err}`);
    } finally {
        await conn.release();
    }
};

module.exports = {
    getReplay
};
