const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  product_item_list: (callback) => ipcRenderer.on('product_item_list', (_event, value) => callback(value)),
  createItemWindow: (item_id) => ipcRenderer.send('create-item-window', item_id),
  addQuote: (callback) => ipcRenderer.on('addQuote', (_event, rows, product_quantity) => callback(rows, product_quantity)),
  get_categories_list: (callback) => ipcRenderer.on('categories-list', (_event, rows) => callback(rows)),
  get_color_list: (callback) => ipcRenderer.on('color-list', (_event, rows) => callback(rows)),
  print: (content) => ipcRenderer.send('print_quote_table', content),
  check_credential: (username, password) => ipcRenderer.invoke('check_credential', username, password)
})


// window.addEventListener('DOMContentLoaded', () => {
//
//   const items = document.querySelectorAll('.product_item');
//   items.forEach(item => {
//     item.addEventListener('click', () => {
//       // When clicked, log the ID of the div
//       console.log(item.id);
//
//       // Create a new window to show the specific item
//       createItemWindow()
//
//     });
//   });
// });
