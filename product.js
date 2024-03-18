// const productImgSwiper = new Swiper(".product-img-swiper", {
//   pagination: {
//     el: ".product-img-swiper-pagination",
//     clickable: true,
//   },
// });

window.electronAPI.getProductImg((rows) => {
  let e_img = document.getElementById('product-img');
  if (rows == null){
    e_img.src = `module/img/no_img.jpeg`
  } else {
    e_img.src = `data:image/png;base64, ${rows}`;
  }
});

window.electronAPI.getProductDetails((rows) => {
  //set page hearder
  $( "<h1>" + rows[0].Code + "</h1>", $( ".product-header" ) );

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
});

//add-to-quote-form submit
const add_quote_form = document.querySelector("#add-to-quote-form");
add_quote_form.addEventListener("submit", function(event){
        event.preventDefault();
        let product_code = $( "#product-code-select" ).val();
        let product_quantity = $( "#add-to-quote-quantity" ).val();
        window.electronAPI.addProduct(product_code, product_quantity);
});
