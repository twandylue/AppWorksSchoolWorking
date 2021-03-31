// AppWoeksSchool w0p3
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
// const dotenv = require('dotenv').config();
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});
const multer = require('multer');
const { resolve } = require('path');
const { debugPort } = require('process');
const { toASCII } = require('punycode');
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

const app = express();

app.use(express.static('public')); 
// app.use('/static',express.static('public'));

// 因為此處req主要來自html(url方法)，故使用urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug'); 

const db = mysql.createConnection({
    host     : process.env["DB_HOST"],
    user     : process.env["DB_USER"],
    password : process.env["DB_PASSWORD"],
    database : process.env["DB_DATABASE"],
})

// Connect test
db.connect((err) =>{
    if(err) throw err;
    console.log('mySQL connected!');
})

function make_sql(sql_check, sql) { 
    let sql_next = new Promise(function(resolve, reject) {
        db.query(sql_check, (err, result) => {
            if (err) throw err;
            if (result.length) {
                let letter = sql_check.split(' '); 
                resolve(`<h2>${letter[letter.length-3]} is duplicated! Please refill the upload sheet.</h2>`); 
            } else {
                db.query(sql, (err, result)=>{
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

function make_multi_sql(sql_check, multi_sql) {
    let sql_next = new Promise(function(resolve, reject) {
        db.query(sql_check, (err, result) => {
            if (err) throw err;
            if (result.length) {
                db.query(multi_sql, (err, result) => {
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

function dbsql(sql) {
    let db_result = new Promise((resolve,reject) => {
        db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);
        })
    })
    return db_result;
}

async function upload_main(upload_var) {
    if (upload_var.id && upload_var.catagory && upload_var.title && upload_var.description && upload_var.price && upload_var.texture && upload_var.wash && upload_var.place && upload_var.note && upload_var.story && upload_var.image_files.main_image) {
        // 上方判斷氏可補上sizes(optional)
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let sql_product_table = `INSERT INTO product_table (id, catagory, title, description, price, texture, wash, place, note, story, sizes, main_image) VALUES ('${upload_var.id}', '${upload_var.catagory}', '${upload_var.title}', '${upload_var.description}', '${upload_var.price}', '${upload_var.texture}', '${upload_var.wash}', '${upload_var.place}', '${upload_var.note}', '${upload_var.story}', '${upload_var.sizes}', '${upload_var.image_files.main_image[0]['path']}');`; 
        let product = await make_sql(sql_check_product_table, sql_product_table);
        // console.log(product);
        // console.log(typeof(product))
        console.log("Update product.");
    } 
    if (upload_var.name && upload_var.code) {
        let sql_check_colors = `SELECT * FROM colors WHERE code = '${upload_var.code}'`;
        let sql_colors = `INSERT INTO colors (name, code) VALUES ('${upload_var.name}', '${upload_var.code}');`;
        let colors = await make_sql(sql_check_colors, sql_colors);
        // console.log(colors);
        // console.log(typeof(colors))     
        console.log('Updata colors.');
    }
    if (upload_var.id && upload_var.image_files.images) {  
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insert_images = `INSERT INTO images VALUES `; 
        for (let i = 0; i<upload_var.image_files.images.length-1; i++) {
            insert_images += `('${upload_var.id}', '${upload_var.image_files.images[i]['path']}'),`; 
        }
        insert_images += `('${upload_var.id}', '${upload_var.image_files.images[upload_var.image_files.images.length-1]['path']}');`;
        let images = await make_multi_sql(sql_check_product_table, insert_images);
        // console.log(images); 
        console.log('Updata images.');
    } 
    if (upload_var.id && upload_var.variant[0].id && upload_var.variant[0].color_code && upload_var.variant[0].size && upload_var.variant[0].stock !== null) {
        let sql_check_product_table = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
        let insert_variant = `INSERT INTO stock VALUES `; 
        for (let i = 0; i<upload_var.variant.length-1; i++) {
            insert_variant += `('${upload_var.variant[i].id}', '${upload_var.variant[i].color_code}', '${upload_var.variant[i].size}', '${upload_var.variant[i].stock}'),`; 
        }
        insert_variant += `('${upload_var.variant[upload_var.variant.length-1].id}', '${upload_var.variant[upload_var.variant.length-1].color_code}', '${upload_var.variant[upload_var.variant.length-1].size}', '${upload_var.variant[upload_var.variant.length-1].stock}');`;   
        let stock = await make_multi_sql(sql_check_product_table, insert_variant); 
        console.log('Updata stock.');
        // console.log(stock); 
    } else {
        // res.render(warning);
    }
    console.log('-----')
}

async function query_main(query_catagory, query_page) {
    let total_pages = 0;
    if(query_page) {
        let sql_count = `SELECT Count(*) FROM stylish.product_table WHERE catagory = '${query_catagory}';`;
        let sql_totalnumber = await dbsql(sql_count);
        total_pages = parseInt(sql_totalnumber[0]['Count(*)']/6);
        let sqlData_start = (query_page)*6;
        let pages_gqp = 6;
        sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}' LIMIT ${sqlData_start} , ${pages_gqp};`;
    } else if (query_catagory === 'all') {
        sql_select = `SELECT * FROM product_table;`;
    } else {
        sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}';`;
        // console.log(sql_select);
    }

    let product_list = await dbsql(sql_select);
    // console.log(product_list);
    for (let i = 0; i<product_list.length; i++) {
        // 每項product
        let images_arr = [];
        let sql_images = `SELECT image FROM images WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let images = await dbsql(sql_images)
        // console.log(images)
        for (let i = 0; i<images.length; i++){
            images_arr.push(images[i].image);
        }
        // console.log(images_arr); // 同個id

        let sql_stock = `SELECT color_code, size, quantity FROM stock WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let stock = await dbsql(sql_stock);
        // console.log(stock); // ok

        let ans = Object.keys(groupByKey(stock, 'color_code'));
        // console.log(ans);
        let sql_color = `SELECT * FROM colors WHERE code = `;
        for (let i = 0; i<ans.length-1; i++){
            sql_color += `'${ans[i]}' OR code =`;
        }
        sql_color += `'${ans[ans.length-1]}';`;
        // console.log(sql_color) // ok
        let colors = await dbsql(sql_color);
        // console.log(colors); // ok
        stock_size = Object.keys(groupByKey(stock, 'size'));
        product_list[i].images = images_arr
        product_list[i].variants = stock;
        product_list[i].colors = colors;
        product_list[i].sizes = stock_size;
    }
    // console.log(product_list);
    let output = {};
    output.data = product_list;

    if(query_page) {
        // 檢查是否有next page
        let next_paging = parseInt(query_page)+1;
        if (next_paging <= total_pages) {
            output.next_paging = next_paging;
            return output;
        }
    }
    return output;
}

async function query_main_2(sql_select, sql_count, query_catagory, query_page) {
    let total_pages = 0;
    if (query_page == null) {
        query_page = '0';
    }
    let sql_totalnumber = await dbsql(sql_count);
    total_pages = parseInt(sql_totalnumber[0]['Count(*)']/6);
    let sqlData_start = (query_page)*6;
    let pages_gqp = 6;
    sql_select = sql_select + ` LIMIT ${sqlData_start} , ${pages_gqp};`;
    // console.log(sql_select);

    let product_list = await dbsql(sql_select);
    // console.log(product_list);
    for (let i = 0; i<product_list.length; i++) {
        // 每項product
        let images_arr = [];
        let sql_images = `SELECT image FROM images WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let images = await dbsql(sql_images)
        // console.log(images)
        for (let i = 0; i<images.length; i++){
            images_arr.push(images[i].image);
        }
        // console.log(images_arr); // 同個id

        let sql_stock = `SELECT color_code, size, quantity FROM stock WHERE product_id = ${parseInt(product_list[i]['id'])};`;
        let stock = await dbsql(sql_stock);
        // console.log(stock); // ok

        let ans = Object.keys(groupByKey(stock, 'color_code'));
        // console.log(ans);
        let sql_color = `SELECT * FROM colors WHERE code = `;
        for (let i = 0; i<ans.length-1; i++){
            sql_color += `'${ans[i]}' OR code =`;
        }
        sql_color += `'${ans[ans.length-1]}';`;
        // console.log(sql_color) // ok
        let colors = await dbsql(sql_color);
        // console.log(colors); // ok
        stock_size = Object.keys(groupByKey(stock, 'size'));
        product_list[i].images = images_arr
        product_list[i].variants = stock;
        product_list[i].colors = colors;
        product_list[i].sizes = stock_size;
    }
    // console.log(product_list);
    let output = {};
    output.data = product_list;

    if(query_page) {
        // 檢查是否有next page
        let next_paging = parseInt(query_page)+1;
        if (next_paging <= total_pages) {
            output.next_paging = next_paging;
            return output;
        }
    }
    return output;
}

app.get('/', (req, res) => {
    res.send("Connect to EC2!");
})

let fields = [{name: 'main_image', maxCount: 1}, {name: 'images', maxCount: 3}];
app.post('/admin/upload', upload.fields(fields), (req, res) => {
    const id = parseInt(req.body.id);
    const price = parseInt(req.body.price);
    const {catagory, title, description, texture, wash, place, note, story, sizes, name, code, color_code, size, stock} = req.body;
    const {color_code_1, color_code_2, color_code_3, size_1, size_2, size_3, stock_1, stock_2, stock_3} = req.body;

    class variants {
        constructor(id, color_code, size, stock){
            this.id = parseInt(id);
            this.color_code = color_code;
            this.size = size;
            this.stock = parseInt(stock);
        }
    }

    let variant = [];
    variant[0] = new variants(id, color_code_1, size_1, stock_1);
    variant[1] = new variants(id, color_code_2, size_2, stock_2); 
    variant[2] = new variants(id, color_code_3, size_3, stock_3);

    let upload_var = {id: id, price: price, catagory: catagory, title: title, description: description, texture: texture, wash: wash, place: place, note: note, story: story, sizes: sizes, name: name, code: code, color_code: color_code, size: size, variant: variant, image_files: req.files};

    upload_main(upload_var).then(() => {
        res.render('info'); 
    })
})

app.get(`/api/${process.env["API_VERSION"]}/products/all`, (req, res) => {
    let query_catagory = 'all';
    let query_page = req.query.paging;
    let sql_select = `SELECT * FROM product_table`;
    let sql_count = `SELECT Count(*) FROM product_table;`;
    query_main_2(sql_select, sql_count, query_catagory, query_page).then((result) => {
        res.send(result);
    });
})

app.get(`/api/${process.env["API_VERSION"]}/products/women`, (req, res) => {
    let query_catagory = 'women';
    let query_page = req.query.paging;
    let sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}'`;
    let sql_count = `SELECT Count(*) FROM product_table WHERE catagory = '${query_catagory}'`;
    query_main_2(sql_select, sql_count, query_catagory, query_page).then((result) => {
        res.send(result);
    });
})

app.get(`/api/${process.env["API_VERSION"]}/products/accessories`, (req, res) => {
    let query_catagory = 'accessories';
    let query_page = req.query.paging;
    let sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}'`;
    let sql_count = `SELECT Count(*) FROM product_table WHERE catagory = '${query_catagory}'`;
    query_main_2(sql_select, sql_count, query_catagory, query_page).then((result) => {
        res.send(result);
    });
})

app.get(`/api/${process.env["API_VERSION"]}/products/men`, (req, res) => {
    let query_catagory = 'men';
    let query_page = req.query.paging;
    // console.log(query_page)
    let sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}'`;
    let sql_count = `SELECT Count(*) FROM product_table WHERE catagory = '${query_catagory}'`;
    query_main_2(sql_select, sql_count, query_catagory, query_page).then((result) => {
        res.send(result);
    });
    // query_main(query_catagory, query_page).then(result => {
    //     res.send(result);
    // })
})

app.get('/admin/product.html', (req, res) => {
    res.render('product'); 
})

// ---w1p2
app.get(`/api/${process.env["API_VERSION"]}/products/search`, (req, res) => {
    let keyword = req.query.keyword;
    let query_page = req.query.paging;
    let sql_select = `SELECT * FROM product_table WHERE title LIKE '%${keyword}%'`;
    let sql_count = `SELECT Count(*) FROM product_table WHERE title LIKE '%${keyword}%'`;
    query_main_2(sql_select, sql_count, keyword, query_page).then((result) => {
        res.send(result);
    })
})

app.listen(3000, () => {console.log('running...')});