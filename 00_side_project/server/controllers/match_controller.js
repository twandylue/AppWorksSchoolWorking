require("dotenv").config();

const getGameSettingInfo = async (req, res) => {
    const info = req.body;
    console.log(info);
    res.send(info);
};

module.exports = {
    getGameSettingInfo
};
