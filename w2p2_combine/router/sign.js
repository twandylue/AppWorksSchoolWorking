// AppWoeksSchool w1p3 and w1p4
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
const create_jwt = require("./function").create_jwt;
const check_jwt = require("./function").check_jwt;
const call_sql = require("./function").call_sql;
const sendRequest = require("./function").sendRequest;
const responseConsist = require("./function").responseConsist;

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
// router.use(express.static('public')); // 可能會有問題

router.post(`/user/signup`, (req, res) => {
    let userdata = {};
    if (typeof(req.body) == 'object') {
        // from front-end
        userdata = req.body;
    } else {
        // from postman
        userdata = JSON.parse(req.body);
    }

    async function signup_main() {
        let info = {};
        let response_result = {};
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
        let sqlresponse = await call_sql(req, sql);
        if (sqlresponse) {
            sqlresponse = "<h1>Email has been registered!</h1>";
            info.message = sqlresponse;
            response_result.data = info;
            return response_result
        } else {
            // hash password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userdata.password, salt);

            // jwt token
            let payload = {"name": userdata.name, "email": userdata.email};
            let jtw = await create_jwt(payload);

            sql = `INSERT INTO stylish.user_info_table (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            sqlresult = await call_sql(req, sql);
            sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
            sqlresult = await call_sql(req, sql);
    
            response_result = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, "facebook", userdata.name, userdata.email, "test");

            return JSON.stringify(response_result)
        }
    }
    signup_main().then((answer) => {
        console.log("sing up")
        res.send(answer);
    })
})

router.post(`/user/signin`, (req, res) => {
    let singin_data = {};
    if (typeof(req.body) == 'object') {
        // from postman
        singin_data = req.body;
    } else {
        // from front-end
        singin_data = JSON.parse(req.body);
    }
    async function singin_main() {
        let response_result = {};
        if ("access_token" in singin_data && singin_data.provider === 'facebook') { // 通常是找header裡面的token? req.headers.access_token
            // from postman
            
            let fb_token_url = singin_data.access_token;
            let user_info = await sendRequest(fb_token_url);
            // console.log(user_info)

            let payload = {"name": user_info.name, "email": user_info.email, "provider": singin_data.provider, "picture": user_info.picture.data.url}; 
            let jtw = await create_jwt(payload);

            response_result = responseConsist(jtw.token, jtw.expired, user_info.id, singin_data.provider, user_info.name, user_info.email, user_info.picture.data.url);
            console.log(response_result); // checkout Arthur's robot info
            return JSON.stringify(response_result);
        }
        
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${singin_data.email}';`; // haven't finshed checking email
        sqlresult = await call_sql(req, sql);
        // console.log(sqlresult);        
        let result = await bcrypt.compare(singin_data.password, sqlresult[0].password);
        if (result) {
            // jwt token
            let payload = {"name": sqlresult[0].name, "email": singin_data.email}; 
            let jtw = await create_jwt(payload);

            // 如果前端輸入時沒有提供provider? 會有bug
            response_result = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, singin_data.provider, sqlresult[0].name, singin_data.email, "test");

            return JSON.stringify(response_result);

        } else {
            let message = "<h1>Password or email is wrong!</h1>"; // 還沒完善check email sql指令會有問題
            info.message = message;
            response_result.data = info;
            return JSON.stringify(response_result);
        }
    }
    singin_main().then((answer) => {
        console.log("sing in")
        res.send(answer);
    });
})

router.get(`/user/profile`, (req, res) => {
    let response_result = {};
    let info = {};

    let uncodedtoken = req.headers.authorization;
    if (uncodedtoken) {
        let encrypted_token = req.headers.authorization;
        let jwt_token = check_jwt(encrypted_token);
        if (jwt_token == 1) {
            res.redirect(`../api/${process.env["API_VERSION"]}/user/signup`); // 可能會有問題 路徑上 日後須注意
        } else if (jwt_token == 2) {
            res.redirect(`../api/${process.env["API_VERSION"]}/user/signup`); // or signin
        }

        if (jwt_token.provider) {
            info.provider = jwt_token.provider;
        } else {
            info.provider = 'native';
        }
        info.name = jwt_token.name;
        info.email = jwt_token.email;
        if (jwt_token.picture) {
            info.picture = jwt_token.picture;
        } else {
            info.picture = 'not exist';
        }
        response_result.data = info;
        // console.log(response_result); // checkout Arthur's robot info

        async function save_userInfo(){
            let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${jwt_token.email}';`;
            let sqlresponse = await call_sql(req, sql);
            if (sqlresponse) {
                console.log('Email has been registered!'); // ready to redirect 
            } else {
                sql = `INSERT INTO stylish.user_info_table (name, email) VALUES ('${jwt_token.name}', '${jwt_token.email}');`;
                sqlresult = await call_sql(req, sql);
                console.log('Rigister success!'); // ready to redirect
            }
        } 
        save_userInfo();
    } 
    console.log('in profile')
    
    res.send(JSON.stringify(response_result));
})

module.exports = {router: router};