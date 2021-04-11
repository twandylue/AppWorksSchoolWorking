const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // reset cart number
            const cart = JSON.parse(localStorage.getItem("cart"));
            const cartNumber = document.querySelector("#cart_number");
            if (cart == null) {
                cartNumber.innerHTML = 0;
            } else {
                cartNumber.innerHTML = cart.length;
            }
            console.log(cart);
            const items = document.querySelector("#items");
            for (const i in cart) { // create element in main body
                const item = document.createElement("div");
                item.className = "item";
                const itemImage = document.createElement("img");
                itemImage.className = "item__image";
                itemImage.src = cart[i].image;

                const itemDetail = document.createElement("div");
                itemDetail.className = "item__detail";
                const itemName = document.createElement("div");
                itemName.className = "item__name";
                itemName.innerHTML = cart[i].name;
                const itemID = document.createElement("div");
                itemID.className = "item__id";
                itemID.innerHTML = cart[i].id;
                const itemColor = document.createElement("div");
                itemColor.className = "item__color";
                itemColor.innerHTML = "顏色|" + cart[i].color.name;
                const itemSize = document.createElement("div");
                itemSize.className = "item__size";
                itemSize.innerHTML = "尺寸|" + cart[i].size;
                itemDetail.append(itemName, itemID, itemColor, itemSize);

                const itemQuantity = document.createElement("div");
                itemQuantity.className = "item__quantity";
                const mobileText = document.createElement("div");
                mobileText.className = "mobile-text";
                mobileText.innerHTML = "數量";
                const mobileSelect = document.createElement("select");
                mobileSelect.className = "SelectNumber";
                for (let j = 0; j < cart[i].stock; j++) {
                    const option = document.createElement("option");
                    option.value = j + 1;
                    option.innerHTML = j + 1;
                    if (parseInt(option.value) === cart[i].qty) {
                        option.selected = "selected";
                    }
                    mobileSelect.append(option);
                }
                itemQuantity.append(mobileText, mobileSelect);

                const itemPrice = document.createElement("div");
                itemPrice.className = "item__price";
                const itemPriceMobileText = document.createElement("div");
                itemPriceMobileText.className = "mobile-text";
                itemPriceMobileText.innerHTML = "單價";
                const price = document.createElement("div");
                price.innerHTML = "NT." + (cart[i].price).toString();
                itemPrice.append(itemPriceMobileText, price);

                const itemSubtotal = document.createElement("div");
                itemSubtotal.className = "item__subtotal";
                // const itemSubtotalMobileText = document.createElement("div");
                // itemSubtotalMobileText.className = "mobile-text";
                // itemSubtotalMobileText.innerHTML = "小計";
                // const subtotal = document.createElement("div");
                // subtotal.innerHTML = "NT." + (cart[i].qty * cart[i].price).toString(); // 需要用click更新
                // itemSubtotal.append(itemSubtotalMobileText, subtotal);
                itemSubtotal.innerHTML = "NT." + (cart[i].qty * cart[i].price).toString();
                // itemSubtotal.append(itemSubtotalMobileText);

                const itemRemove = document.createElement("div");
                itemRemove.className = "item__remove";
                const removeImg = document.createElement("img");
                removeImg.src = "./images/cart-remove.png";
                itemRemove.append(removeImg);

                item.append(itemImage, itemDetail, itemQuantity, itemPrice, itemSubtotal, itemRemove);
                items.append(item);
            }

            const selectChange = document.querySelector("#items");
            selectChange.addEventListener("change", (event) => { // uapdate subtotal
                const newNumbers = document.querySelectorAll("#items option:checked");
                for (let i = 0; i < newNumbers.length; i++) { // i can be used cross different parent element
                    // console.log(newNumbers[i].value);
                    // console.log(cart[i].price);
                    const newSubtotals = document.querySelectorAll("#items .item__subtotal");
                    // console.log(newSubtotals[i].innerHTML);
                    newSubtotals[i].innerHTML = "NT." + (newNumbers[i].value * cart[i].price).toString();
                }
            });

            // const itemDelete = document.querySelectorAll("#items .item__remove");
            // const newCart = JSON.parse(localStorage.getItem("cart"));
            // for (let i = 0; i < itemDelete.length; i++) {
            //     itemDelete[i].addEventListener("click", (event) => {
            //         // console.log("item: " + (i));
            //         // console.log(((event.target).parentElement).parentElement);
            //         ((event.target).parentElement).parentElement.remove(); // remove element from HTML

            //         newCart[i] = "cancled";
            //         console.log(newCart);
            //     });
            // }

            // const readyToPay = document.querySelector("#checkout");
            // readyToPay.addEventListener("click", (event) => {
            //     for (const i in newCart) {
            //         if (newCart[i] === "cancled") { // not good enough solution
            //             newCart.splice(i, 1);
            //         }
            //     }
            //     // console.log(newCart);
            //     // localStorage.setItem("cart", JSON.stringify(newCart));
            // });

            const itemDelete = document.querySelectorAll("#items .item__remove");
            const newCart = JSON.parse(localStorage.getItem("cart"));
            const map = new Map();
            for (let i = 0; i < itemDelete.length; i++) {
                map.set(i, newCart[i]);
                itemDelete[i].addEventListener("click", (event) => {
                    ((event.target).parentElement).parentElement.remove(); // remove element from HTML

                    // newCart[i] = "cancled";
                    // newCart.splice(i, 1);
                    // console.log(newCart);
                    console.log("map: ");
                    const newArr = [];
                    map.set(i, "cancel");
                    // console.log(map);
                    for (let i = 0; i < map.size; i++) {
                        // console.log(map.get(i));
                        if (map.get(i) !== "cancel") {
                            newArr.push(map.get(i));
                        }
                    }
                    // console.log(newArr);
                    localStorage.setItem("cart", JSON.stringify(newArr));
                });
            }

            // const readyToPay = document.querySelector("#checkout");
            // readyToPay.addEventListener("click", (event) => {
            //     for (const i in newCart) {
            //         if (newCart[i] === "cancled") { // not good enough solution
            //             newCart.splice(i, 1);
            //         }
            //     }
            //     // console.log(newCart);
            //     // localStorage.setItem("cart", JSON.stringify(newCart));
            // });
        }
    };
};

xhr.open("GET", "http://localhost:3000/"); // for test
// xhr.open("GET", `http://35.73.76.64/api/1.0/products/details?id=${id}`); // for EC2
xhr.send();
