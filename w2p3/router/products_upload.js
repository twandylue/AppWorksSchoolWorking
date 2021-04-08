// AppWoeksSchool w0p3
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

// set storage engine
const storage_eng = multer.diskStorage({ 
    // destination為保留字
    // destination: './public/upload_pics/',
    destination: './public/upload_images/',
    filename: function(req, file, callback){
        // callback(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    } 
})

// input upload
const upload = multer({
    storage: storage_eng
})

// Router setting
const router = express.Router();

// function setting 
const upload_main = require("./function").upload_main;

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static('public'));

let fields = [{name: 'main_image', maxCount: 1}, {name: 'images', maxCount: 3}];
router.post('/admin/upload', upload.fields(fields), (req, res) => {
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
    console.log(upload_var);
    console.log(req.files);
    upload_main(req, upload_var).then(() => { // 應該把只用到一次的function移進此js內
        res.redirect('/response-message/products-upload-success');
    })
})

module.exports = {router: router};