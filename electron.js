const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const chardet = require('chardet');
const iconv = require('iconv-lite');

const extractZip = require('extract-zip');
const AdmZip = require('adm-zip');
const compressing = require('compressing');


// const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

// 引入 electron-reload
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
    ignored: /node_modules|[/\\]\./
  });

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 可选的预加载脚本
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.loadURL('http://localhost:3000'); // React 应用的地址
  
  win.webContents.openDevTools(); // 打开开发者工具
}

app.on('ready', async () => {
    try {
        // await installExtension(REACT_DEVELOPER_TOOLS); // 使用react调试工具
        createWindow();
    } catch(err) {
        console.error('Failed to install React DevTools: ', err)
    }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理打开文件事件
ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '压缩文件', extensions: ['zip'] }]
    })
    if(canceled){
        return {canceled: true}
    } else {
        console.log(filePaths, '--')
        // try {
        //     await extractZip(filePath, { dir: path.resolve('.') });
        //   } catch (err) {
        //     return {canceled: false, content: err.message}
        //   }
        // const encoding = chardet.detectFileSync(filePath); // 检测文件的实际编码
        // const buffer = fs.readFileSync(filePath);
        // const content = iconv.decode(buffer, encoding); // 用正确的编码读取文件内容，从而避免出现乱码问题

        return {canceled: false, filePaths}
    }
})

// 处理打开文件目录
ipcMain.handle('open-directory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    return {canceled, filePaths}
})


// 解压zip
// ipcMain.handle('unzip-file', async (events, args) => {
//     try {
//             const {filePath, outputPath} = args
//             console.log(args, 'filePath, outputPath')
//             await extractZip(filePath, { dir: path.resolve(outputPath) });
//           } catch (err) {
//             throw err
//           }
// })

// ipcMain.handle('unzip-file', async (events, args) => {
    
//     const {filePath, outputPath} = args
//     // 加载 ZIP 文件
//     const zip = new AdmZip(filePath);

//     // 指定解压目录
//     const targetDir = outputPath;
    
//     zip.extractAllTo(targetDir, true, 'utf8');  // 使用手动指定的编码


//     // 获取 ZIP 文件条目
//     const zipEntries = zip.getEntries();

//     console.log(zipEntries, 'filePath, outputPath-----')

//     zipEntries.forEach((zipEntry) => {
//         // 检测文件名编码
//         const buffer = Buffer.from(zipEntry.entryName, 'binary');
//         const encoding = detectEncoding(buffer);
//         const decodedFileName = iconv.decode(buffer, encoding);
//         const targetPath = path.join(targetDir, decodedFileName);
    
//         // 如果是目录，确保目录存在
//         if (zipEntry.isDirectory) {
//             fs.mkdirSync(targetPath, { recursive: true });
//         } else {
//             // 如果是文件，写入文件内容
//             const data = zipEntry.getData();
//             fs.mkdirSync(path.dirname(targetPath), { recursive: true }); // 确保目标目录存在
//             fs.writeFileSync(targetPath, data);
//         }
//     });
    
// })

// 解压zip
ipcMain.handle('unzip-file', async (events, args) => {
    
    const {filePath, outputPath} = args
    // 将压缩包解压到 test 文件夹中
    compressing.zip.uncompress(filePath,outputPath).then(() => {
        console.log('解压完成')
    }).catch(() => {
        console.log('解压失败')
    })

    // 将压缩包解压到当前文件夹中
    // compressing.zip.uncompress('./test.zip','./')

})


// 检测编码函数
function detectEncoding(buffer) {
    const encoding = chardet.detect(buffer);
    if (encoding) {
        console.log(`Detected encoding: ${encoding}`);
        return encoding;
    } else {
        // 默认编码 (可以修改成你特定的默认值)
        return 'utf8';
    }
}

