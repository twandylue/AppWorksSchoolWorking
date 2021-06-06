require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("./mysqlcon");
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require("jsonwebtoken");

const USER_ROLE = {
    ALL: -1,
    ADMIN: 1,
    USER: 2
};

const signUp = async (name, roleId, email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");

        const emails = await conn.query("SELECT email FROM user WHERE email = ? FOR UPDATE", [email]);
        if (emails[0].length > 0) {
            await conn.query("COMMIT");
            return { error: "Email Already Exists" };
        }

        const loginAt = new Date();

        const user = {
            provider: "native",
            role_id: roleId,
            email: email,
            password: bcrypt.hashSync(password, salt),
            name: name,
            access_expired: TOKEN_EXPIRE,
            login_at: loginAt
        };
        const accessToken = jwt.sign({
            provider: user.provider,
            name: user.name,
            email: user.email
        }, TOKEN_SECRET);
        user.access_token = accessToken;

        const queryStr = "INSERT INTO user SET ?";
        const result = await conn.query(queryStr, user);

        user.id = result[0].insertId;
        await conn.query("COMMIT");
        return { user };
    } catch (error) {
        console.log(error);
        await conn.query("ROLLBACK");
        return { error };
    } finally {
        await conn.release();
    }
};

const nativeSignIn = async (email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query("START TRANSACTION");

        const users = await conn.query("SELECT * FROM user WHERE email = ?", [email]);
        const user = users[0][0];
        if (!bcrypt.compareSync(password, user.password)) {
            await conn.query("COMMIT");
            return { error: "Password is wrong" };
        }

        const loginAt = new Date();
        const accessToken = jwt.sign({
            provider: user.provider,
            name: user.name,
            email: user.email
        }, TOKEN_SECRET);

        const queryStr = "UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?";
        await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);

        await conn.query("COMMIT");

        user.access_token = accessToken;
        user.login_at = loginAt;
        user.access_expired = TOKEN_EXPIRE;

        return { user };
    } catch (error) {
        await conn.query("ROLLBACK");
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserDetail = async (email, roleId) => {
    try {
        if (roleId) {
            const users = await pool.query("SELECT * FROM user WHERE email = ? AND role_id = ?", [email, roleId]);
            return users[0][0];
        } else {
            const users = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
            return users[0][0];
        }
    } catch (e) {
        return null;
    }
};

const getRecord = async (email) => {
    const conn = await pool.getConnection();
    const results = await conn.query("SELECT player_email, SUM(points), COUNT(*) FROM game_history WHERE player_email = ?", email); // 這裏從history中計算 包含與機器人對戰
    let totalPoints;
    if (results[0][0]["SUM(points)"] === null) {
        totalPoints = 0;
    } else {
        totalPoints = parseInt(results[0][0]["SUM(points)"]);
    }
    const hitRate = (totalPoints * 2 / 10) / parseInt(results[0][0]["COUNT(*)"]);

    const sql = "SELECT game_results.game_id, user.name, user.email, game_setting_info.room_id, game_setting_info.type, game_setting_info.number, game_setting_info.rounds, game_setting_info.player_1, game_setting_info.player_2, game_results.round1_points, game_results.round2_points, game_results.round3_points, game_results.total_points, game_results.hit_rate, game_results.winner_email FROM game_results INNER JOIN `user` ON user.email = game_results.player_email INNER JOIN game_setting_info ON game_setting_info.id = game_results.game_id WHERE game_results.player_email = ? AND status = 2;"; // status = 2 只限雙人遊玩可以重播記錄

    // console.log(pool.format(sql, email));
    const gameHis = await conn.query(sql, email);
    // console.log(gameHis[0]);

    return ({ totalPoints: totalPoints, hitRate: hitRate, gameHis: gameHis[0] });
};

const getLeaderList = async () => {
    // use game_results SUM(total_points) GROUP BY (email) JOIN user.name
    const conn = await pool.getConnection();
    const results = await conn.query("SELECT user.name, player_email, SUM(total_points), SUM(hit_rate), COUNT(*) FROM game_results INNER JOIN user ON user.email = game_results.player_email GROUP BY player_email ORDER BY SUM(total_points) DESC;"); // 這裏從game_results拿取資訊 user.name會剔除機器人進入排行榜
    await conn.release();

    const leaderList = [];
    // console.log(results[0]);

    for (const i in results[0]) {
        leaderList.push({ name: results[0][i].name, player_email: results[0][i].player_email, totalPoints: parseInt(results[0][i]["SUM(total_points)"]), avgPoints: parseInt(results[0][i]["SUM(total_points)"]) / parseInt(results[0][i]["COUNT(*)"]), avgHitRate: parseInt(results[0][i]["SUM(hit_rate)"]) / parseInt(results[0][i]["COUNT(*)"]) });
    }

    return (leaderList);
};

module.exports = {
    USER_ROLE,
    signUp,
    nativeSignIn,
    getUserDetail,
    getRecord,
    getLeaderList
};
