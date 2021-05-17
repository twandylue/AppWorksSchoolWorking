const router = require("express").Router();
const { chat } = require("../controllers/chatroom_controller");

router.route("/chat").get(chat);

module.exports = router;
