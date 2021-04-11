const xhr = new XMLHttpRequest();
const paging = 0;
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // reset cart number
            const variantsNumber = JSON.parse(localStorage.getItem("cart"));
            const cartNumber = document.querySelector("#cart_number");
            if (variantsNumber === null) {
                cartNumber.innerHTML = 0;
            } else {
                cartNumber.innerHTML = variantsNumber.length;
            }

            const response = JSON.parse(xhr.responseText);
            const allProducts = document.getElementById("all_products");
            const { data } = response;
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i]);
                // eslint-disable-next-line camelcase
                const { main_image, colors, title, price } = data[i];
                const productContent = document.createElement("a");
                productContent.className = "product content";
                // console.log(data[i].id);
                productContent.href = `/product.html?id=${data[i].id}`;
                const img = document.createElement("img");
                // eslint-disable-next-line camelcase
                img.src = main_image;

                const productColors = document.createElement("div");
                productColors.className = "product_colors";
                for (let i = 0; i < colors.length; i++) {
                    const color = document.createElement("div");
                    color.className = "product_color";
                    // color.style.backgroundColor = '#DDFFBB'; // for test
                    // console.log('#'+ `${colors[i].code}`);
                    color.style.backgroundColor = "#" + `${colors[i].code}`;
                    productColors.append(color);
                }

                const productTitle = document.createElement("div");
                productTitle.className = "product_title";
                productTitle.innerHTML = title;

                const productPrice = document.createElement("div");
                productPrice.className = "product_price";
                productPrice.innerHTML = "TWD." + price;

                productContent.append(img, productColors, productTitle, productPrice);
                allProducts.append(productContent);
            }
        } else {
            alert(xhr.status);
        };
    };
};
xhr.open("GET", `http://localhost:3000/api/1.0/products/all?paging=${paging}`); // for test
// xhr.open("GET", `http://35.73.76.64/api/1.0/products/all?paging=${paging}`); // for EC2
xhr.send();
