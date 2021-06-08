import { addGameInfo } from "./add_game_info.js";
import { addGameStatusandCards } from "./add_game_status_cards.js";
import { cardGameinSingle } from "./card_game_with_robot.js";
import { gameStat } from "./game_stat.js";
import { updatePoints } from "./update_points.js";
import { showGameRules } from "./showGameRules.js";
import { combineMatchPageforAgain } from "./combMatchPage.js";

let frontGameID; // 儲存遊戲ID
let frontRules; // 儲存遊戲規則

const token = localStorage.getItem("access_token");

const socket = io({
    auth: {
        token: token
    }
});

socket.on("connect", () => {
    // 講整段code放入此處 表示連線後才能執行?
    console.log(socket.id);
});

socket.on("connect_error", (err) => {
    console.log(err.message);
    if (err.message) {
        Swal.fire({
            icon: "warning",
            title: "你斷線囉",
            text: err.message,
            confirmButtonText: "確認"
        }).then(() => {
            window.location.href = "./gamelobby.html";
        });
    }
});

socket.on("join failed", (msg) => {
    Swal.fire({
        icon: "error",
        title: "加入房間失敗",
        text: "請重新加入房加!",
        confirmButtonText: "好的"
    }).then(() => {
        window.location.href = "/gamelobby.html";
    });
});

socket.on("leave room", (msg) => { // 有問題 聽不到 待改
    console.log(msg);
    Swal.fire({
        icon: "warning",
        title: "你斷線囉",
        text: "回到遊戲大廳!",
        confirmButtonText: "確認"
    }).then(() => {
        window.location.href = "./gamelobby.html";
    });
});

socket.on("robot leave room", (msg) => {
    console.log(msg);
    Swal.fire({
        icon: "warning",
        title: "你斷線囉",
        text: "回到遊戲大廳!",
        confirmButtonText: "確認"
    }).then(() => {
        window.location.href = "./gamelobby.html";
    });
});

Swal.fire({ // sweet alert寫法 不同體驗 先保留
    icon: "warning",
    title: "準備好了嗎？",
    text: "要開始了唷!",
    confirmButtonText: "確認"
}).then(() => {
    socket.emit("in room with robot", "in the room"); // 較安全的寫法 等後端建立好on事件 and 到此處時 理應上token中已帶有roomID資訊
    socket.emit("get user name", "get my name");
    socket.emit("get user room", "get my roomID");
});

socket.on("show my info", (info) => {
    document.querySelector("#user_name").innerHTML = `Hi! ${info.name}`;
    document.querySelector("#user_container #name").innerHTML = info.name;
});

socket.on("show roomID", (info) => {
    document.querySelector("#roomID").innerHTML = `所在房號: ${info.roomID}`;
});

socket.on("ready in single mode", (info) => { // gameID 第一次出現 在info中
    const { rules, gameID } = info;
    frontGameID = gameID; //    第一次儲存gameID
    frontRules = Object.assign({}, rules); // 第一次儲存frontRules(game rules)
    showGameRules(frontRules); // show rules

    const startButton = document.querySelector("#start");
    if (startButton) {
        startButton.disabled = false;
        startButton.innerHTML = "我準備好了！";
    }
});

socket.on("execute rules", (info) => {
    addGameInfo(info.rules.type, info.rules.number, info.rules.rounds, info.rules.targets);
    addGameStatusandCards(info.round, info.rules.number, info.target, info.rules.state, info.cardsSetting);
});

socket.on("countdown in ready", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `遊戲倒數時間: ${time} s`;
});

socket.on("countdown in game", (time) => {
    if (document.querySelector("#countdown") === null) {
        return;
    }
    document.querySelector("#countdown").innerHTML = `遊戲倒數時間: ${time} s`;
});

socket.on("start game", (info) => { // 翻牌(問號面)
    if (info.msg === "start") {
        const cardFrontFaces = document.querySelectorAll(".front-face");
        const cardBackFaces = document.querySelectorAll(".back-face");
        const status = document.querySelector("#status");
        status.innerHTML = `第 ${info.round} 回合 Start！`;
        for (let i = 0; i < cardFrontFaces.length; i++) {
            cardFrontFaces[i].innerHTML = "";
            cardFrontFaces[i].classList.add("front-face_start");
            cardBackFaces[i].classList.remove("back-face_ready");
        }

        cardGameinSingle(socket, frontGameID, info.round, info.target);
    }
});

socket.on("fill card number", (cardfilledInfo) => {
    const cardFrontFaces = document.querySelectorAll(".front-face");
    cardFrontFaces[cardfilledInfo.cardID].innerHTML = cardfilledInfo.number;
});

socket.on("next round execute rules", (info) => {
    addGameStatusandCards(info.round, info.rules.number, info.target, info.rules.state, info.cardsSetting);
});

socket.on("update points", (pointsInfo) => {
    updatePoints(socket, pointsInfo);
});

socket.on("game over", (gameStatInfo) => {
    socket.emit("get user name", "get my name");
    Swal.fire({
        icon: "success",
        title: "遊戲結束！",
        text: "看看自己的成績吧",
        confirmButtonText: "確認"
    });
    socket.on("show my info", (info) => {
        let hitRate, roundsPoints, totalPoints;
        for (const i in gameStatInfo.results) {
            if (gameStatInfo.results[i].player_email === info.email) {
                hitRate = gameStatInfo.results[i].hitRate;
                roundsPoints = gameStatInfo.results[i].roundsPoints.map((element) => { return element; });
                totalPoints = gameStatInfo.results[i].totalPoints;
            }
        }
        const winnerStatus = gameStatInfo.winner[0].name;
        gameStat(hitRate, totalPoints, roundsPoints, winnerStatus);
        document.querySelector("#replay_title").innerHTML = "與機器人對戰結束";
        document.querySelector("#replay_title").style = "cursor:auto; color:#fbfef9; background-color: #0D1F2D;";

        const again = document.querySelector("#again");
        again.addEventListener("click", () => {
            const info = { gameID: frontGameID };
            socket.emit("want to play again in single mode", info);
            Swal.fire({
                icon: "info",
                title: "已送出再玩一次的邀請",
                text: "請等待對手回應",
                confirmButtonText: "好的"
            }).then(() => {
                again.disabled = true;
                again.innerHTML = "等待對手回應";
            });
        });

        const goodbye = document.querySelector("#goodbye");
        goodbye.addEventListener("click", () => {
            Swal.fire({
                icon: "warning",
                title: "離開遊戲房間",
                text: "再見",
                confirmButtonText: "Bye"
            }).then(() => {
                window.location.href = "/gamelobby.html";
            });
        });
    });
});

socket.on("again", (info) => {
    frontGameID = info.gameID; // 更新gameID
    frontRules = Object.assign({}, info.rules); // 儲存新的frontRules
    document.querySelector("#middle").classList.remove("middle-Stat");
    combineMatchPageforAgain();
    showGameRules(info.rules);

    const startButton = document.querySelector("#start");
    startButton.addEventListener("click", () => { // 此callbackfunction 可以簡化 重複使用 start button 待改
        startButton.disabled = "disabled";
        Swal.fire({
            icon: "warning",
            title: "準備完成！",
            text: "等待對手準備...",
            confirmButtonText: "確認"
        }).then(() => {
            socket.emit("I am ready in single mode", { rules: frontRules, gameID: frontGameID });
        });
    });

    const leave = document.querySelector("#leave");
    leave.addEventListener("click", () => {
        Swal.fire({
            icon: "warning",
            title: "離開房間?",
            text: "確定要離開房間嗎?",
            showDenyButton: true,
            confirmButtonText: "確認",
            denyButtonText: "取消"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "./gamelobby.html";
            } else if (result.isDenied) {
                Swal.fire("留在房間內", "", "info");
            }
        });
    });

    Swal.fire({
        icon: "warning",
        title: "再來一局吧！",
        text: "轉跳至準備頁面",
        confirmButtonText: "確認"
    });
});

const start = document.querySelector("#start"); // 規則展示頁面確認按鈕
start.addEventListener("click", () => {
    start.disabled = "disabled";
    leave.disabled = "disabled";
    Swal.fire({
        icon: "warning",
        title: "準備完成！",
        text: "等待對手準備...",
        confirmButtonText: "確認"
    }).then(() => {
        socket.emit("I am ready in single mode", { rules: frontRules, gameID: frontGameID });
    });
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", () => {
    Swal.fire({
        icon: "warning",
        title: "離開房間?",
        text: "確定要離開房間嗎?",
        showDenyButton: true,
        confirmButtonText: "確認",
        denyButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./gamelobby.html";
        } else if (result.isDenied) {
            Swal.fire("留在房間內", "", "info");
        }
    });
});

const profile = document.querySelector("#user_profile");
profile.addEventListener("click", () => {
    Swal.fire({
        icon: "question",
        title: "請選擇功能",
        text: "想做啥?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "我的檔案",
        denyButtonText: "登出",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/userprofile.html";
        } else if (result.isDenied) {
            localStorage.removeItem("access_token");
            window.location.href = "/";
        }
    });
});

const logo = document.querySelector("#logo-container-header");
logo.addEventListener("click", () => {
    window.location.href = "/";
});

async function main () {
    const userInfo = await getUserPhoto();
    document.querySelector("#user_photo").src = userInfo.data.picture;
    document.querySelector("#user_photo_left").src = userInfo.data.picture;
    document.querySelector("#name").innerHTML = userInfo.data.name;
    document.querySelector("#user_name").innerHTML = `Hi! ${userInfo.data.name}`;
}
main();

async function getUserPhoto () {
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
