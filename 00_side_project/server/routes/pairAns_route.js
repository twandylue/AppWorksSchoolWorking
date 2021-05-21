const router = require("express").Router();
const { pairAnsGenerator } = require("../controllers/pairAns_controller");

router.route("/pairAnswers").post(pairAnsGenerator);

module.exports = router;
