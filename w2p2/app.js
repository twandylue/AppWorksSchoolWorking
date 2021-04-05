// AppWoeksSchool w2p1
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TapPay = require('tappay-nodejs');
const request = require('request');
const { resolve } = require('path');
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
    // check_jwt('test'); // return null
    check_jwt('headers 123456');
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

function db_setInsert(sql, info) {
    return new Promise((resolve, reject) => {
        db.query(sql, info, (err, result) => {
            if (err) resolve(err);
            if (result) resolve(result);
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

const secretkey = process.env["JWT_KEY"] // 全域變數 jwt key
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
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
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

            sql = `INSERT INTO stylish.user_info_table (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            sqlresult = await call_sql(sql);
            sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
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
        
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${singin_data.email}';`; // haven't finshed checking email
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
        let encrypted_token = req.headers.authorization;
        let jwt_token = check_jwt(encrypted_token);
        if (jwt_token == 1) {
            res.redirect(`/api/${process.env["API_VERSION"]}/user/signup`);
        } else if (jwt_token == 2) {
            res.redirect(`/api/${process.env["API_VERSION"]}/user/signup`);
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
            let sqlresponse = await call_sql(sql);
            if (sqlresponse) {
                console.log('Email has been registered!'); // ready to redirect 
            } else {
                sql = `INSERT INTO stylish.user_info_table (name, email) VALUES ('${jwt_token.name}', '${jwt_token.email}');`;
                sqlresult = await call_sql(sql);
                console.log('Rigister success!'); // ready to redirect
            }
        } 
        save_userInfo();
    } 
    console.log('in profile')
    
    res.send(JSON.stringify(response_result));
})

// -- w2p1 and w2p2
app.get('/admin/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/order/checkoutPrime', (req, res) => { // for test
    console.log(req.body);
})

app.post(`/api/${process.env["API_VERSION"]}/order/checkout`, (req, res) => {
    let encrypted_token = req.headers.authorization;
    let check_jwt_status = check_jwt(encrypted_token);
    if (check_jwt_status == 1) {
        res.redirect(`/api/${process.env["API_VERSION"]}/user/signup`);
    } else if (check_jwt_status == 2) {
        res.redirect(`/api/${process.env["API_VERSION"]}/user/signup`);
    }

    let order_data = {};
    if (typeof(req.body) == 'object') {
        // from postman
        order_data = req.body;
    } else {
        // from front-end
        order_data = JSON.parse(req.body);
    }

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
        let result = await db_setInsert(order_sql, orderInfo); // INSERT INTO order_table
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
            let result = await db_setInsert(order_sql, orderListInfo); // INSERT INTO order_list_table
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
                let update_paid = call_sql(update_paid_sql);
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

// 設置port:3000的server
app.listen(3000, () => {
    console.log('running...');
}); 