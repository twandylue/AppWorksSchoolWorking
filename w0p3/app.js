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

// const upload = multer({
//     dest: './public/upload_pics/'
// })
// const upload = multer({ dest: './pics/' });


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
    console.log('MySql connected!');
    // db.query( "SELECT * FROM colors;", function (err, result) {
    //     if(err) {
    //         throw err;
    //     }
    //     console.log('Connect to colors.');
    //   });
})

// ############### for test ############### 
// app.get('/for_test', (req, res) => {
//     res.render('for_test');
// })
// app.post('/upload_main_img', upload.single('myImage'), (req, res) => {
//     console.log(req.file);
//     // console.log(req.body);
//     res.send('test');
// })
// let fields = [{name: 'main_image'}, {name: 'image1', maxCount: 1},{name: 'image2', maxCount: 1},{name: 'image3', maxCount: 1}];
// app.post('/upload_main_img', upload.fields(fields), (req,res) => {
    
//     let images = [];
//     images.push(req.files.image1[0].path);
//     images.push(req.files.image2[0].path);
//     images.push(req.files.image3[0].path);
//     console.log(req.files);
//     let main_image = req.files.main_image[0].path;
//     let images = [];
//     images.push(req.files.image1[0].path);
//     images.push(req.files.image2[0].path);
//     images.push(req.files.image3[0].path);
//     console.log(images); // test
//     console.log(main_image); // test
// })
// ############### for test ############### 

app.get('/', (req, res) => {
    res.send("Connect to EC2!");
})

let fields = [{name: 'main_image', maxCount: 1}, {name: 'images', maxCount: 3}];
app.post('/admin/upload', upload.fields(fields), (req, res) => {
    const id = parseInt(req.body.id);
    const price = parseInt(req.body.price);
    const {catagory, title, description, texture, wash, place, note, story, sizes, name, code, color_code, size, stock} = req.body;
    // let information = {id:req.body.id,title:req.body.title,description:req.body.description,price:req.body.price,texture:req.body.texture,wash:req.body.wash,place:req.body.place,note:req.body.note,story:req.body.story,colors:req.body.colors,sizes:req.body.sizes,variants:req.body.variants,main_image:req.body.main_image,images:req.body.images};

    let sql = `SELECT * from product_table;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `INSERT INTO product_table (id, catagory, title, description, price, texture, wash, place, note, story, sizes, main_image) VALUES ('${id}', '${catagory}', '${title}', '${description}', '${price}', '${texture}', '${wash}', '${place}', '${note}', '${story}', '${sizes}', '${req.files.main_image[0]['path']}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })
    })

    sql = `SELECT * from colors;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `INSERT INTO colors (name, code) VALUES ('${name}', '${code}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })
    })

    sql = `SELECT * from stock;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        let sql = `INSERT INTO stock (product_id, color_code, size, quantity) VALUES ('${id}', '${color_code}', '${size}', '${stock}');`;
        db.query(sql, (err, result)=>{
            if (err) throw err;
            // res.render('info',{message: 'update successes'});
        })
    })

    sql = `SELECT * from images;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < req.files.images.length; i++) {
            let sql = `INSERT INTO images (product_id, image) VALUES ('${id}', '${req.files.images[i]['path']}');`;
            db.query(sql, (err, result)=>{
                if (err) throw err;
                // res.render('info',{message: 'update successes'});
            })
        }
    })
    res.render('info',{message: 'update successes'});
})


app.get('/admin/product.html', (req, res) => {
    res.render('product');
})

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

// app.listen(3000, () => {console.log('running at port: 3000')});
app.listen(3000, () => {console.log('running...')});