const router = require("express").Router();

const { getGameSettingInfo } = require("../controllers/match_controller");

router.route("/match").post(getGameSettingInfo);
// router.route('/match').get()
module.exports = router;
