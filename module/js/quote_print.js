
function remove_elements(){
  //remove download button
  document.getElementsByClassName('quote-table-download')[0].remove();
  m4q.global();
  //remove the first column
  $( "#quote-table thead tr th" )[2].remove()
  $( "#quote-table tbody tr" ).each(function(){
    if ($(this).find("td")[2] != null){
      $(this).find("td")[2].remove()
    }
  })
  m4q.noConflict();
}
