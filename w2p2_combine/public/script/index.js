const xhr = new XMLHttpRequest();

  let paging = 0;
  xhr.open('GET', `http://13.228.137.234/api/1.0/products/all?paging=${paging}`);

  xhr.onreadystatechange = function (){
    if(xhr.readyState === 4 && xhr.status === 200) {
      let allProducts = document.getElementById('all_products');
      let response = JSON.parse(xhr.responseText);
      let { next_paging, data } = response;

      for (i = 0 ; i < data.length ; i++ ) {
        let { main_image, title, colors, price } = data[i];

        let productBlock = document.createElement('div');
            productBlock.className = 'product_block';
        allProducts.appendChild(productBlock);

        let img = document.createElement('img');
            img.src = main_image;
            img.alt = 'product_preview';
        productBlock.appendChild(img);

        let productColors = document.createElement('div');
            productColors.className = 'flex-row';
            productColors.setAttribute('id', 'product_colors');
        productBlock.appendChild(productColors);

        for (j = 0 ; j < colors.length ; j ++) {
          let code = colors[j]['code'];
          let colorBlock = document.createElement('div');
            colorBlock.className = 'product_color';
            productColors.appendChild(colorBlock);
            colorBlock.style.backgroundColor = `#${code}`;
        }

        let productTitle = document.createElement('div');
            productTitle.className = 'product_title';
            productTitle.innerHTML = title;
        productBlock.appendChild(productTitle);

        let productPrice = document.createElement('div');
            productPrice.className = 'product_price';
            productPrice.innerHTML = `TWD. ${price}`;
        productBlock.appendChild(productPrice);
      }
    }
  }
  xhr.send();



//
// if data['next_paging'] && scroll to some point -->
// paging = data['next_paging']
// and run another ajax