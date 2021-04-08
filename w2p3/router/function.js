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

// for w0p3
async function upload_main(req, upload_var) {
    if (upload_var.id && upload_var.catagory && upload_var.title && upload_var.description && upload_var.price && upload_var.texture && upload_var.wash && upload_var.place && upload_var.note && upload_var.story && upload_var.image_files.main_image) {
        // 上方判斷氏可補上sizes(optional)
        // insert product
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let sql_product_table = `INSERT INTO product_table (id, catagory, title, description, price, texture, wash, place, note, story, sizes, main_image) VALUES ('${upload_var.id}', '${upload_var.catagory}', '${upload_var.title}', '${upload_var.description}', '${upload_var.price}', '${upload_var.texture}', '${upload_var.wash}', '${upload_var.place}', '${upload_var.note}', '${upload_var.story}', '${upload_var.sizes}', '${image_url(upload_var.image_files.main_image[0]['path'])}');`; 
        let product = await make_sql(req, sql_check_product_table, sql_product_table);
        console.log("Update product.");
    } 
    if (upload_var.name && upload_var.code) {
        // insert color
        let sql_check_colors = `SELECT * FROM colors WHERE code = '${upload_var.code}'`;
        let sql_colors = `INSERT INTO colors (name, code) VALUES ('${upload_var.name}', '${upload_var.code}');`;
        let colors = await make_sql(req, sql_check_colors, sql_colors);    
        console.log('Updata colors.');
    }
    if (upload_var.id && upload_var.image_files.images) {  
        // insert images
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insert_images = `INSERT INTO images VALUES `; 
        for (let i = 0; i<upload_var.image_files.images.length-1; i++) {
            insert_images += `('${upload_var.id}', '${image_url(upload_var.image_files.images[i]['path'])}'),`; 
        }
        insert_images += `('${upload_var.id}', '${image_url(upload_var.image_files.images[upload_var.image_files.images.length-1]['path'])}');`;
        let images = await make_multi_sql(req, sql_check_product_table, insert_images);
        console.log('Updata images.');
    } 
    if (upload_var.id && upload_var.variant[0].id && upload_var.variant[0].color_code && upload_var.variant[0].size && upload_var.variant[0].stock !== null) {
        // insert variants
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insert_variant = `INSERT INTO stock VALUES `; 
        for (let i = 0; i<upload_var.variant.length-1; i++) {
            insert_variant += `('${upload_var.variant[i].id}', '${upload_var.variant[i].color_code}', '${upload_var.variant[i].size}', '${upload_var.variant[i].stock}'),`; 
        }
        insert_variant += `('${upload_var.variant[upload_var.variant.length-1].id}', '${upload_var.variant[upload_var.variant.length-1].color_code}', '${upload_var.variant[upload_var.variant.length-1].size}', '${upload_var.variant[upload_var.variant.length-1].stock}');`;   
        let stock = await make_multi_sql(req, sql_check_product_table, insert_variant); 
        console.log('Updata stock.');
    } else {
        // res.render(warning);
    }
    console.log('-----')
}

async function query_main(req, sql_select, sql_count, query_page) {
    let total_pages = 0;
    let sql_totalcount = 0;
    let pages_gqp = 6;

    if (query_page == null) {
        query_page = '0';
    }
    if (sql_count !== 'none') {
        let sql_totalnumber = await dbsql(req, sql_count);
        sql_totalcount = parseInt(sql_totalnumber[0]['Count(*)']); 
        total_pages = sql_totalcount/pages_gqp;
        let sqlData_start = (query_page)*pages_gqp;
        sql_select = sql_select + ` LIMIT ${sqlData_start} , ${pages_gqp};`;
        // console.log(sql_select);
    }

    let product_list = await dbsql(req, sql_select);
    // console.log(product_list);
    for (let i = 0; i<product_list.length; i++) {
        // 每項product
        let images_arr = [];
        let sql_images = `SELECT image FROM images WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let images = await dbsql(req, sql_images)
        // console.log(images)
        for (let i = 0; i<images.length; i++){
            images_arr.push(images[i].image);
        }
        // console.log(images_arr); // 同個id

        let sql_stock = `SELECT color_code, size, stock FROM stock WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let stock = await dbsql(req, sql_stock);
        // console.log(stock); // ok

        let ans = Object.keys(groupByKey(stock, 'color_code'));
        // console.log(ans);
        let sql_color = `SELECT * FROM colors WHERE code = `;
        for (let i = 0; i<ans.length-1; i++){
            sql_color += `'${ans[i]}' OR code =`;
        }
        sql_color += `'${ans[ans.length-1]}';`;
        // console.log(sql_color) // ok
        let colors = await dbsql(req, sql_color);
        // console.log(colors); // ok
        stock_size = Object.keys(groupByKey(stock, 'size'));
        product_list[i].images = images_arr
        product_list[i].variants = stock;
        product_list[i].colors = colors;
        product_list[i].sizes = stock_size;
    }
    // console.log(product_list);
    let output = {};
    if (sql_count !== 'none') {
        output.data = product_list;
        let next_paging = parseInt(query_page)+1;
        if (next_paging > total_pages || sql_totalcount/((query_page+1)*pages_gqp) == 1) {
            return output;
        }
        output.next_paging = next_paging;
        return output;
    } else {
        output.data = product_list[0];
        return output;
    }
}

// for w0p3
function make_sql(req, sql_check, sql) { 
    let sql_next = new Promise(function(resolve, reject) {
        req.app.get("db").query(sql_check, (err, result) => {
            if (err) throw err;
            if (result.length) {
                let letter = sql_check.split(' '); 
                resolve(`<h2>${letter[letter.length-3]} is duplicated! Please refill the upload sheet.</h2>`); 
            } else {
                req.app.get("db").query(sql, (err, result)=>{
                    if (err) throw err;
                    if (result) {
                        resolve(1); 
                    }
                })
            }
        })
    });
    return sql_next;
}

function make_multi_sql(req, sql_check, multi_sql) {
    let sql_next = new Promise(function(resolve, reject) {
        req.app.get("db").query(sql_check, (err, result) => {
            if (err) throw err;
            if (result.length) {
                req.app.get("db").query(multi_sql, (err, result) => {
                    if (err) throw err;
                    resolve(1);
                })
            } else {
                let letter = sql_check.split(' '); 
                resolve(`<h2>${letter[letter.length-3]} is not existed! Please refill the upload sheet.</h2>`);
            }
        })
    })
    return sql_next;
}

// for w1p1 and w1p2 and w1p5. 
function dbsql(req, sql) {
    let db_result = new Promise((resolve,reject) => {
        req.app.get("db").query(sql, (err, result) => {
            // if (err) throw err;
            if (err) reject(err);
            resolve(result);
        })
    })
    return db_result;
}

// for w1p1 and w1p2 and w1p5. Find multi element in array(input).
function groupByKey(input, index) {
    // input is object
    let ans = {};
    for (let i = 0; i<input.length; i++) {
        if (ans[input[i][`${index}`]] >= 0) {
            ans[input[i][`${index}`]] += 1;
            continue;
        } else {
            ans[input[i][`${index}`]] = 1;
        }
    }
    return(ans);
}

// for w1p1 and w1p2 and w1p5. Recombine image url.
function image_url(url) {
    let str = url.split('\\')
    let new_str = '';
    new_str = `${str[1]}`+'\\\\'+`${str[2]}`;
    return new_str
}

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
    upload_main: upload_main,
    query_main: query_main,
    dbsql: dbsql,
    groupByKey: groupByKey,
    image_url: image_url,
    call_sql: call_sql, 
    db_setInsert: db_setInsert, 
    responseConsist: responseConsist, 
    create_jwt: create_jwt,
    check_jwt: check_jwt,
    sendRequest: sendRequest
}; 