const productImgSwiper = new Swiper(".product-img-swiper", {
  pagination: {
    el: ".product-img-swiper-pagination",
    clickable: true,
  },
});

window.electronAPI.getProductImg((rows) => {
  let e_img = document.createElement('img');
  e_img.src = `data:image/png;base64, ${rows}`;
  let swiper_slide = document.createElement("div");
  swiper_slide.classList.add('swiper-slide');
  swiper_slide.appendChild(e_img);
  productImgSwiper.appendSlide(swiper_slide);
  productImgSwiper.update();
});

window.electronAPI.getProductDetails((rows) => {
  //set page hearder
  $( "<h1>" + rows[0].product_id + "</h1>", $( ".product-header" ) );

  //init the details
  rows.forEach((row) => {
    // products select
    $( "<option value='" + row.Code + "'>" + row.Code + "</option>", $( "#product-code-select" ) );
  });
  $( "#product-code-select" ).data('select')._createOptions();
    // Desc
  $( "<li><strong>Description</strong>: <span id='product-desc'>" + rows[0].Description.toLowerCase() + "</span></li>", $( "#product-detail-list" ) );
    // Category
  $( "<li><strong>Category</strong>: <span id='product-category'>" + rows[0].Category.toLowerCase() + "</span></li>", $( "#product-detail-list" ) );
    // Color
  $( "<li><strong>Color</strong>: <span id='product-color'>" + rows[0].Color.toLowerCase() + "</span></li>", $( "#product-detail-list" ) );
    // Range
  $( "<li><strong>Range</strong>: <span id='product-range'>" + rows[0].Range.toLowerCase() + "</span></li>", $( "#product-detail-list" ) );
    // Warranty
  $( "<li><strong>Warranty</strong>: <span id='product-warranty'>" + rows[0].Warranty.toLowerCase() + "</span></li>", $( "#product-detail-list" ) );
    // Barcode
  $( "<li><strong>Barcode</strong>: <span id='product-barcode'>" + rows[0].Barcode + "</span></li>", $( "#product-detail-list" ) );
    // Price (only for admin)
  // $( "<li><strong>Price</strong>: $<span id='product-price'>" + rows[0].Price + "</span></li>", $( "#product-detail-list" ) );

  //handle product code selected
  $( "#product-code-select" ).change(async () => {
    let selected = $( "#product-code-select" ).data("select").getSelected()[0];
    let new_details = await window.electronAPI.getNewProductDetails(rows[0].product_id, selected);
    $( "#product-desc" ).innerText(new_details.Description.toLowerCase());
    $( "#product-category" ).innerText(new_details.Category.toLowerCase());
    $( "#product-color" ).innerText(new_details.Color.toLowerCase());
    $( "#product-range" ).innerText(new_details.Range.toLowerCase());
    $( "#product-warranty" ).innerText(new_details.Warranty.toLowerCase());
    $( "#product-barcode" ).innerText(new_details.Barcode);
    // admin only
    // $( "#product-price" ).innerText(new_details.Price);
  });
});

//add-to-quote-form submit
const add_quote_form = document.querySelector("#add-to-quote-form");
add_quote_form.addEventListener("submit", function(event){
        event.preventDefault();
        let product_code = $( "#product-code-select" ).val();
        let product_quantity = $( "#add-to-quote-quantity" ).val();
        window.electronAPI.addProduct(product_code, product_quantity);
});
