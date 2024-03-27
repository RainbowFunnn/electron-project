const { app, BrowserWindow, ipcMain, Menu, dialog, Notification } = require('electron')
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const fs = require('node:fs')

let win;
let childWindows = [];
var user = null
var username = null

const print_options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
        marginType: 'printableArea'
    },
    landscape: true,
    pagesPerSheet: 1,
    collate: false
}

function db_read(win, name, query) {
  // open database
  let db = new sqlite3.Database(__dirname + '/module/py/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    win.webContents.send(name, rows)
  });

  // close database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

function db_read_img(win, name, query) {
  // open database
  let db = new sqlite3.Database(__dirname + '/module/py/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Connected to the chinook database.');
  });

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    };
    rows.forEach(row => {
      if (row.img == null) {
        win.webContents.send(name, null);
      } else{
        let imageBuffer = Buffer.from(row.img, 'binary');
        let base64Image = imageBuffer.toString('base64');
        win.webContents.send(name, base64Image);
      }
    });
  });

  // close database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Close the database connection.');
  });
}



// async function getNewProductDetails(event, product_id, product_code) {
//   // open database
//   let db = new sqlite3.Database('./module/py/database.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     //console.log('Connected to the chinook database.');
//   });
//   let query = `SELECT * FROM Products WHERE product_id = ? AND Code = ?`;
//   const getResults = () => {
//     return new Promise((resolve, reject) => {
//       db.all(query, [product_id, product_code], (err, rows) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(rows);
//         }
//       });
//     });
//   };
//
//   const results = await getResults();
//
//   // close database
//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     //console.log('Close the database connection.');
//   });
//
//   return results[0];
// }

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js')
    }
  })

  let param;
  // var python = require('child_process').spawn('python', ['./module/py/test.py', "hellofromelectron"]);
  // var python = require('child_process').execFile('./py_scripts/test.exe', []);
  // python.stdout.on('data',function(data){
  //   param = data.toString('utf8');
  //   console.log(JSON.parse(param)[1]);
  // });

  win.loadFile('module/html/index.html')
  // 打开开发工具
  win.webContents.openDevTools()

  win.on('closed', () => {
    // cause error in macOS
    // win = null;

    // Close all child windows when the main window is closed
    if (childWindows){
      childWindows.forEach(childWindow => {
        childWindow.close();
      });
    };

    // Quit the app if there are no more windows open
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  //Customize Menu
  const file_subMenu = [
    {
      label: "Import",
      click: () => {
      },
    },
    {
      label: "Quit",
      role: "quit"
    }
  ];

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: file_subMenu
    },
    {
      label: 'Edit',
      role: "editMenu"
    },
    {
      label: "View",
      role: "viewMenu"
    },
    {
      label: "Window",
      role: "windowMenu"
    }
  ]);

  Menu.setApplicationMenu(menu);
  // When the main window is ready
  win.webContents.on('did-finish-load', () => {
    // Get and Send all Products ID to front page
    db_read(win, "product_item_list", `SELECT Code, Price, Category, Color
                                       FROM Products`);
    // Create the Category filter list
    db_read(win, "categories-list", `SELECT DISTINCT (Category) FROM Products ORDER BY Category ASC NULLS LAST`);

    // Create the Color filter list
    db_read(win, "color-list", `SELECT DISTINCT (Color) FROM Products ORDER BY Color ASC NULLS LAST`);
  });

}


app.whenReady().then(() => {
  // ipcMain.handle("dialog:getNewProductDetails", getNewProductDetails);

  // addProduct function
  ipcMain.on('addProduct', (event, product_code, product_quantity) => {

    // extract product information from db
    let query = `SELECT Code, Price FROM Products WHERE Code = "` + product_code + `"`;
    let db = new sqlite3.Database(__dirname + '/module/py/database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    db.all(query, [], (err, rows) => {
      if (err) {
        throw err;
      }
      win.webContents.send("addQuote", rows, product_quantity);
    });

    // close database
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
  })

  createWindow();
})


// Create new child item window
ipcMain.on('create-item-window', (event, item_id) => {
  let itemWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences:{
      preload: path.join(__dirname, 'preload_product.js')
    }
  });
  itemWindow.loadFile('module/html/product.html');
  itemWindow.setMenu(Menu.buildFromTemplate([]));

  // 打开开发工具
  itemWindow.webContents.openDevTools();

  itemWindow.on('closed', () => {
    // Remove the closed window reference from the array
    // ipcMain.removeAllListeners();
    const index = childWindows.indexOf(itemWindow);
    itemWindow = null;
    if (index > -1) {
      childWindows.splice(index, 1);
    }
  });

  // Store the child window reference in the array
  childWindows.push(itemWindow);

  itemWindow.webContents.on('did-finish-load', () => {
    // init the page content
      // Get img
    db_read_img(itemWindow, "productImg", "SELECT img FROM Products WHERE Code = '"+ item_id +"';")
      //get all details
    db_read(itemWindow, "productDetail", "SELECT * FROM Products WHERE Code = '" + item_id + "'")
  });

});


//print function
// quote table print
ipcMain.on('print_quote_table', (event, content) => {
  let printWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
  });

  printWindow.loadFile('module/html/quote_print.html')

  printWindow.webContents.on('did-finish-load', async () => {
    await printWindow.webContents.executeJavaScript("document.body.innerHTML += `" + content + "`;")
    await printWindow.webContents.executeJavaScript(`remove_elements()`)
    await printWindow.webContents.print(print_options)

    // print to pdf test on macOS
    // await printWindow.webContents.printToPDF({landscape: false}).then(data => {
    //     fs.writeFile("test.pdf", data, function (err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log('PDF Generated Successfully');
    //         }
    //     });
    // }).catch(error => {
    //     console.log(error)
    // });

    printWindow.destroy();
  });
})

// product page print
ipcMain.on('print_product', (event, content) => {
  let printWindow = new BrowserWindow({
    show: false,
    width: 900,
    height: 600,
  });

  printWindow.loadFile('module/html/product_print.html')
  printWindow.webContents.on('did-finish-load', async () => {
    await printWindow.webContents.executeJavaScript("document.body.innerHTML += `" + content + "`;")
    await printWindow.webContents.executeJavaScript(`remove_elements()`)
    await printWindow.webContents.print(print_options);

    printWindow.destroy();
  });
})

// check login credential
ipcMain.handle("check_credential", async (event, username, password) => {
  //check credential in database
  let db = new sqlite3.Database(__dirname + '/module/py/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  const getResults = () => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row == null){
            resolve(false)
          }
          else{
            resolve(row);
          }
        }
      });
    });
  };

  let res = await getResults()

  // close database
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });

  if (!res){
    dialog.showMessageBox({message: "Invalid username or password. Please try again.", title: "Login Failed"})
  } else{
    user = res.user_group
    username = res.username
  }
  return res
})

//
// itemWindow.webContents.printToPDF({}).then(data => {
//     console.log("here")
//     fs.writeFile("test.pdf", data, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('PDF Generated Successfully');
//         }
//     });
// }).catch(error => {
//     console.log(error)
// });
