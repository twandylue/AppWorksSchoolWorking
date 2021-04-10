// AppWoeksSchool w1p5
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

// set storage engine
const storageEng = multer.diskStorage({
    // destination為保留字
    destination: "./public/upload_pics/",
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
        callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

// input upload
const upload = multer({
    storage: storageEng
});

// Router setting
const router = express.Router();

// function setting
// const db_setInsert = require("./function").db_setInsert;
// const call_sql = require("./function").call_sql;
const imageURL = require("./function").imageURL;
const dbsql = require("./function").dbsql;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static("public"));

const fieldsCampaign = [{ name: "campaign_image", maxCount: 1 }];
router.post("/admin/campaign_upload", upload.fields(fieldsCampaign), (req, res) => { // 可以獨立
    // eslint-disable-next-line camelcase
    async function uploadCampaign (upload_var) {
        if (upload_var.id && upload_var.story && upload_var.campaign_image_path) {
            const checkProduct = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
            const insertCampaign = `INSERT INTO campaign_table (product_id, story, picture) VALUES (${upload_var.id}, '${upload_var.story}', '${upload_var.campaign_image_path}');`;
            const sqlReturn = await dbsql(req, checkProduct);
            // console.log(sqlReturn.length)
            if (sqlReturn.length === 0) {
                // product_id not exist.
            } else {
                // eslint-disable-next-line no-unused-vars
                const insertReturn = await dbsql(req, insertCampaign);
                // console.log(insertReturn);
            }
            console.log("Update campaign.");
        }
    }
    // console.log('img: ');
    // console.log(req.files)

    const { id, story } = req.body;
    const campaignImagePath = imageURL(req.files.campaign_image[0].path);
    const upload = { id: id, story: story, campaign_image_path: campaignImagePath };
    console.log("upload_var: "); // check Arthur robot.
    console.log(upload); // check Arthur robot.
    uploadCampaign(upload).then(() => { // 要不要移到function.js?
        res.redirect("/response-message/campaign-upload-success");
    });
});

router.get("/marketing/campaigns", (req, res) => {
    async function qureyCampaign (sqlSelect, sqlCount, queryPage) {
        let totalPages = 0;
        let sqlTotalcount = 0;
        const pagesGap = 6;

        if (queryPage == null) {
            queryPage = "0";
        }
        if (sqlCount !== "none") {
            const sqlTotalNumber = await dbsql(req, sqlCount);
            sqlTotalcount = parseInt(sqlTotalNumber[0]["Count(*)"]);
            totalPages = sqlTotalcount / pagesGap;
            const sqlDataStart = (queryPage) * pagesGap;
            sqlSelect = sqlSelect + ` LIMIT ${sqlDataStart} , ${pagesGap};`;
            // console.log(sqlSelect);
        }
        const campaignList = await dbsql(req, sqlSelect);
        // console.log(campaignList.length);

        const output = {};
        if (sqlCount !== "none") {
            output.data = campaignList;
            const nextPaging = parseInt(queryPage) + 1;
            if (nextPaging > totalPages || sqlTotalcount / ((queryPage + 1) * pagesGap) === 1) {
                return output;
            }
            output.next_paging = nextPaging;
            return output;
        } else {
            output.data = campaignList[0];
            return output;
        }
    }
    const queryPage = req.query.paging;
    console.log("query_page: " + queryPage); // check Arthur robot.
    const sqlSelect = "SELECT * FROM campaign_table";
    const sqlCount = "SELECT Count(*) FROM campaign_table;";
    qureyCampaign(sqlSelect, sqlCount, queryPage).then((result) => {
        res.send(result);
    });
});

module.exports = { router: router };
