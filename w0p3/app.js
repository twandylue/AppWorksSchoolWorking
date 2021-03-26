// AppWoeksSchool w0p3
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
// const dotenv = require('dotenv').config();
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});
const app = express();

app.use(express.static('public')); 
// app.use('/static',express.static('public'));

// 因為此處req主要來自html(url方法)，故使用urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug'); 

// const db = mysql.createConnection({
//     host     : '127.0.0.1',
//     user     : 'root',
//     password : 'laserlue0308',
//     database : 'assignment' 
// })

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
    console.log('MySql connected!');
    db.query( "SELECT * FROM colors_table;", function (err, result) {
        if(err) {
            throw err;
        }
        console.log('Connect to colors_table.');
        // console.log(result[0]);
        // console.log(typeof result);
        // console.dir(result);
        // console.log(typeof body);
      });
})

// test
// Create DB
// app.get('/createdb', (req, res)=>{
//     let sql = 'CREATE DATABASE my_db';
//     db.query(sql, (err, result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send('Database created...');
//     })
// })

app.post('/admin/upload', (req, res) => {
    // let id = req.body.id;
    let {id} = req.body;
    let {title} = req.body;
    let {description} = req.body;
    let {price} = req.body;
    let {texture} = req.body;
    let {wash} = req.body;
    let {place} = req.body;
    let {note} = req.body;
    let {story} = req.body;
    let {sizes} = req.body;

    // for colors
    let {name} = req.body;
    let {code} = req.body;

    // for variant
    // let {variants} = req.body;
    let {color_code} = req.body;
    let {size} = req.body;
    let {stock} = req.body;

    // 還有問題
    let {main_image} = req.body;
    let {images} = req.body;
    // ----------------
    
    let sql = `SELECT * from products_table;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        // 決定table後再處理
        let sql = `INSERT INTO products_table (id, title, description, price, texture, wash, place, note, story, sizes, main_image, images) VALUES ('${id}', '${title}', '${description}', '${price}', '${texture}', '${wash}', '${place}', '${note}', '${story}', '${sizes}', '${main_image}', '${images}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })

        // if (result[0]) {
        //     // 已經有email註冊資料
        //     res.render('homepage',{message: 'Email has been used!'});
        //     // console.log(result[0]); // test
        // } else {
        //     let sql = `INSERT INTO user (email, password) VALUES ('${email}', '${password}');`;
        //     db.query(sql, (err, result) => {
        //         if (err) throw err;

        //     })
        // }
    })

    // let sql = `SELECT * from colors_table;`
    sql = `SELECT * from colors_table;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `INSERT INTO colors_table (color_name, color_code) VALUES ('${name}', '${code}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })
    })

    // let sql = `SELECT * from variants_table;`
    sql = `SELECT * from variants_table;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `INSERT INTO variants_table (product_id, color_code_INDEX, size, stock) VALUES ('${id}', '${color_code}', '${size}', '${stock}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })
    })

    res.render('info',{message: 'update successes'});
})

// app.post('/sign_in', (req, res) => {
//     let {email} = req.body;
//     let {password} = req.body;
//     let sql = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}';`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         if (result[0] == undefined) {
//             // console.log(result[0]);
//             res.render('homepage',{message: 'Email or Password is wrong!'});
//         } else {
//             res.redirect('/member');
//             // res.send(result);
//         }
//     })
//     // console.log('test_signin');
// })

// app.post('/sign_up', (req, res) => {
//     let {email} = req.body;
//     let {password} = req.body;
//     let sql = `SELECT * from user WHERE email='${email}';`
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         if (result[0]) {
//             // 已經有email註冊資料
//             res.render('homepage',{message: 'Email has been used!'});
//             // console.log(result[0]); // test
//         } else {
//             let sql = `INSERT INTO user (email, password) VALUES ('${email}', '${password}');`;
//             db.query(sql, (err, result) => {
//                 if (err) throw err;
//                 res.redirect('/member');
//             })
//         }
//     })
//     // console.log('test_signup');
// })

app.get('/admin/product.html', (req, res) => {
    res.render('product');
    // res.sendFile('product.html'); //還不確定
})

// app.get('/member', (req, res) => {
//     // res.send("<h2>Log In Success!</h2>");
//     res.render('welcome');
// })

// 額外功能
// 查詢所有products
app.get('/allproducts', (req, res) => {
    let sql = 'SELECT * FROM user'
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.send(result);
        }
    })
})

// 額外功能
// 創建table
// app.get('/createTable', (req, res) => {
//     let sql = 'CREATE TABLE user(id int(10) NOT NULL AUTO_INCREMENT, email char(50), password char(50), PRIMARY KEY (`id`));'
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err;
//         } else {
//             // console.log(result);
//             // res.send(result);
//             res.send('<h2>Creating table success!</h2>');
//         }
//     })
// })

// app.listen(3000, () => {console.log('running at port: 3000')});
app.listen(3000, () => {console.log('running...')});