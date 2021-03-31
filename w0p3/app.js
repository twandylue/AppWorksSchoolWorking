// AppWoeksSchool w0p3
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
// const dotenv = require('dotenv').config();
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});
const multer = require('multer');
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
    if(err) {
        throw err;
    }
    console.log('mySQL connected!');
    // db.query( "SELECT * FROM colors;", function (err, result) {
    //     if(err) {
    //         throw err;
    //     }
    //     console.log('Connect to colors.');
    //   });
})


app.get('/', (req, res) => {
    res.send("Connect to EC2!");
})

// 需要再仔細研讀
// delayedResultPromise(4,5,3000).then(console.log) // 9 (4+5) will be shown in the console after 3 seconds

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

    function make_sql(sql_check_table, sql) { 
        let sql_next = new Promise(function(resolve, reject) {
            db.query(sql_check_table, (err, result) => {
                if (err) throw err;
                db.query(sql, (err, result)=>{
                    if (err) throw err;
                    if (result) {
                        resolve(1);
                    }
                })
            })
        });
        return sql_next;
    }
    
    function make_multi_sql(sql_check_table, multi_sql) {
        let sql_next = new Promise(function(resolve, reject) {
            db.query(sql_check_table, (err, result) => {
                if (err) throw err;
                for (let i = 0; i<multi_sql.length; i++) {
                    db.query(multi_sql[i], (err, result) => {
                        if (err) throw err;
                        if (result) {
                            resolve(1);
                        }
                    })
                }
                // console.log(multi_sql); // test
            })
        })
        return sql_next;
    }

    function index_check(sql) {
        let index_check = new Promise(function(resolve, reject){
            db.query(sql, (err, result) => {
                if (err) throw err;
                if (result.length !== 0) {
                    let letter = sql.split(' '); 
                    res.send(`<h2>${letter[letter.length-3]} is duplicated! Please refill the upload sheet.</h2>`);
                    // console.log('return -1')
                    resolve(-1);
                } 
                // console.log('return 1')
                resolve(1);
            })
        })
        return index_check
    }

    let sql_check_product_table = `SELECT * from product_table;`
    let sql_check_colors = `SELECT * from colors;`
    let sql_check_stock = `SELECT * from stock;`
    let sql_check_images = `SELECT * from images;`

    let sql_product_table = `INSERT INTO product_table (id, catagory, title, description, price, texture, wash, place, note, story, sizes, main_image) VALUES ('${id}', '${catagory}', '${title}', '${description}', '${price}', '${texture}', '${wash}', '${place}', '${note}', '${story}', '${sizes}', '${req.files.main_image[0]['path']}');`;
    let sql_colors = `INSERT INTO colors (name, code) VALUES ('${name}', '${code}');`;

    let sql_variant = [];
    let sql_images = [];
    for (let i = 0; i<variant.length; i++) {
        let sql_chunk = `INSERT INTO stock (product_id, color_code, size, quantity) VALUES ('${variant[i].id}', '${variant[i].color_code}', '${variant[i].size}', '${variant[i].stock}');`;
        sql_variant.push(sql_chunk)
    }

    for (let i = 0; i<req.files.images.length; i++) {
        let sql_chunk = `INSERT INTO images (product_id, image) VALUES ('${id}', '${req.files.images[i]['path']}');`;
        sql_images.push(sql_chunk)
    }

    let sql_check_id = `SELECT * FROM product_table WHERE id = ${id}`;
    let sql_check_colorcode = `SELECT * FROM colors WHERE code = ${code}`;
    let sql_check_colorname = `SELECT * FROM colors WHERE name = ${name}`;
    
    // if(index_check(sql_check_id) || index_check(sql_check_colorcode) || index_check(sql_check_colorname) === -1) {
    //     // console.log('test-0');
    //     // res.send('test-0');
    //     return;
    // } else {
    //     // console.log('test-1')
    //     make_sql(sql_check_product_table, sql_product_table)
    //     .then(make_sql(sql_check_colors, sql_colors))
    //     .then(make_multi_sql(sql_check_images, sql_images))
    //     .then(make_multi_sql(sql_check_stock, sql_variant))
    //     .then(res.render('info',{message: 'update successes'}));
    // }

    // 有問題 異步性
    let index_check_1 = index_check(sql_check_id);
    let index_check_2 = index_check(sql_check_colorcode);
    let index_check_3 = index_check(sql_check_colorname);
    console.log('1' + index_check_1);
    console.log('2' + index_check_2);
    console.log('3' + index_check_3);

    if(index_check_1 && index_check_2 && index_check_3 === 1) {
        console.log('test')
        make_sql(sql_check_product_table, sql_product_table)
        .then(make_sql(sql_check_colors, sql_colors))
        .then(make_multi_sql(sql_check_images, sql_images))
        .then(make_multi_sql(sql_check_stock, sql_variant))
        .then(res.render('info',{message: 'update successes'}));
        return;
    } else {
        console.log('failed')
    }

    // if(index_check(sql_check_id) && index_check(sql_check_colorcode) && index_check(sql_check_colorname) === 1) {
    //     make_sql(sql_check_product_table, sql_product_table)
    //     .then(make_sql(sql_check_colors, sql_colors))
    //     .then(make_multi_sql(sql_check_images, sql_images))
    //     .then(make_multi_sql(sql_check_stock, sql_variant))
    //     .then(res.render('info',{message: 'update successes'}));
    //     return;
    // } else {
    //     // console.log('test-1')
    // }

    // make_sql(sql_check_product_table, sql_product_table) 
    //     .then(make_sql(sql_check_colors, sql_colors))
    //     .then(make_multi_sql(sql_check_images, sql_images))
    //     .then(make_multi_sql(sql_check_stock, sql_variant))
    //     .then(res.render('info',{message: 'update successes'}));        
})

app.get('/admin/product.html', (req, res) => {
    res.render('product');
})

// app.listen(3000, () => {console.log('running at port: 3000')});
app.listen(3000, () => {console.log('running...')});