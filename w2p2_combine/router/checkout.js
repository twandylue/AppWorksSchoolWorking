// AppWoeksSchool w2p1 and w2p2
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TapPay = require('tappay-nodejs');
const request = require('request');
// const { resolve } = require('path');
// require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'}); // 路徑會有問題

// Router setting
const router = express.Router();

// function setting
const db_setInsert = require("./function").db_setInsert;
const check_jwt = require("./function").check_jwt;
const call_sql = require("./function").call_sql;

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
// router.use(express.static('public')); // 可能會有問題

// -- w2p1 and w2p2
router.post(`/order/checkout`, (req, res) => {
    let encrypted_token = req.headers.authorization;
    let check_jwt_status = check_jwt(encrypted_token);
    if (check_jwt_status == 1) {
        res.redirect(`../api/${process.env["API_VERSION"]}/user/signup`); // or signin
    } else if (check_jwt_status == 2) {
        res.redirect(`../api/${process.env["API_VERSION"]}/user/signup`); // or signin
    }

    let order_data = {};
    if (typeof(req.body) == 'object') {
        // from postman
        order_data = req.body;
    } else {
        // from front-end
        order_data = JSON.parse(req.body);
    }
    // console.log(order_data);

    async function orderInsertMysql() {
        let {shipping, payment, subtotal, freight, total} = order_data.order; 
        let {name, phone, email, address, time} = order_data.order.recipient;
        let orderInfo = {
            paid: 0,
            shipping: shipping,
            payment: payment,
            subtotal: subtotal,
            freight: freight,
            total: total,
            name: name,
            phone: phone,
            email: email,
            address: address,
            time: time
        };
        let order_sql =  `INSERT INTO stylish.order_table SET ?`;
        let result = await db_setInsert(req, order_sql, orderInfo); // INSERT INTO order_table
        // console.log(result);
        let order_id = result.insertId; // order_id in mysql
        for (let i = 0; i<order_data.order.list.length; i++) { // 注意效能 for loop
            let {id, name, price, size, qty} = order_data.order.list[i];
            let orderListInfo = {
                order_id: order_id,
                id: id,
                name: name,
                price: price,
                color_code: order_data.order.list[i].color.code,
                color_name: order_data.order.list[i].color.name,
                size: size,
                quantity: qty
            }
            let order_sql =  `INSERT INTO stylish.order_list_table SET ?`;
            console.log(orderListInfo); // checkout robot
            let result = await db_setInsert(req, order_sql, orderListInfo); // INSERT INTO order_list_table
            // console.log(result)
        }
        console.log('order_id :' + order_id); // checkout robot

        return (order_id)
    }
    orderInsertMysql().then((order_id) => {
        TapPay.initialize({
        partner_key: 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG',
        env: 'sandbox'
        })
        
        const payment_info = {
            prime: order_data.prime,
            merchant_id: 'AppWorksSchool_CTBC',
            amount: 1,
            currency: "TWD",
            details: "An apple and a pen.",
            cardholder: {
                phone_number: "+886923456789",
                name: "王小明",
                email: "LittleMing@Wang.com" 
            },
            remember: true
        }
        console.log(payment_info); // checkout robot
        // Callback Style
        TapPay.payByPrime(payment_info, (error, result) => { 
            // console.log(result.status);
            if (result.status !== 0) {
                console.log(result.msg);
                res.send(result.msg);
            } else if (result.status === 0) {
                let update_paid_sql = `UPDATE stylish.order_table SET paid = 1 WHERE order_id = ${order_id};`; // 效能差 一次只能處理一筆
                let update_paid = call_sql(req, update_paid_sql);
                update_paid.then(() => {
                    let response = {
                        data: { 
                            number: order_id.toString()
                        }
                    }
                    console.log(response); // checkout robot
                    res.send(JSON.stringify(response))
                })
            }
        })
    })
})

module.exports = {router: router};