// AppWoeksSchool w1p3
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('request');
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'pug'); 

const db = mysql.createConnection({
    host     : process.env["DB_HOST"],
    user     : process.env["DB_USER"],
    password : process.env["DB_PASSWORD"],
    database : process.env["DB_DATABASE"],
})

// Connect test
db.connect((err) => {
    if(err) throw err;
    console.log('mySQL connected!');
})

app.get('/', (req, res) => {
    res.send('<h1>Hello, My Server!</h1>');
});

app.get('/test', (req, res) => {
    // request 
    async function main() {
        function req() {
            let _req = new Promise((resolve, reject) => {
                request('https://graph.facebook.com/me?fields=id,name,birthday,email,picture&access_token=EAAPQfOJoAZBcBAESRkGCCDWbbbshWA3ok2RZA9wDE0kW1AiZCH16DXCprpUhz4V8hTOc3ASKjdVZCBK6wTGLKiQsYOQ9fZCvH8IFfwT9MwbWoRUEmiZAFy5sZBjBkbtZBwRJQjCpdtVZBq3fOX8mgFhkh7EVMjMJwtcTjZBWfUHtHZC1be4g5tjDaccNtiBN4pTO8LrSttdKk8lGTEYhVd4dZAhhbyKZAClrKhivMjVmB9SOyAaLpZAwrSEhSq8ANvZAyGWNxAZD', { json: true }, (err, res, body) => {
                    if (err) { return console.log(err); }
                    // console.log(typeof(body));
                    // console.log(body.id);
                    // console.log(body.name);
                    // console.log(body.email);
                    // return body
                    resolve(body)
                });
            })
            return _req;            
        }
        let result = await req();

        console.log(result); 
        console.log("=====================");

        return result
    }
    main().then((result)=>{
        res.send(result);
        // console.log("=====================");
    });
    
    
})

function call_sql(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
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
                // console.log('2')
                resolve(false);
            }
        })
    })
}

const secretkey = '!*&key%^'; // 全域變數 hash key
function create_jwt(payload) {
    return new Promise((resolve, reject) => {
        let info_jwt = {};
        let jwt_token = jwt.sign(payload, secretkey, {expiresIn: '3600'});
        info_jwt.token = jwt_token;
        info_jwt.expired = 3600;
        resolve(info_jwt);
    })
}

app.post(`/api/${process.env["API_VERSION"]}/user/signup`, (req, res) => {
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
        let result = {};
        let sql = `SELECT * FROM private_information.user_data WHERE email = '${userdata.email}';`;
        let sqlresponse = await call_sql(sql);
        // console.log(sqlresponse[0].id) // password
        if (sqlresponse) {
            sqlresponse = "<h1>Email has been registered!</h1>";
            info.message = sqlresponse;
            result.data = info;
            return result
        } else {
            // hash
            let user = {};
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userdata.password, salt);

            // token
            let payload = {"name": userdata.name, "email": userdata.email};
            let jtw = await create_jwt(payload);
            info.access_token = jtw.token;
            info.access_expired = jtw.expired;

            sql = `INSERT INTO private_information.user_data (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            sqlresult = await call_sql(sql);
            sql = `SELECT * FROM private_information.user_data WHERE email = '${userdata.email}';`;
            sqlresult = await call_sql(sql);
            // console.log(sqlresult[0].id)
            user.id = sqlresult[0].id; 
            user.provider = "facebook";
            user.name = userdata.name; 
            user.email = userdata.email;
            user.picture = "test";
            info.user = user;
            result.data = info;

            return JSON.stringify(result)
        }
    }
    signup_main().then((answer) => {
        console.log("sing up")
        res.send(answer);
    })
})

// app.post(`/api/${process.env["API_VERSION"]}/user/signin`, (req, res) => {
app.post(`/user/signin`, (req, res) => {
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
        let info = {};
        let user_data = {};

        if ("access_token" in singin_data) { // 通常是找header裡面的token?
            function sendRequest(fb_token_url) {
                let _req = new Promise((resolve, reject) => {
                    request(`https://graph.facebook.com/me?fields=id,name,birthday,email,picture&access_token=${fb_token_url}`, { json: true }, (err, res, body) => {
                        if (err) { return console.log(err); }
                        resolve(body)
                    });
                })
                return _req;            
            }
            let fb_token_url = singin_data.access_token;
            let user_info = await sendRequest(fb_token_url);
            // console.log(user_info)

            let payload = {"name": user_info.name, "email": user_info.email}; 
            let jtw = await create_jwt(payload);
            info.access_token = jtw.token;
            info.access_expired = jtw.expired;
            user_data.id = user_info.id;
            user_data.provider = singin_data.provider;
            user_data.name = user_info.name;
            user_data.email = user_info.email;
            user_data.picture = user_info.picture.data.url;
            info.user = user_data;
            response_result.data = info;
            return JSON.stringify(response_result);
        }
        
    //     let sql = `SELECT * FROM private_information.user_data WHERE email = '${singin_data.email}';`; //還沒完成check email
    //     sqlresult = await call_sql(sql);
    //     // console.log(sqlresult);

    //     let id = sqlresult[0].id;
    //     let provider = singin_data.provider; // 如果前端輸入時沒有提供provider? 會有bug
    //     let name = sqlresult[0].name;
    //     let email = singin_data.email;
    //     let encoded_password = sqlresult[0].password
        
    //     let result = await bcrypt.compare(singin_data.password, encoded_password);
    //     if (result) {
    //         // token
    //         let payload = {"name": name, "email": email}; 
    //         let jtw = await create_jwt(payload);
    //         info.access_token = jtw.token;
    //         info.access_expired = jtw.expired;
    //         user_data.id = id;
    //         user_data.provider = provider;
    //         user_data.name = name;
    //         user_data.email = email;
    //         user_data.picture = "test";
    //         info.user = user_data;
    //         response_result.data = info;
    //         return JSON.stringify(response_result);

    //     } else {
    //         let message = "<h1>Password or email is wrong!</h1>"; //還沒完成check email
    //         info.message = message;
    //         response_result.data = info;
    //         return JSON.stringify(response_result);
    //     }
    }
    singin_main().then((answer) => {
        console.log("sing in")
        res.send(answer);
    });
})

app.get(`/api/${process.env["API_VERSION"]}/user/profile`, (req, res) => {
    let response_result = {};
    let info = {};

    // 解jwt
    // let secretkey = '!*&key%^'; // 可否設為全域變數? 可以
    let uncodedtoken = req.headers.authorization;
    // console.log(uncodedtoken)
    if (uncodedtoken) {
        uncodedtoken = (req.headers.authorization.split(' '))[1];
        // console.log(uncodedtoken);
        decoded_token = jwt.decode(uncodedtoken, secretkey);
        console.log(decoded_token); 

        info.provider = "facebook"; // native?
        info.name = decoded_token.name;
        info.email = decoded_token.email;
        info.picture = "test";
        response_result.data = info;
        // console.log(response_result);
        console.log(JSON.stringify(response_result))
        // if 過期
        // if (decoded_token) {
        //     // 通行 res.redirect...

        // } 
        // else if(0) {
        //     // 過期 
        // } else {
        //     // 
        // }
    } 
    console.log('in profile')

    res.send(JSON.stringify(response_result));
})

// 設置port:3000的server
app.listen(3000, () => {
    console.log('running...');
}); 