// functions
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const request = require("request");

// Router setting
const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static("public")); // 可能會有問題

// for w0p3
// eslint-disable-next-line camelcase
async function uploadMain (req, upload_var) {
    if (upload_var.id && upload_var.catagory && upload_var.title && upload_var.description && upload_var.price && upload_var.texture && upload_var.wash && upload_var.place && upload_var.note && upload_var.story && upload_var.sizes && upload_var.image_files.main_image) {
        // 上方判斷氏可補上sizes(optional)
        // insert product
        const sqlCheckProductTable = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        const sqlProductTable = `INSERT INTO product_table (id, catagory, title, description, price, texture, wash, place, note, story, sizes, main_image) VALUES ('${upload_var.id}', '${upload_var.catagory}', '${upload_var.title}', '${upload_var.description}', '${upload_var.price}', '${upload_var.texture}', '${upload_var.wash}', '${upload_var.place}', '${upload_var.note}', '${upload_var.story}', '${upload_var.sizes}', '${imageURL(upload_var.image_files.main_image[0].path)}');`;
        // eslint-disable-next-line no-unused-vars
        const product = await makeSQL(req, sqlCheckProductTable, sqlProductTable);
        console.log("Update product.");
    }
    if (upload_var.name && upload_var.code) {
        // insert color
        const sqlCheckColors = `SELECT * FROM colors WHERE code = '${upload_var.code}'`;
        const sqlColors = `INSERT INTO colors (name, code) VALUES ('${upload_var.name}', '${upload_var.code}');`;
        // eslint-disable-next-line no-unused-vars
        const colors = await makeSQL(req, sqlCheckColors, sqlColors);
        console.log("Updata colors.");
    }
    if (upload_var.id && upload_var.image_files.images) {
        // insert images
        const sqlCheckProductTable = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insertImages = "INSERT INTO images VALUES ";
        for (let i = 0; i < upload_var.image_files.images.length - 1; i++) {
            insertImages += `('${upload_var.id}', '${imageURL(upload_var.image_files.images[i].path)}'),`;
        }
        insertImages += `('${upload_var.id}', '${imageURL(upload_var.image_files.images[upload_var.image_files.images.length - 1].path)}');`;
        // eslint-disable-next-line no-unused-vars
        const images = await makeMultiSQL(req, sqlCheckProductTable, insertImages);
        console.log("Updata images.");
    }
    if (upload_var.id && upload_var.variant[0].id && upload_var.variant[0].color_code && upload_var.variant[0].size && upload_var.variant[0].stock !== null) {
        // insert variants
        const sqlCheckProductTable = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insertVariant = "INSERT INTO stock VALUES ";
        for (let i = 0; i < upload_var.variant.length - 1; i++) {
            insertVariant += `('${upload_var.variant[i].id}', '${upload_var.variant[i].color_code}', '${upload_var.variant[i].size}', '${upload_var.variant[i].stock}'),`;
        }
        insertVariant += `('${upload_var.variant[upload_var.variant.length - 1].id}', '${upload_var.variant[upload_var.variant.length - 1].color_code}', '${upload_var.variant[upload_var.variant.length - 1].size}', '${upload_var.variant[upload_var.variant.length - 1].stock}');`;
        // eslint-disable-next-line no-unused-vars
        const stock = await makeMultiSQL(req, sqlCheckProductTable, insertVariant);
        console.log("Updata stock.");
    } else {
        // res.render(warning);
    }
    console.log("-----");
}

async function queryMain (req, sqlSelect, sqlCount, queryPage) {
    let totalPages = 0;
    let sqlTotalcount = 0;
    const pagesGap = 6;

    if (queryPage == null) {
        queryPage = "0";
    }
    if (sqlCount !== "none") {
        const sqlTotalnumber = await dbsql(req, sqlCount);
        sqlTotalcount = parseInt(sqlTotalnumber[0]["Count(*)"]);
        totalPages = sqlTotalcount / pagesGap;
        const sqlDataStart = (queryPage) * pagesGap;
        sqlSelect = sqlSelect + ` LIMIT ${sqlDataStart} , ${pagesGap};`;
        // console.log(sqlSelect);
    }

    const productList = await dbsql(req, sqlSelect);
    // console.log(productList);
    for (let i = 0; i < productList.length; i++) {
        // 每項product
        const imagesArr = [];
        const sqlImages = `SELECT image FROM images WHERE product_id = ${parseInt(productList[i].id)};`;
        const images = await dbsql(req, sqlImages);
        // console.log(images)
        for (let i = 0; i < images.length; i++) {
            imagesArr.push(images[i].image);
        }
        // console.log(imagesArr); // 同個id

        const sqlStock = `SELECT color_code, size, stock FROM stock WHERE product_id = ${parseInt(productList[i].id)};`;
        const stock = await dbsql(req, sqlStock);
        // console.log(stock); // ok

        const ans = Object.keys(groupByKey(stock, "color_code"));
        // console.log(ans);
        let sqlColor = "SELECT * FROM colors WHERE code = ";
        for (let i = 0; i < ans.length - 1; i++) {
            sqlColor += `'${ans[i]}' OR code =`;
        }
        sqlColor += `'${ans[ans.length - 1]}';`;
        // console.log(sqlColor) // ok
        const colors = await dbsql(req, sqlColor);
        // console.log(colors); // ok
        const stockSize = Object.keys(groupByKey(stock, "size"));
        productList[i].images = imagesArr;
        productList[i].variants = stock;
        productList[i].colors = colors;
        productList[i].sizes = stockSize;
    }
    // console.log(productList);
    const output = {};
    if (sqlCount !== "none") {
        output.data = productList;
        const nextPaging = parseInt(queryPage) + 1;
        if (nextPaging > totalPages || sqlTotalcount / ((queryPage + 1) * pagesGap) === 1) {
            return output;
        }
        output.next_paging = nextPaging;
        return output;
    } else {
        output.data = productList[0];
        return output;
    }
}

// for w0p3
function makeSQL (req, sqlCheck, sql) {
    const sqlReturn = new Promise(function (resolve, reject) {
        req.app.get("db").query(sqlCheck, (err, result) => {
            if (err) throw err;
            if (result.length) {
                const letter = sqlCheck.split(" ");
                resolve(`<h2>${letter[letter.length - 3]} is duplicated! Please refill the upload sheet.</h2>`);
            } else {
                req.app.get("db").query(sql, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        resolve(1);
                    }
                });
            }
        });
    });
    return sqlReturn;
}

function makeMultiSQL (req, sqlCheck, multiSQL) {
    const sqlReturn = new Promise(function (resolve, reject) {
        req.app.get("db").query(sqlCheck, (err, result) => {
            if (err) throw err;
            if (result.length) {
                req.app.get("db").query(multiSQL, (err, result) => {
                    if (err) throw err;
                    resolve(1);
                });
            } else {
                const letter = sqlCheck.split(" ");
                resolve(`<h2>${letter[letter.length - 3]} is not existed! Please refill the upload sheet.</h2>`);
            }
        });
    });
    return sqlReturn;
}

// for w1p1 and w1p2 and w1p5.
function dbsql (req, sql) {
    const dbReturn = new Promise((resolve, reject) => {
        req.app.get("db").query(sql, (err, result) => {
            // if (err) throw err;
            if (err) reject(err);
            resolve(result);
        });
    });
    return dbReturn;
}

// for w1p1 and w1p2 and w1p5. Find multi element in array(input).
function groupByKey (input, index) {
    // input is object
    const ans = {};
    for (let i = 0; i < input.length; i++) {
        if (ans[input[i][`${index}`]] >= 0) {
            ans[input[i][`${index}`]] += 1;
            continue;
        } else {
            ans[input[i][`${index}`]] = 1;
        }
    }
    return (ans);
}

// for w1p1 and w1p2 and w1p5. Recombine image url.
function imageURL (url) {
    const str = url.split("\\");
    let newStr = "";
    newStr = `${str[1]}` + "\\\\" + `${str[2]}`;
    return newStr;
}

// for w1p4 to w2p2
function callSQL (req, sql) {
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
        });
    });
}

// for w2p1 and w2p2
function dbSetInsert (req, sql, info) {
    return new Promise((resolve, reject) => {
        req.app.get("db").query(sql, info, (err, result) => {
            if (err) resolve(err);
            if (result) resolve(result);
        });
    });
}

// for w1p3 and w1p4
function responseConsist (token, expire, id, provider, name, email, picture) {
    const responseResult = {};
    const data = {};
    const user = {};

    data.access_token = token;
    data.access_expired = expire;
    user.id = id;
    user.provider = provider;
    user.name = name;
    user.email = email;
    user.picture = picture;
    data.user = user;
    responseResult.data = data;
    return responseResult;
}

// for w1p4 to w2p2
const secretkey = process.env.JWT_KEY; // 全域變數 jwt key 路徑可能會有問題
// console.log(secretkey)
function createJWT (payload) {
    return new Promise((resolve, reject) => {
        const infoJWT = {};
        // let jwtToken = jwt.sign(payload, secretkey, {expiresIn: '3600'});
        const jwtToken = jwt.sign(payload, secretkey, { expiresIn: "1d" });
        infoJWT.token = jwtToken;
        // infoJWT.expired = 3600;
        infoJWT.expired = "1 day";
        resolve(infoJWT);
    });
}

function checkJWT (encryptedToken) {
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

// for w1p3 and w1p4
function sendRequest (fbTokenURL) {
    const req = new Promise((resolve, reject) => {
        // 應該要能依照provider決定request的url(不同provider) 待改進
        request(`https://graph.facebook.com/me?fields=id,name,birthday,email,picture&access_token=${fbTokenURL}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            resolve(body);
        });
    });
    return req;
}

module.exports = {
    router: router,
    uploadMain: uploadMain,
    queryMain: queryMain,
    dbsql: dbsql,
    groupByKey: groupByKey,
    imageURL: imageURL,
    callSQL: callSQL,
    dbSetInsert: dbSetInsert,
    responseConsist: responseConsist,
    createJWT: createJWT,
    checkJWT: checkJWT,
    sendRequest: sendRequest
};
