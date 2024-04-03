const main_part = document.getElementsByClassName("main-part")[0];
const quote_part = document.getElementsByClassName("quote-part")[0];
const login_part = document.getElementsByClassName("login-part")[0];

const quote_btn = document.getElementsByClassName("quote-button")[0];
const quote_close_btn = document.getElementsByClassName("quote-close-button")[0];

var category_filter = {}
var color_filter = {}

//function for login credential checking
const login_form = document.querySelector("#login_form");
login_form.addEventListener("submit", async function(event){
        event.preventDefault();
        let username = $( "#username" ).val();
        let password = $( "#password" ).val();
        //check credential
        let is_login = await window.electronAPI.check_credential(username, password)
        if (is_login){
          document.querySelector("#main-part-header-username").innerHTML = "User: " + is_login.username
          login_part.style.display = "None";
          main_part.style.display = "block";
        }
});

// function to save quotes
function quote_table_save(){
  m4q.global();
  let items = $( "#quote-table" ).data("table").getItems()
  let items_reshape = []
  items.forEach((item, i) => {
    items_reshape[i] = [item[1], item[2][0].value, item[3][0].value]
  });
  let quote_group = $( "#quote-table-selector" )[0].value
  let res = window.electronAPI.quote_table_save(items_reshape, quote_group)
  m4q.noConflict();
}

// function to create price filter
// function price_filter_init(max_price, current_min, current_max) {
//   $( "#price-filter-slider" ).slider({
//     range: true,
//     min: 0,
//     max: max_price+10,
//     values: [ current_min, current_max ],
//     slide: function( event, ui ) {
//       $( "#price-filter-amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
//     }
//   });
//   $( "#price-filter-amount" ).val( "$" + $( "#price-filter-slider" ).slider( "values", 0 ) +
//     " - $" + $( "#price-filter-slider" ).slider( "values", 1 ) );
// }

// redraw the product list after filtering
function product_list_filter(el, type){
  val = el.getAttribute("data-caption");
  if (type == "category"){
    category_filter[val] = !category_filter[val]
  } else if (type == "color"){
    color_filter[val] = !color_filter[val]
  }
  m4q.global();
  $( "#products-list" ).data('list').draw();
  m4q.noConflict();
}

//filter 'all' function
function product_list_filter_all(el, type){
  checked = el.checked
  if (type == "category"){
    for (var key in category_filter){
      category_filter[key] = checked
    }
    document.querySelectorAll("#product-category-filter-list input").forEach(el => {
      el.checked=checked
    })

  } else if (type == "color"){
    for (var key in color_filter){
      color_filter[key] = checked
    }
    document.querySelectorAll("#product-color-filter-list input").forEach(el => {
      el.checked=checked
    })
  }
  m4q.global();
  $( "#products-list" ).data('list').draw();
  m4q.noConflict();
}

//function to delete item in quote
function delete_quote_item(product){
  m4q.global();
  $( "#quote-table" ).data('table').deleteItem(1, product);

  // recalculate the total price
  let total = 0;
  $( "#quote-table" ).data('table').getItems().forEach(item => {
    total+= +item[4]
  })
  $( "#quote-table" ).data('table').foots[4].title = ("$" + total.toFixed(2));
  $( "#quote-table" ).data('table')._rebuild()
  m4q.noConflict();
}

//function for update total price in quote table
function quote_table_update_totalprice(product_code, price, quantity){
  $( "#quote-table" ).data('table').updateItem(product_code, "TOTAL", (price * quantity).toFixed(2));
  let total = 0;
  $( "#quote-table" ).data('table').getItems().forEach(item => {
    total+= +item[4]
  })
  $( "#quote-table" ).data('table').foots[4].title = ("$" + total.toFixed(2));
}

// function for update quantity in quote table
function quote_table_update_quantity(el, product_code){
  m4q.global();
  let items = $( "#quote-table" ).data('table').getItems();
  for (i=0;i<items.length;i++){
    if (items[i][1] == product_code){
      //update quantity
      items[i][3].toggleAttr("value", el.value);
      // update total quantity
      quote_table_update_totalprice(product_code, items[i][2].attr("value"), items[i][3].attr("value"));
    }
  }
  $( "#quote-table" ).data('table')._rebuild(true);
  m4q.noConflict();
}

// function for update price in quote table
function quote_table_update_price(el, product_code){
  m4q.global();
  let items = $( "#quote-table" ).data('table').getItems();
  for (i=0;i<items.length;i++){
    if (items[i][1] == product_code){
      //update price
      items[i][2].toggleAttr("value", el.value)
      // update total quantity
      quote_table_update_totalprice(product_code, items[i][2].attr("value"), items[i][3].attr("value"));
    }
  }
  $( "#quote-table" ).data('table')._rebuild(true);
  m4q.noConflict();
}


window.electronAPI.product_item_list((rows) => {
  m4q.global();
  rows.forEach((row) => {
      //$( "<li><div class='product_item' id='" + row.Code + "' color='" + row.Color + "' category='" + row.Category +"'>" + row.Code + "</div></li>", $( "#products-list" ) );
      if (row.img == null){
        $( `<li class='product_item' id='` + row.Code + `' color='` + row.Color + `' category='` + row.Category + `'><figure class='text-center'><div class='img-container thumbnail'><img src='../img/no_img.jpeg'></div><figcaption class='product-list-figcap-code'>` + row.Code + `</figcaption></figure></li>`, $( "#products-list" ) );
      } else{
        $( `<li class='product_item' id='` + row.Code + `' color='` + row.Color + `' category='` + row.Category + `'><figure class='text-center'><div class='img-container thumbnail'><img src='data:image/png;base64, ${row.img}'></div><figcaption class='product-list-figcap-code'>` + row.Code + `</figcaption></figure></li>`, $( "#products-list" ) );
      }
  });

  let items = document.querySelectorAll('.product_item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Create a new window to show the specific item
      window.electronAPI.createItemWindow(item.id);
    });
  });
  $( "#products-list" ).data('list')._createItemsFromHTML();
  $( "#products-list" ).data('list').draw();

  // add product filters
  $( "#products-list" ).data('list').addFilter((item) => {
    item_color = item.getAttribute("color")
    item_category = item.getAttribute("category")
    if (category_filter[item_category] && color_filter[item_color]){
      return true
    } else{
      return false
    }
  }, false);

  m4q.noConflict(); // $ - now is a jquery constructor
});

//update quote table with data from db (specific serve for quotes' data from database)
function get_quote_update(rows){
  m4q.global();
  $( "#quote-table" ).data('table').clear()
  rows.forEach(row => {
    let quantity_part = $( `<input type="number" class="quote-quantity-input" step="1" min="1" value="`+ row.quantity +`" onkeypress="return event.charCode >= 48" required onChange="quote_table_update_quantity(this, '`+ row.product +`')"></input>` )
    let price_part = $( `<input type="number" class="quote-price-input" value="`+ row.price +`" required onChange="quote_table_update_price(this, '`+ row.product +`')"></input>` )
    $( "#quote-table" ).data('table').addItem([$( `<button type='button' onclick="delete_quote_item('`+ row.product +`')">x</button>` ), row.product, price_part, quantity_part, row.price*row.quantity]);
  })
  $( "#quote-table" ).data('table')._rebuild(true);

  let total = 0;
  $( "#quote-table" ).data('table').getItems().forEach(item => {
    total+= +item[4]
  })
  $( "#quote-table" ).data('table').foots[4].title = ("$" + total.toFixed(2));
  $( "#quote-table" ).data('table')._rebuild(true);
  m4q.noConflict();
}

// get the specific quote based on the quote table choosed
async function get_specific_quotes(quote_group){
  let rows = await window.electronAPI.getRequestQuote(quote_group)
  get_quote_update(rows)
}

// add product to quote
window.electronAPI.addQuote((rows, product_quantity) => {
  m4q.global();
  let items = $( "#quote-table" ).data('table').getItems();
  rows.forEach(row => {
    let is_found = false;
    for (i=0;i<items.length;i++){
      if (items[i][1] == row.Code){
        is_found = true
        //update quantity
        items[i][3].toggleAttr("value", (parseInt(items[i][3].attr("value"))+parseInt(product_quantity)))
        //update total price
        quote_table_update_totalprice(row.Code, items[i][2].attr("value"), items[i][3].attr("value"))
      }
    }
    if (!is_found){
      let quantity_part = $( `<input type="number" class="quote-quantity-input" step="1" min="1" value="`+ product_quantity +`" onkeypress="return event.charCode >= 48" required onChange="quote_table_update_quantity(this, '`+ row.Code +`')"></input>` )
      let price_part = $( `<input type="number" class="quote-price-input" value="0" required onChange="quote_table_update_price(this, '`+ row.Code +`')"></input>` )
      $( "#quote-table" ).data('table').addItem([$( `<button type='button' onclick="delete_quote_item('`+ row.Code +`')">x</button>` ), row.Code, price_part, quantity_part, "0.00"]);
    }
  });
  $( "#quote-table" ).data('table')._rebuild(true);
  m4q.noConflict();
});

// Create the Filter list
window.electronAPI.get_categories_list((rows) => {
  m4q.global();
  rows.forEach(row => {
    if (row.Category != "OTHER"){
      $( `<div><input type="checkbox" data-role="checkbox" data-style="2" id="product-filter-category-`+ row.Category +`" data-caption="`+ row.Category +`" checked onChange="product_list_filter(this, 'category')"></div>` ,$( "#product-category-filter-list" ) );
      category_filter[row.Category] = true
    }
  });
  $( `<div><input type="checkbox" data-role="checkbox" data-style="2" id="product-filter-category-`+ "OTHER" +`" data-caption="`+ "OTHER" +`" checked onChange="product_list_filter(this, 'category')"></div>` ,$( "#product-category-filter-list" ) );
  category_filter["OTHER"] = true
  $( `<div><input type="checkbox" data-role="checkbox" data-style="2" id="product-filter-category-`+ "all" +`" data-caption="`+ "ALL" +`" checked onChange="product_list_filter_all(this, 'category')"></div>` ,$( "#product-category-filter-list" ) );
  m4q.noConflict();
});
// Create the filter color
window.electronAPI.get_color_list((rows) => {
  m4q.global();
  rows.forEach(row => {
    $( `<div><input type="checkbox" data-role="checkbox" data-style="2" id="product-filter-color-`+ row.Color +`" data-caption="`+ row.Color +`" checked onChange="product_list_filter(this, 'color')"></div>` ,$( "#product-color-filter-list" ) );
    color_filter[row.Color] = true
  });
  $( `<div><input type="checkbox" data-role="checkbox" data-style="2" id="product-filter-color-all" data-caption="ALL" checked onChange="product_list_filter_all(this, 'color')"></div>` ,$( "#product-color-filter-list" ) );
  m4q.noConflict();
});

// quote table print function
function quote_table_print(){
  window.electronAPI.print(document.querySelector('.quote-table').outerHTML);
}

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
