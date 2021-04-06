// functions
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

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static('public')); // 可能會有問題

// for w1p4 to w2p2
function call_sql(req, sql) {
    return new Promise((resolve, reject) => {
        req.app.get("db").query(sql, (err, result) => {
            if (err) {
                throw err;
            } 
            // console.log(result)
            if (result.length) {
                // reject(''); // 有問題 promise unhandle 待解決
                // exist
                resolve(result);
            } else {
                // not exist
                resolve(false);
            }
        })
    })
}

// for w2p1 and w2p2
function db_setInsert(req, sql, info) {
    return new Promise((resolve, reject) => {
        req.app.get("db").query(sql, info, (err, result) => {
            if (err) resolve(err);
            if (result) resolve(result);
        })
    })
}

// for w1p3 and w1p4
function responseConsist(token, expire, id, provider, name, email, picture) {
    let responseResult = {};
    let data = {};
    let user = {};

    data.access_token = token;
    data.access_expired = expire;
    user.id = id;
    user.provider = provider;
    user.name = name;
    user.email= email;
    user.picture = picture;
    data.user = user;
    responseResult.data = data;
    return responseResult;    
}

// for w1p4 to w2p2
const secretkey = process.env["JWT_KEY"] // 全域變數 jwt key 路徑可能會有問題
// console.log(secretkey)
function create_jwt(payload) {
    return new Promise((resolve, reject) => {
        let info_jwt = {};
        // let jwt_token = jwt.sign(payload, secretkey, {expiresIn: '3600'});
        let jwt_token = jwt.sign(payload, secretkey, {expiresIn: '1d'});
        info_jwt.token = jwt_token;
        // info_jwt.expired = 3600;
        info_jwt.expired = '1 day';
        resolve(info_jwt);
    })
}

function check_jwt(encrypted_token) {
    encrypted_token = encrypted_token.split(' ')[1];
    let decrypt_jwt = jwt.decode(encrypted_token, secretkey);
    if (decrypt_jwt) {
        return (decrypt_jwt);
    } else if (decrypt_jwt === null) {
        console.log('Token is wrong');
        return (1);
    } else if (Date.now() > decrypt_jwt.exp*1000) {
        console.log('Token expired!');
        return (2);
    }
}

// for w1p3 and w1p4
function sendRequest(fb_token_url) {
    let req = new Promise((resolve, reject) => {
        // 應該要能依照provider決定request的url(不同provider) 待改進
        request(`https://graph.facebook.com/me?fields=id,name,birthday,email,picture&access_token=${fb_token_url}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            resolve(body)
        });
    })
    return req
}

module.exports = {
    router: router, 
    call_sql: call_sql, 
    db_setInsert: db_setInsert, 
    responseConsist: responseConsist, 
    create_jwt: create_jwt,
    check_jwt: check_jwt,
    sendRequest: sendRequest
}; 