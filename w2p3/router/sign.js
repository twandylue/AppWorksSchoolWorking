// AppWoeksSchool w1p3 and w1p4
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
// require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'}); // 路徑會有問題

// Router setting
const router = express.Router();

// function setting
// const db_setInsert = require("./function").db_setInsert;
const createJWT = require("./function").createJWT;
const checkJWT = require("./function").checkJWT;
const callSQL = require("./function").callSQL;
const sendRequest = require("./function").sendRequest;
const responseConsist = require("./function").responseConsist;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
// router.use(express.static('public')); // 可能會有問題

router.post("/user/signup", (req, res) => {
    let userdata = {};
    if (typeof (req.body) === "object") {
        // from front-end
        userdata = req.body;
    } else {
        // from postman
        userdata = JSON.parse(req.body);
    }

    async function signupMain () {
        const info = {};
        let responseResult = {};
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
        let sqlresponse = await callSQL(req, sql);
        if (sqlresponse) {
            sqlresponse = "<h1>Email has been registered!</h1>";
            info.message = sqlresponse;
            responseResult.data = info;
            return responseResult;
        } else {
            // hash password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userdata.password, salt);

            // jwt token
            const payload = { name: userdata.name, email: userdata.email };
            const jtw = await createJWT(payload);

            sql = `INSERT INTO stylish.user_info_table (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            let sqlresult = await callSQL(req, sql);
            sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
            sqlresult = await callSQL(req, sql);

            responseResult = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, "facebook", userdata.name, userdata.email, "test");

            return JSON.stringify(responseResult);
        }
    }
    signupMain().then((answer) => {
        console.log("sing up");
        res.send(answer);
    });
});

router.post("/user/signin", (req, res) => {
    let singinData = {};
    if (typeof (req.body) === "object") {
        // from postman
        singinData = req.body;
    } else {
        // from front-end
        singinData = JSON.parse(req.body);
    }
    async function singinMain () {
        let responseResult = {};
        if ("access_token" in singinData && singinData.provider === "facebook") { // 通常是找header裡面的token? req.headers.access_token
            // from postman

            const fbTokenURL = singinData.access_token;
            const userInfo = await sendRequest(fbTokenURL);
            // console.log(userInfo)

            const payload = { name: userInfo.name, email: userInfo.email, provider: singinData.provider, picture: userInfo.picture.data.url };
            const jtw = await createJWT(payload);

            responseResult = responseConsist(jtw.token, jtw.expired, userInfo.id, singinData.provider, userInfo.name, userInfo.email, userInfo.picture.data.url);
            console.log(responseResult); // checkout Arthur's robot info
            return JSON.stringify(responseResult);
        }

        const sql = `SELECT * FROM stylish.user_info_table WHERE email = '${singinData.email}';`; // haven't finshed checking email
        const sqlresult = await callSQL(req, sql);
        // console.log(sqlresult);
        const result = await bcrypt.compare(singinData.password, sqlresult[0].password);
        if (result) {
            // jwt token
            const payload = { name: sqlresult[0].name, email: singinData.email };
            const jtw = await createJWT(payload);

            // 如果前端輸入時沒有提供provider? 會有bug
            responseResult = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, singinData.provider, sqlresult[0].name, singinData.email, "test");

            return JSON.stringify(responseResult);
        } else {
            const message = "<h1>Password or email is wrong!</h1>"; // 還沒完善check email sql指令會有問題
            const info = {};
            info.message = message;
            responseResult.data = info;
            return JSON.stringify(responseResult);
        }
    }
    singinMain().then((answer) => {
        console.log("sing in");
        res.send(answer);
    });
});

router.get("/user/profile", (req, res) => {
    const responseResult = {};
    const info = {};

    const uncodedtoken = req.headers.authorization;
    if (uncodedtoken) {
        const encryptedToken = req.headers.authorization;
        const JWTtoken = checkJWT(encryptedToken);
        if (JWTtoken === 1) {
            res.redirect(`../api/${process.env.API_VERSION}/user/signup`); // 可能會有問題 路徑上 日後須注意
        } else if (JWTtoken === 2) {
            res.redirect(`../api/${process.env.API_VERSION}/user/signup`); // or signin
        }

        if (JWTtoken.provider) {
            info.provider = JWTtoken.provider;
        } else {
            info.provider = "native";
        }
        info.name = JWTtoken.name;
        info.email = JWTtoken.email;
        if (JWTtoken.picture) {
            info.picture = JWTtoken.picture;
        } else {
            info.picture = "not exist";
        }
        responseResult.data = info;
        // console.log(responseResult); // checkout Arthur's robot info

        async function saveUserInfo () {
            let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${JWTtoken.email}';`;
            const sqlresponse = await callSQL(req, sql);
            if (sqlresponse) {
                console.log("Email has been registered!"); // ready to redirect
            } else {
                sql = `INSERT INTO stylish.user_info_table (name, email) VALUES ('${JWTtoken.name}', '${JWTtoken.email}');`;
                // eslint-disable-next-line no-unused-vars
                const sqlresult = await callSQL(req, sql);
                console.log("Rigister success!"); // ready to redirect
            }
        }
        saveUserInfo();
    }
    console.log("in profile");

    res.send(JSON.stringify(responseResult));
});

module.exports = { router: router };
