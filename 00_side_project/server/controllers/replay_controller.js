const { getReplay } = require("../models/getReplay");
const getReplayRecord = async (req, res) => {
    try {
        const { data } = req.body;
        const replayObj = await getReplay(parseInt(data));
        res.status(200).send({ data: { stepList: replayObj.stepList, members: replayObj.members, rules: replayObj.rules, cardsSetting: replayObj.cardsSetting, gameStatData: replayObj.gameStatData } });
        return;
    } catch (err) {
        res.status(400).send({ error: "wrong gameID" });
    }
};

module.exports = {
    getReplayRecord
};
