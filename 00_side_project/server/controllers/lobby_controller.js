const roomModule = require("../models/Room_model");
const getLobbyInfo = async (req, res) => {
    const info = await roomModule.getRoomLobbyInfo();
    res.status(200).send(info);
};

module.exports = {
    getLobbyInfo
};
