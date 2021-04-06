// AppWoeksSchool w1p5
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

// Router setting
const router = express.Router();

// function setting 
// const db_setInsert = require("./function").db_setInsert;
// const call_sql = require("./function").call_sql;
const image_url = require("./function").image_url;
const dbsql = require("./function").dbsql;

// Middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static('public'));

let fields_campaign = [{name: 'campaign_image', maxCount: 1}];
router.post('/admin/campaign_upload', upload.fields(fields_campaign), (req, res) => {
    async function upload_campaign(upload_var) {
        if (upload_var.id && upload_var.story && upload_var.campaign_image_path) {
            let sql_check_product = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
            let insert_campaign_table = `INSERT INTO campaign_table (product_id, story, picture) VALUES (${upload_var.id}, '${upload_var.story}', '${upload_var.campaign_image_path}');`; 
            let check_result = await dbsql(req, sql_check_product);
            // console.log(check_result.length)
            if (check_result.length == 0) {
                // product_id not exist.
            } else {
                let insert_campaign = await dbsql(req, insert_campaign_table);
                // console.log(insert_campaign);
            }
            console.log("Update campaign.");
        }
    }
    // console.log('current path: ');
    // console.log(process.cwd())

    // console.log('img: ');
    // console.log(req.files)

    const {id, story} = req.body;
    const campaign_image_path = image_url(req.files.campaign_image[0].path);

    // console.log('img2: ');
    // console.log(campaign_image_path);

    let upload_var = {id: id, story: story, campaign_image_path: campaign_image_path};
    console.log('upload_var: '); // check Arthur robot.
    console.log(upload_var); // check Arthur robot.
    upload_campaign(upload_var).then(() => { // 要不要移到function.js?
        res.redirect('/response-message/campaign-upload-success');
    })
})

router.get(`/marketing/campaigns`, (req, res) => {
    async function qurey_campaign(sql_select, sql_count, query_page) {
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
        let campaign_list = await dbsql(req, sql_select);
        // console.log(campaign_list.length);
        
        let output = {};
        if (sql_count !== 'none') {
            output.data = campaign_list;
            let next_paging = parseInt(query_page)+1;
            if (next_paging > total_pages || sql_totalcount/((query_page+1)*pages_gqp) == 1) {
                return output;
            }
            output.next_paging = next_paging;
            return output;
        } else {
            output.data = campaign_list[0];
            return output;
        }
    }
    let query_page = req.query.paging;
    console.log('query_page: '+query_page); // check Arthur robot.
    let sql_select = `SELECT * FROM campaign_table`;
    let sql_count = `SELECT Count(*) FROM campaign_table;`;
    qurey_campaign(sql_select, sql_count, query_page).then((result) => {
        res.send(result);
    });
})

module.exports = {router: router};