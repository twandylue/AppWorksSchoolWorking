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
        // eslint-disable-next-line no-console
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

// w1p3 and w1p4
const apiRouteSign = require("./router/sign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteSign);

// w1p5
const apiRouterCampaign = require("./router/campaign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterCampaign);
const apiRouterCampaignUpload = require("./router/campaign_upload").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterCampaignUpload);

// w2p2 checkout
const apiRouteCheckout = require("./router/checkout").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteCheckout);

// ===provide html or pug===
//= ===================================?????????
// w0p3 products upload form
app.get("/admin/product.html", (req, res) => {
    // res.render("product");
    const encryptedToken = req.headers.authorization;
    const JWTtoken = checkJWT(encryptedToken);
    if (JWTtoken.userType === "admin") {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/product_upload.html"));
    } else {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/checkUserTypeProduct.html"));
    }
});
//= ====================================?????????

// w1p4 signin and signup
app.get("/admin/sign.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/sign.html"));
});

//= ===================================?????????
// w1p5 campaign upload form
app.get("/admin/campaign.html", (req, res) => {
    // console.log('check campaign_upload_page'); // check Arthur robot.
    // res.render("campaign_upload_page");
    const encryptedToken = req.headers.authorization;
    const JWTtoken = checkJWT(encryptedToken);
    if (JWTtoken.userType === "admin") {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/campaign_upload.html"));
    } else {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/checkUserTypeCampaign.html"));
    }
});
//= ===================================?????????

// w2p1 checkout.html
app.get("/admin/checkout.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/checkout.html")); // __dirname????????? ????????????
});

// w2p3 index.html
app.get(["/", "/index.html"], (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// w2p4 product.html
app.get("/product.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/pruduct.html"));
});

// w2p5 cart.html
app.get("/cart.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/cart.html"));
});

// w2p5 thankyou.html
app.get("/thankyou.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/thankyou.html"));
});

// w2p5 member.html
app.get("/member.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/member.html"));
});

// w2p5 profile.html for robot checkout
app.get("/profile.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/member.html"));
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
    res.send("1");
});

// ??????port:3000???server
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("running...");
});

const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_KEY;
function checkJWT (encryptedToken) {
    if (encryptedToken === undefined) {
        return (0);
    }
    encryptedToken = encryptedToken.split(" ")[1];

    const decryptJWT = jwt.decode(encryptedToken, secretkey);
    if (decryptJWT) {
        return (decryptJWT);
    } else if (decryptJWT === null) {
        console.log("Token is wrong");
        return (1);
    } else if (Date.now() > decryptJWT.exp * 1000) {
        console.log("Token expired!");
        return (2);
    }
}
