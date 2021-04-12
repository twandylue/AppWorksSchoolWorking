updateCartNumber();

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        // do something
        const userInfo = JSON.parse(xhr.responseText);
        if (parseInt(userInfo) === 1) {
            alert("請先登入");
            window.location.href = "/admin/sign.html";
        } else if (parseInt(userInfo) === 2) {
            alert("登入驗證過期 請重新登入");
            window.location.href = "/admin/sign.html";
        } else if (parseInt(userInfo) === 0) {
            alert("請註冊後再購買");
            window.location.href = "/admin/sign.html";
        } else {
            const member = document.querySelector(".member__detail");
            member.innerHTML = "<h3>姓名: " + userInfo.data.name + "</h3><br><h3>email: " + userInfo.data.email + "</h3>";
        }
    }
};
// xhr.open("GET", "http://localhost:3000/api/1.0/user/profile"); // for local test
xhr.open("GET", "http://35.73.76.64/api/1.0/user/profile"); // for local test
xhr.setRequestHeader("Content-Type", "application/json");
const accessToken = localStorage.getItem("access_token");
xhr.setRequestHeader("Authorization", "bearer " + accessToken);
xhr.send();

function updateCartNumber () {
    const cartNumber = document.querySelector("#cart_number");
    const cartNumberTitle = document.querySelector("#title");
    if (localStorage.getItem("cart")) {
        const variantsNumber = JSON.parse(localStorage.getItem("cart"));
        if (variantsNumber == null) {
            cartNumber.innerHTML = 0;
        } else {
            cartNumber.innerHTML = variantsNumber.length;
            if (cartNumberTitle !== null) {
                cartNumberTitle.innerHTML = "購物車(" + variantsNumber.length + ")";
            }
        }
    } else {
        cartNumber.innerHTML = 0;
    }
}
