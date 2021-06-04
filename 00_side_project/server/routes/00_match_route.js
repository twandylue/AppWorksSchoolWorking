const router = require("express").Router();
const { getGameSettingInfo } = require("../controllers/match_controller");

router.route("/match").post(getGameSettingInfo);

module.exports = router;
