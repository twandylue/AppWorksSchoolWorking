// AppWoeksSchool w1p4
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
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
                resolve(false);
            }
        })
    })
}

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

// -- w1p4
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
        let response_result = {};
        let sql = `SELECT * FROM private_information.user_data WHERE email = '${userdata.email}';`;
        let sqlresponse = await call_sql(sql);
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

            sql = `INSERT INTO private_information.user_data (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            sqlresult = await call_sql(sql);
            sql = `SELECT * FROM private_information.user_data WHERE email = '${userdata.email}';`;
            sqlresult = await call_sql(sql);
    
            response_result = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, "facebook", userdata.name, userdata.email, "test");

            return JSON.stringify(response_result)
        }
    }
    signup_main().then((answer) => {
        console.log("sing up")
        res.send(answer);
    })
})

app.post(`/api/${process.env["API_VERSION"]}/user/signin`, (req, res) => {
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
        if ("access_token" in singin_data) { // 通常是找header裡面的token? req.headers.access_token
            // from postman
            function sendRequest(fb_token_url) {
                let _req = new Promise((resolve, reject) => {
                    // 應該要能依照provider決定request的url(不同provider) 待改進
                    request(`https://graph.facebook.com/me?fields=id,name,birthday,email,picture&access_token=${fb_token_url}`, { json: true }, (err, res, body) => {
                        if (err) { return console.log(err); }
                        resolve(body)
                    });
                })
                return _req
            }
            let fb_token_url = singin_data.access_token;
            let user_info = await sendRequest(fb_token_url);
            // console.log(user_info)

            let payload = {"name": user_info.name, "email": user_info.email, "provider": singin_data.provider, "picture": user_info.picture.data.url}; 
            let jtw = await create_jwt(payload);

            response_result = responseConsist(jtw.token, jtw.expired, user_info.id, singin_data.provider, user_info.name, user_info.email, user_info.picture.data.url);
            console.log(response_result); // checkout Arthur's robot info
            return JSON.stringify(response_result);
        }
        
        let sql = `SELECT * FROM private_information.user_data WHERE email = '${singin_data.email}';`; // haven't finshed checking email
        sqlresult = await call_sql(sql);
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

app.get(`/api/${process.env["API_VERSION"]}/user/profile`, (req, res) => {
    let response_result = {};
    let info = {};

    let uncodedtoken = req.headers.authorization;
    if (uncodedtoken) {
        uncodedtoken = (req.headers.authorization.split(' '))[1];
        // console.log(uncodedtoken); 
        decoded_token = jwt.decode(uncodedtoken, secretkey);
        console.log(decoded_token); // checkout Arthur's robot info

        if (Date.now() > decoded_token.exp * 1000) {  // token expired
            console.log("Token expired!"); // redirect to signin and get new token
            res.redirect(`/api/${process.env["API_VERSION"]}/user/signup`);
        }

        info.provider = decoded_token.provider;
        info.name = decoded_token.name;
        info.email = decoded_token.email;
        info.picture = decoded_token.picture;
        response_result.data = info;
        // console.log(response_result); // checkout Arthur's robot info

        async function save_userInfo(){
            let sql = `SELECT * FROM private_information.user_data WHERE email = '${decoded_token.email}';`;
            let sqlresponse = await call_sql(sql);
            if (sqlresponse) {
                // sqlresponse = "<h1>Email has been registered!</h1>";
                // info.message = sqlresponse;
                // response_result.data = info;
                // return response_result
                console.log('Email has been registered!'); // ready to redirect 
            } else {
                sql = `INSERT INTO private_information.user_data (name, email) VALUES ('${decoded_token.name}', '${decoded_token.email}');`;
                sqlresult = await call_sql(sql);
                console.log('Rigister success!'); // ready to redirect
            }
        } 
        save_userInfo();
    } 
    console.log('in profile')
    
    res.send(JSON.stringify(response_result));
})

// -- w2p1
app.get('/admin/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/order/checkout', (req, res) => {

})

// 設置port:3000的server
app.listen(3000, () => {
    console.log('running...');
}); 