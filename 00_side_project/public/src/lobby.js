import { updateLobby } from "./update_lobby.js";

const token = localStorage.getItem("access_token");
localStorage.removeItem("rules");
localStorage.removeItem("gameID");
localStorage.removeItem("roomID");
const socket = io({
    auth: { token: token }
});

socket.on("connect", () => {
    console.log("socketID: " + socket.id);
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
            main();
            socket.emit("update room info", "need to update room info"); // 後端沒建立on時 會導致沒有觸發此事件 待改 改成用api的形式
        });
    }
});

socket.emit("get user name", "get my name");

socket.on("show my info", (info) => {
    document.querySelector("#user_name").innerHTML = `Hi! ${info.name}`;
});

socket.emit("update room info", "need to update room info"); // 後端沒建立on時 會導致沒有觸發此事件 待改 改成用api的形式

socket.on("room info", (roomInfo) => {
    updateLobby(roomInfo);
});

socket.on("join success", (info) => {
    localStorage.setItem("access_token", info.token); // 此token第一次帶有roomID資訊
    window.location.href = `/match.html?roomID=${info.roomID}`;
});

socket.on("join room with robot success", info => {
    localStorage.setItem("access_token", info.token); // 此token第一次帶有roomID資訊 單人模式
    window.location.href = `/match_robot.html?roomID=${info.roomID}`;
});

socket.on("join failed", (info) => {
    Swal.fire({
        icon: "error",
        title: "加入房間失敗",
        text: "請重新加入房間!",
        confirmButtonText: "好的"
    });
});

const joinButtons = document.querySelectorAll(".join");
joinButtons.forEach(joinButton => joinButton.addEventListener("click", joinRoom));
function joinRoom () {
    const button = this;
    const roomID = button.parentElement.parentElement.id;
    // const token = localStorage.getItem("access_token");
    // const info = { roomID: roomID, token: token };
    const info = { roomID: roomID };
    socket.emit("join room", info);
}

const singleButton = document.querySelector("#mode-select");
singleButton.addEventListener("click", () => {
    Swal.fire({
        icon: "question",
        title: "單人模式",
        text: "要跟機器人一起遊玩嗎？",
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit("join room with robot", "want to play with robot");
        }
    });
});

const profile = document.querySelector("#user_profile");
profile.addEventListener("click", () => {
    window.location.href = "/userprofile.html";
});

const logo = document.querySelector("#logo-container-header");
logo.addEventListener("click", () => {
    window.location.href = "/";
});

async function main () {
    const loginStae = await checkLogin();
    // console.log(await loginStae.json());
    if (loginStae.status !== 200) {
        Swal.fire({
            icon: "error",
            title: "尚未登入",
            text: "還沒登入不給玩喔!",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "註冊",
            denyButtonText: "登入",
            cancelButtonText: "離開"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formValues = await Swal.fire({
                    title: "註冊表單",
                    html: `<input type="text" id="name" class="swal2-input" placeholder="請輸入代號">
                    <input type="text" id="email" class="swal2-input" placeholder="請輸入email">
                    <input type="password" id="password" class="swal2-input" placeholder="請輸入密碼">`,
                    confirmButtonText: "註冊 Sign up",
                    focusConfirm: false,
                    preConfirm: () => {
                        const name = Swal.getPopup().querySelector("#name").value;
                        const email = Swal.getPopup().querySelector("#email").value;
                        const password = Swal.getPopup().querySelector("#password").value;
                        if (!name || !email || !password) {
                            Swal.showValidationMessage("請輸入代號/信箱/密碼");
                            return;
                        }
                        return { name: name, email: email, password: password };
                    }
                });

                if (formValues) {
                    const data = JSON.stringify(formValues.value);
                    const response = await fetch("api/1.0/user/signup", {
                        body: data,
                        method: "POST",
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    });

                    if (response.status !== 200) {
                        Swal.fire({
                            icon: "error",
                            title: "Eamil被註冊過囉！",
                            text: "請換個email註冊吧!",
                            confirmButtonText: "好的"
                        }).then(() => {
                            main();
                        });
                        return;
                    }

                    Swal.fire({
                        icon: "success",
                        title: "註冊成功！",
                        text: "可以開始玩囉!",
                        confirmButtonText: "好的"
                    }).then(async () => {
                        const info = await response.json();
                        localStorage.setItem("access_token", info.data.access_token);
                        socket.emit("update room info", "need to update room info"); // 後端沒建立on時 會導致沒有觸發此事件 待改 改成用api的形式
                        window.location.href = "/";
                    });
                }
            }

            if (result.isDenied) {
                const formValues = await Swal.fire({
                    title: "登入",
                    html: `<input type="text" id="email" class="swal2-input" placeholder="請輸入email">
                    <input type="password" id="password" class="swal2-input" placeholder="請輸入密碼">`,
                    confirmButtonText: "登入 Sign in",
                    focusConfirm: false,
                    preConfirm: () => {
                        const email = Swal.getPopup().querySelector("#email").value;
                        const password = Swal.getPopup().querySelector("#password").value;
                        if (!email || !password) {
                            Swal.showValidationMessage("請輸入信箱/密碼");
                            return;
                        }
                        return { email: email, password: password };
                    }
                });

                if (formValues) {
                    console.log(formValues.value);
                    const data = JSON.stringify(formValues.value);
                    const response = await fetch("api/1.0/user/signin", {
                        body: data,
                        method: "POST",
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    });

                    if (response.status !== 200) {
                        Swal.fire({
                            icon: "error",
                            title: "Eamil或密碼錯誤！",
                            text: "回想一下再試試看吧!",
                            confirmButtonText: "好的"
                        }).then(() => {
                            main();
                        });
                        return;
                    }

                    Swal.fire({
                        icon: "success",
                        title: "登入成功！",
                        text: "可以開始玩囉!",
                        confirmButtonText: "好的"
                    }).then(async () => {
                        const info = await response.json();
                        localStorage.setItem("access_token", info.data.access_token);
                        socket.emit("update room info", "need to update room info"); // 後端沒建立on時 會導致沒有觸發此事件 待改 改成用api的形式
                        window.location.href = "/";
                    });
                }
            }
        });
    }
}
main();

async function checkLogin () {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch("api/1.0/user/profile", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        })
    });
    return response;
}
