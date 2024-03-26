const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getProductImg: (callback) => ipcRenderer.on('productImg', (_event, value) => callback(value)),
  getProductDetails: (callback) => ipcRenderer.on('productDetail', (_event, value) => callback(value)),
  // getNewProductDetails: (product_id, product_code) => ipcRenderer.invoke('dialog:getNewProductDetails', product_id, product_code),
  addProduct: (product_code, product_quantity) => ipcRenderer.send('addProduct', product_code, product_quantity),
  print: (content) => ipcRenderer.send('print_product', content)
})

// window.addEventListener('DOMContentLoaded', () => {
//
//   const productImgSwiper = new Swiper(".product-img-swiper", {
//     pagination: {
//       el: ".product-img-swiper-pagination",
//       clickable: true,
//     },
//   });
// });
