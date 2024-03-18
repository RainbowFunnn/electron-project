const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  product_item_list: (callback) => ipcRenderer.on('product_item_list', (_event, value) => callback(value)),
  createItemWindow: (item_id) => ipcRenderer.send('create-item-window', item_id),
  addQuote: (callback) => ipcRenderer.on('addQuote', (_event, rows, product_quantity) => callback(rows, product_quantity))
  // getItemAttributes: (item_id) => ipcRenderer.invoke('get-item-attributes', item_id)
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
