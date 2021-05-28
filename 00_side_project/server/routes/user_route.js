const router = require("express").Router();

const {
    authentication
} = require("../../util/util");

const {
    signUp,
    signIn,
    getUserProfile
} = require("../controllers/user_controller");

router.route("/user/signup").post(signUp);

router.route("/user/signin").post(signIn);

router.route("/user/profile").get(authentication(), getUserProfile);

module.exports = router;
