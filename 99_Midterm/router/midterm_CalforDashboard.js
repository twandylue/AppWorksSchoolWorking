// midterm part 2
const express = require("express");
const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;
const dbSetInsert = require("./function").dbSetInsert;

router.get("/midtermTest", (req, res) => {
    console.log("test");
    res.send("test");
});

router.get("/TotalRevenue", async (req, res) => {
    const sql = "SELECT SUM(total) FROM midterm_order_list;";
    const resultDB = await dbsql(req, sql);
    const ans = {
        data: {
            "Total Revenue": resultDB[0]["SUM(total)"]
        }
    };
    // console.log(ans);
    res.send(JSON.stringify(ans));
});

router.get("/PieChart", async (req, res) => {
    const sql = "SELECT color_name, color_code, SUM(qty) FROM midterm_order_list GROUP BY color_name;";
    const resultDB = await dbsql(req, sql);
    // console.log(resultDB);
    const ans = {
        data: resultDB
    };
    res.send(ans);
});

router.get("/Histograms", async (req, res) => {
    const sql = "SELECT price, qty FROM midterm_order_list";
    const resultDB = await dbsql(req, sql);
    // console.log(resultDB);
    const arr = [];
    const arrTest = [];
    for (const i in resultDB) {
        for (let j = 0; j < resultDB[i].qty; j++) {
            arrTest.push(resultDB[i].price);
        }
        arr.push(resultDB[i].price);
    }
    const ans = {
        data: arrTest
    };
    res.send(ans);
});

router.get("/BarChart", async (req, res) => {
    let sql = "SELECT product_id, SUM(qty) FROM midterm_order_list GROUP BY product_id ORDER BY SUM(qty) DESC LIMIT 5";
    const max5 = await dbsql(req, sql);
    const max5Ids = max5.map(element => element.product_id);

    sql = "SELECT product_id, size, SUM(qty) FROM midterm_order_list WHERE product_id IN ? GROUP BY product_id, size ORDER BY product_id;";
    // const resultDB = await dbsql(req, sql);
    const resultDB = await dbSetInsert(req, sql, [[max5Ids]]);

    const objectS = {
        idList: max5Ids,
        count: [],
        size: "S"
    };
    const objectM = {
        idList: max5Ids,
        count: [],
        size: "M"
    };
    const objectL = {
        idList: max5Ids,
        count: [],
        size: "L"
    };

    for (const i in max5Ids) {
        for (const j in resultDB) {
            if (max5Ids[i] === resultDB[j].product_id) {
                if (resultDB[j].size === "S") {
                    objectS.count.push(resultDB[j]["SUM(qty)"]);
                } else if (resultDB[j].size === "M") {
                    objectM.count.push(resultDB[j]["SUM(qty)"]);
                } else if (resultDB[j].size === "L") {
                    objectL.count.push(resultDB[j]["SUM(qty)"]);
                }
            }
        }
    }
    // console.log(resultDB);

    const arr = [];
    arr.push(objectS, objectM, objectL);
    const ans = {
        data: arr
    };
    // res.send(max5Ids);
    // res.send(resultDB);
    res.send(ans);
});

module.exports = { router: router };
