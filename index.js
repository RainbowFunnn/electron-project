const main_part = document.getElementsByClassName("main-part")[0];
// const filter_part = document.getElementsByClassName("filter-part")[0];
const quote_part = document.getElementsByClassName("quote-part")[0];
const login_part = document.getElementsByClassName("login-part")[0];

// const filter_close_btn = document.getElementsByClassName("filter-close-button")[0];
// const filter_done_btn = document.getElementsByClassName("filter-done-button")[0];
// const filter_clear_btn = document.getElementsByClassName("filter-clear-all-button")[0];

const quote_btn = document.getElementsByClassName("quote-button")[0];
const quote_close_btn = document.getElementsByClassName("quote-close-button")[0];

var min_price_filter, max_price_filter, max_price;

//function for login credential checking
const login_form = document.querySelector("#login_form");
login_form.addEventListener("submit", function(event){
        event.preventDefault();
        let username = $( "#username" ).val();
        let password = $( "#password" ).val();
        //check credential
        is_login = true
        if (is_login){
          login_part.style.display = "None";
          main_part.style.display = "block";
        }
});

// function to create price filter
function price_filter_init(max_price, current_min, current_max) {
  $( "#price-filter-slider" ).slider({
    range: true,
    min: 0,
    max: max_price+10,
    values: [ current_min, current_max ],
    slide: function( event, ui ) {
      $( "#price-filter-amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }
  });
  $( "#price-filter-amount" ).val( "$" + $( "#price-filter-slider" ).slider( "values", 0 ) +
    " - $" + $( "#price-filter-slider" ).slider( "values", 1 ) );
}

//function to delete item in quote
function delete_quote_item(product){
  m4q.global();
  $( "#quote-table" ).data('table').deleteItem(1, product);
  $( "#quote-table" ).data('table').draw();
  $( "#quote-table" ).data('table').rebuildIndex()
  m4q.noConflict();
}

// window.electronAPI.create_price_filter((rows) => {
//   max_price = rows[0].max_price;
//   min_price_filter = 0;
//   max_price_filter = max_price+10;
//   price_filter_init(max_price, 0, max_price+10);
//   //clearALL function
//   filter_clear_btn.onclick = function(){
//     price_filter_init(max_price, 0, max_price+10);
//   }
//
// });


window.electronAPI.product_item_list((rows) => {
  m4q.global();
  rows.forEach((row) => {
      $( "<li><div class='product_item' id=" + row.product_id + " prices=" + row.prices + ">" + row.product_id + "</div></li>", $( "#products-list" ) );
  });

  let items = document.querySelectorAll('.product_item');
  items.forEach(item => {
    // set the attribute of each item for filter
    // let item_attributes = await window.electronAPI.getItemAttributes(item.id);

    item.addEventListener('click', () => {
      // Create a new window to show the specific item
      window.electronAPI.createItemWindow(item.id);
    });
  });
  $( "#products-list" ).data('list')._createItemsFromHTML();
  $( "#products-list" ).data('list').draw();

  // add filter icon in search part
  // const product_search_wrapper_buttons = document.getElementsByClassName("button-group")[0];
  // const filter_icon_button = document.createElement("button");
  // filter_icon_button.classname="button";
  // filter_icon_button.type = "button";
  // filter_icon_button.onclick = function() {
  //   main_part.style.display = "none";
  //   filter_part.style.display = "block";
  // };
  //
  // const filter_icon = document.createElement("span");
  // filter_icon.className = "mif-filter product-search-filter";
  // filter_icon_button.appendChild(filter_icon);
  // product_search_wrapper_buttons.appendChild(filter_icon_button);

  m4q.noConflict(); // $ - now is a jquery constructor
});

//
window.electronAPI.addQuote((rows, product_quantity) => {
  m4q.global();
  let items = $( "#quote-table" ).data('table').getItems();
  rows.forEach(row => {
    let is_found = false;
    for (i=0;i<items.length;i++){
      if (items[i][1] == row.Code){
        is_found = true
        $( "#quote-table" ).data('table').updateItem(row.Code, "PRICE", row.Price);
        $( "#quote-table" ).data('table').updateItem(row.Code, "QUANTITY", (parseInt(items[i][3])+parseInt(product_quantity)));
        $( "#quote-table" ).data('table').updateItem(row.Code, "TOTAL", (parseInt(items[i][3])*row.Price));
        $( "#quote-table" ).data('table').draw();
      }
    }
    if (!is_found){
      $( "#quote-table" ).data('table').addItem([$( `<button type='button' onclick="delete_quote_item('`+ row.Code +`')">x</button>` ), row.Code, row.Price, product_quantity, row.Price * product_quantity]);
    }
  });
  $( "#quote-table" ).data('table').rebuildIndex()
  m4q.noConflict();
});


//filter cancel & done
// filter_close_btn.onclick = function(){
//   main_part.style.display = "block";
//   filter_part.style.display = "none";
//   price_filter_init(max_price, min_price_filter, max_price_filter)
// };
//
// filter_done_btn.onclick = function(){
//   // price filter
//   min_price_filter = $( "#price-filter-slider" ).slider( "values", 0 );
//   max_price_filter = $( "#price-filter-slider" ).slider( "values", 1 );
//   m4q.global();
//   $( "#products-list" ).data('list').removeFilters(false);
//   $( "#products-list" ).data('list').addFilter((item) => {
//     let product_prices = item.getElementsByClassName("product_item")[0].getAttribute('prices').split(",");
//     for (let i = 0; i < product_prices.length; i++) {
//       if (product_prices[i] >= min_price_filter && product_prices[i] <= max_price_filter) {
//         return true;
//       }
//     }
//     return false;
//   }, true);
//   m4q.noConflict();
//
//   main_part.style.display = "block";
//   filter_part.style.display = "none";
// }

//Quote Part
///open the quote page
quote_btn.onclick = function(){
  main_part.style.display = "none";
  quote_part.style.display = "block";
};

///close the quote page
quote_close_btn.onclick = function(){
  main_part.style.display = "block";
  quote_part.style.display = "none";
}
