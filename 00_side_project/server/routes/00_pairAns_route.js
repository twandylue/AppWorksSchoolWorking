const router = require("express").Router();
const { pairAnsGenerator } = require("../controllers/00_pairAns_controller");

router.route("/pairAnswers").post(pairAnsGenerator);

module.exports = router;
