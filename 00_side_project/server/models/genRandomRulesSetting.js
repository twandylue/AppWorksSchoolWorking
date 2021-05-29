const { pool } = require("./mysqlcon");

const genRandomRulesSetting = async () => {
    const conn = await pool.getConnection();
    const sql = "INSERT INTO game_rules_random (type, card_number, rounds, target_1, target_2, target_3) VALUES ?";
    const types = "multi";
    const numbers = [16, 25, 36];
    const rounds = [1, 2, 3];
    const targets = [100, 144, 180, 200, 240, 280, 340, 500, 570, 700, 800, 1000, 1200, 1500, 1600, 1900, 2100, 2414, 2500, 2600, 2800, 2900, 3000, 3001];
    const insert = [];
    for (let i = 0; i < 700; i++) {
        const arr = [];
        let randomNumberin3 = Math.floor(Math.random() * 3);
        arr.push(types, numbers[randomNumberin3]);
        randomNumberin3 = Math.floor(Math.random() * 3);
        arr.push(rounds[randomNumberin3]);
        for (let i = 0; i < 3; i++) {
            const randomNumberinTargets = Math.floor(Math.random() * targets.length);
            if (i < rounds[randomNumberin3]) {
                arr.push(targets[randomNumberinTargets]);
                continue;
            }
            arr.push(null);
        }
        insert.push(arr);
    }
    // console.log(insert);
    // console.log(pool.format(sql, [insert]));
    await conn.query(sql, [insert]);
    await conn.release();
};

module.exports = {
    genRandomRulesSetting
};
