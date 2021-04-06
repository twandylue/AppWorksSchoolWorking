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
// w0p3
const api_router_products_upload = require("./router/products_upload").router;
// app.use(`/api/${process.env['API_VERSION']}`, api_router_products_upload);
app.use(api_router_products_upload);
// w1p1
const api_router_products_all = require("./router/products_all").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_all);
const api_router_products_men = require("./router/products_men").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_men);
const api_router_products_women = require("./router/products_women").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_women);
const api_router_products_accessories = require("./router/products_accessories").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_accessories);
// w1p2
const api_router_products_search = require("./router/products_search").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_search);
const api_router_products_details = require("./router/products_details").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_products_details);
// w1p5
const api_router_campaign = require("./router/campaign").router;
app.use(`/api/${process.env['API_VERSION']}`, api_router_campaign);
// w1p3 and w1p4
const api_route_sign = require("./router/sign").router;
app.use(`/api/${process.env['API_VERSION']}`, api_route_sign); 
// w2p2 checkout
const api_route_checkout = require("./router/checkout").router;
app.use(`/api/${process.env['API_VERSION']}`, api_route_checkout);

// ===provide html or pug===
// w0p3 products upload form
app.get('/admin/product.html', (req, res) => {
    res.render('product'); 
})
// w1p5 campaign
app.get(`/admin/campaign.html`, (req, res) => {
    // console.log('check campaign_upload_page'); // check Arthur robot.
    res.render('campaign_upload_page');
})
// w2p1 checkout.html
app.get('/admin/checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/checkout.html')); // __dirname有問題 還未更正
})

// ===response message===
app.get('/response-message/products-upload-success', (req, res) => {
    res.render('info_products'); 
});
app.get('/response-message/campaign-upload-success', (req, res) => {
    res.render('info_campaign'); 
});

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