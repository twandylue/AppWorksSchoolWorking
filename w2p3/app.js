// AppWoeksSchool w2p2 combine
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "pug");

// set DB function (global function)
function DBConnection () {
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    // MySQL Connect test
    db.connect((err) => {
        if (err) throw err;
        console.log("MySQL connected!");
    });
    return db;
}
app.set("db", new DBConnection());

// ===set product api router===
// w0p3
const apiRouterProductsUpload = require("./router/products_upload").router;
// app.use(`/api/${process.env['API_VERSION']}`, apiRouterProductsUpload);
app.use(apiRouterProductsUpload);

// w1p1
const apiRouterProductsAll = require("./router/products_all").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsAll);
const apiRouterProductsMen = require("./router/products_men").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsMen);
const apiRouterProductsWomen = require("./router/products_women").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsWomen);
const apiRouterProductsAccessories = require("./router/products_accessories").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsAccessories);

// w1p2
const apiRouterProductsSearch = require("./router/products_search").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsSearch);
const apiRouterProductsDetails = require("./router/products_details").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsDetails);

// w1p5
const apiRouterCampaign = require("./router/campaign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterCampaign);

// w1p3 and w1p4
const apiRouteSign = require("./router/sign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteSign);

// w2p2 checkout
const apiRouteCheckout = require("./router/checkout").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteCheckout);

// ===provide html or pug===
// w0p3 products upload form
app.get("/admin/product.html", (req, res) => {
    res.render("product");
});
// w1p5 campaign
app.get("/admin/campaign.html", (req, res) => {
    // console.log('check campaign_upload_page'); // check Arthur robot.
    res.render("campaign_upload_page");
});
// w2p1 checkout.html
app.get("/admin/checkout.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/checkout.html")); // __dirname有問題 還未更正
});

// w2p3 index.html
app.get(["/", "/index.html"], (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// ===response message===
app.get("/response-message/products-upload-success", (req, res) => {
    res.render("info_products");
});
app.get("/response-message/campaign-upload-success", (req, res) => {
    res.render("info_campaign");
});

// ===for test===
app.get("/", (req, res) => {
    res.send("<h1>Hello, My Server!</h1>");
});

app.get("/test", (req, res) => {
    // check_jwt('test'); // return null
    // check_jwt('headers 123456');
});

// 設置port:3000的server
app.listen(3000, () => {
    console.log("running...");
});
