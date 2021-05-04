// AppWoeksSchool w4_pre
const express = require("express");

const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

router.use(express.static("public"));

router.get("/order/payments", (req, res) => {
    async function calTotal () {
        // // =================type 1=================
        // const sql = "SELECT user_id, total FROM order_table;";
        // const result = await dbsql(req, sql);
        // // const result = [ // for test
        // //     { user_id: 1, total: 123 },
        // //     { user_id: 2, total: 321 },
        // //     { user_id: 3, total: 111 },
        // //     { user_id: 2, total: 234 }
        // // ];
        // const user = {};
        // const ans = [];
        // // console.log(result);
        // result.forEach(function (ele) {
        //     // console.log("================");
        //     // console.log(user);
        //     if (!user[ele.user_id]) {
        //         user[ele.user_id] = { user_id: ele.user_id, total: 0 };
        //         ans.push(user[ele.user_id]);
        //     }
        //     user[ele.user_id].total += ele.total;
        // });
        // // console.log(ans);

        // // result.forEach(function (element) { // 另種寫法
        // //     console.log(this[element.user_id]);
        // //     if (!this[element.user_id]) {
        // //         this[element.user_id] = { user_id: element.user_id, total: 0 };
        // //         ans.push(this[element.user_id]);
        // //     }
        // //     this[element.user_id].total += element.total;
        // // }, Object.create(null));

        // // =================type 1=================

        // =================type 2=================
        const sql = "SELECT user_id, SUM(total) FROM stylish.order_table GROUP BY user_id;";
        const ans = await dbsql(req, sql);
        // console.log(ans);
        // =================type 2=================
        const response = {};
        response.data = ans;
        return (response);
    }
    calTotal().then((response) => {
        // console.log(response);
        res.send(response);
    });
});

module.exports = { router: router };
