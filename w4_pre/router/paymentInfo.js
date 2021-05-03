// AppWoeksSchool w4_pre
const express = require("express");

const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

router.use(express.static("public"));

router.get("/order/payments", (req, res) => {
    async function calTotal () {
        const sql = "SELECT user_id, total FROM order_table;";
        const result = await dbsql(req, sql);
        const ans = [];
        result.forEach(function (element) {
            // console.log(this.element.user_id);
            if (!this[element.user_id]) {
                this[element.user_id] = { user_id: element.user_id, total: 0 };
                ans.push(this[element.user_id]);
            }
            this[element.user_id].total += element.total;
        }, Object.create(null));
        const response = {};
        response.data = ans;
        return (response);
    }
    calTotal().then((response) => {
        // console.log(response);
        res.send(response);
    });

    // async function main () {
    //     const sql = "SELECT total ,user_id FROM order_table;";
    //     const sql_table = await dbsql(req, sql);
    //     const ans = {};

    //     for (i in sql_table) {
    //         if (!(sql_table[i].user_id in ans)) {
    //             ans[sql_table[i].user_id] = sql_table[i].total;
    //         } else {
    //             ans[sql_table[i].user_id] += sql_table[i].total;
    //         }
    //     }
    //     const result = {};
    //     result.data = [];
    //     for (i in ans) {
    //         const object = {};
    //         object.user_id = i;
    //         object.total_payment = ans[i];
    //         result.data.push(object);
    //     }
    //     return (result);
    // }
    // main().then((ans) => {
    //     res.send(ans);
    // });
});

module.exports = { router: router };
