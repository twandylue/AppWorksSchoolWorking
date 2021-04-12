const queryParamsString = window.location.search;
const number = queryParamsString.split("=")[1];

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // console.log("number: ");
            // console.log(number);
            const resetCart = [];
            // localStorage.setItem("cart", resetCart); // reset cart
            updateCartNumber();
            const orderID = document.querySelector("#number");
            orderID.innerHTML = number; // not finished
        } else {
            alert(xhr.status);
        }
    }
};
xhr.open("GET", "http://localhost:3000/"); // for test
// xhr.open("GET", "http://35.73.76.64/"); // for EC2
xhr.send();

function updateCartNumber () {
    const variantsNumber = JSON.parse(localStorage.getItem("cart"));
    const cartNumber = document.querySelector("#cart_number");
    const cartNumberTitle = document.querySelector("#title");
    if (variantsNumber == null) {
        cartNumber.innerHTML = 0;
    } else {
        cartNumber.innerHTML = variantsNumber.length;
        if (cartNumberTitle !== null) {
            cartNumberTitle.innerHTML = "購物車(" + variantsNumber.length + ")";
        }
    }
}
