async function main () {
    const userInfo = await checkLogin();
    const userRecord = await getUserRecord();
    const leaderboardObj = await getLeaderBoard();
    const leaderboardList = leaderboardObj.data;

    // console.log(leaderboardList);
    // console.log("-----------------");
    // console.log(userRecord);

    document.querySelector("#user-name-header").innerHTML = `Hi! ${userInfo.data.name}`;
    document.querySelector("#user-name-main").innerHTML = `Hi! ${userInfo.data.name}`;
    document.querySelector("#user-email-main").innerHTML = `Email: ${userInfo.data.email}`;
    document.querySelector("#total-points").innerHTML = `生涯總得分: ${userRecord.data.totalPoints}`;
    document.querySelector("#correct-rate").innerHTML = `生涯命中率: ${(userRecord.data.hitRate * 100).toFixed(2)} %`;
    const gameHistory = document.querySelector("#game-history");
    const { gameHis } = userRecord.data;
    for (let i = 0; i < gameHis.length; i++) {
        const gameItem = document.createElement("option");
        gameItem.id = gameHis[i].game_id;
        // 以下加入 勝負 and 對手
        const str = `第 ${i + 1} 場 | room: ${gameHis[i].room_id} | 類型: ${gameHis[i].type} | 卡片數量: ${gameHis[i].number} | 總回合數: ${gameHis[i].rounds} | 總分: ${gameHis[i].total_points} | 命中率: ${(gameHis[i].hit_rate * 100).toFixed(2)} %`;
        gameItem.innerHTML = str;
        gameHistory.append(gameItem);
    }

    const leaderboard = document.querySelector("#leaderboard");
    for (let i = 0; i < leaderboardList.length; i++) {
        const leaderboardItem = document.createElement("li");
        leaderboardItem.innerHTML = `排行${i + 1} | ${leaderboardList[i].name} | 總得分: ${leaderboardList[i].totalPoints} | 平均得分: ${(leaderboardList[i].avgPoints).toFixed(2)} | 平均命中率: ${(leaderboardList[i].avgHitRate * 100).toFixed(2)} %`;
        leaderboard.append(leaderboardItem);
    }
}
main();

const submit = document.querySelector("#submit");
submit.addEventListener("click", () => {
    // 重播使用
});

async function checkLogin () {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("api/1.0/user/profile", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        })
    });
    return await response.json();
}

async function getUserRecord () {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("api/1.0/user/record", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        })
    });
    return await response.json();
}

async function getLeaderBoard () {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("api/1.0/user/leaderboard", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        })
    });
    return await response.json();
}
