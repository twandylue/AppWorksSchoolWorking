const { pool } = require("./mysqlcon");

const saveUserPhoto = async (email, src) => {
    const conn = await pool.getConnection();
    try {
        await conn.query("UPDATE user SET photo_src = ? WHERE email =?", [src, email]);
    } catch (err) {
        console.log(`error in saveUserPhoto ${err}`);
    } finally {
        await conn.release();
    }
};

module.exports = {
    saveUserPhoto
};
