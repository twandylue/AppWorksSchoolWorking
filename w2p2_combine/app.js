// AppWoeksSchool w2p2 combine
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TapPay = require('tappay-nodejs');
const request = require('request');
const multer = require('multer');
const { resolve } = require('path');
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'pug'); 

// set storage engine
const storage_eng = multer.diskStorage({ 
    // destination為保留字
    destination: './public/upload_pics/',
    filename: function(req, file, callback){
        // callback(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    } 
})

// input upload
const upload = multer({
    storage: storage_eng
})

// set DB function (global function)
function db_connection() {
    const db = mysql.createConnection({
        host     : process.env["DB_HOST"],
        user     : process.env["DB_USER"],
        password : process.env["DB_PASSWORD"],
        database : process.env["DB_DATABASE"],
    });
    // MySQL Connect test
    db.connect((err) => {
        if (err) throw err;
        console.log("MySQL connected!");
    });
    return db;
}
app.set("db", new db_connection);

// ===set product api router===
// w1p1 w1p2 and w1p5
const api_router_

// w1p3 and w1p4
const api_route_sign = require("./router/sign").router;
app.use(`/api/${process.env['API_VERSION']}`, api_route_sign); 
// w2p2 checkout
const api_route_checkout = require("./router/checkout").router;
app.use(`/api/${process.env['API_VERSION']}`, api_route_checkout);

// ===provide html===
// w2p1 checkout.html
app.get('/admin/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/checkout.html')); // __dirname有問題 還未更正
})

// ===for test===
app.get('/', (req, res) => {
    res.send('<h1>Hello, My Server!</h1>');
});

app.get('/test', (req, res) => {
    // check_jwt('test'); // return null
    // check_jwt('headers 123456');
})

// 設置port:3000的server
app.listen(3000, () => {
    console.log('running...');
}); 