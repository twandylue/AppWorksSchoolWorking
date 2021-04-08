// AppWoeksSchool w1p1
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const request = require('request');
const { resolve } = require('path');
require('dotenv').config({path: process.cwd() + '/DOTENV/config.env'});

// Router setting
const router = express.Router();

// function setting 
const query_main = require("./function").query_main;

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());

router.get(`/products/accessories`, (req, res) => {
    let query_catagory = 'accessories';
    let query_page = req.query.paging;
    let sql_select = `SELECT * FROM product_table WHERE catagory = '${query_catagory}'`;
    let sql_count = `SELECT Count(*) FROM product_table WHERE catagory = '${query_catagory}'`;
    query_main(req, sql_select, sql_count, query_page).then((result) => {
        res.send(result);
    });
})
module.exports = {router: router};