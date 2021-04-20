// AppWoeksSchool w4_pre
const express = require("express");

const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

router.use(express.static("public"));

router.get("/order/payments", (req, res) => {
    const data = [];
    async function calPayment () {
        for (let i = 1; i < 6; i++) {
            const sql = `SELECT total FROM stylish.order_table WHERE user_id= ${i}`;
            const result = await dbsql(req, sql);
            let totalPayment = 0;
            for (const i in result) {
                totalPayment += result[i].total;
            }
            const paymentInfo = {
                user_id: i,
                total_payment: totalPayment
            };
            data.push(paymentInfo);
        }
        return data;
    }
    calPayment().then((data) => {
        const result = {
            data: data
        };
        res.send(JSON.stringify(result));
    });
});

module.exports = { router: router };
