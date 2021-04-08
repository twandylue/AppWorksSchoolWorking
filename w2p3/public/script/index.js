const xhr = new XMLHttpRequest();
const paging = 0;
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const all_products = document.getElementById("all_products");
            const { data, next_paging } = response;
            for (let i = 0; i < data.length; i++) {
                const { main_image, colors, title, price } = data[i];
                const product_content = document.createElement("div");
                product_content.className = "product content";

                const img = document.createElement("img");
                img.src = main_image;

                const product_colors = document.createElement("div");
                product_colors.className = "product_colors";
                for (let i = 0; i < colors.length; i++) {
                    const color = document.createElement("div");
                    color.className = "product_color";
                    // color.style.backgroundColor = '#DDFFBB'; // for test
                    // console.log('#'+ `${colors[i].code}`);
                    color.style.backgroundColor = "#" + `${colors[i].code}`;
                    product_colors.append(color);
                }

                const product_title = document.createElement("div");
                product_title.className = "product_title";
                product_title.innerHTML = title;

                const product_price = document.createElement("div");
                product_price.className = "product_price";
                product_price.innerHTML = "TWD." + price;

                product_content.append(img, product_colors, product_title, product_price);
                all_products.append(product_content);
            }
        } else {
            alert(xhr.status);
        };
    };
};
xhr.open("GET", `http://localhost:3000/api/1.0/products/all?paging=${paging}`); // for test
// xhr.open('GET', `http://localhost:3000/api/1.0/products/all?paging=${paging}`);
xhr.send();
