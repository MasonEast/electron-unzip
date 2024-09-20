const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
// const chardet = require('chardet');
// const iconv = require('iconv-lite');

// const extractZip = require('extract-zip');
// const AdmZip = require('adm-zip');
const compressing = require('compressing');

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
    return {canceled, filePaths}
})

// 处理打开文件目录
ipcMain.handle('open-directory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    return {canceled, filePaths}
})

// 解压zip
ipcMain.handle('unzip-file', async (events, args) => {
    
    const {filePath, outputPath} = args
    // 将压缩包解压到 test 文件夹中
    try {
        await compressing.zip.uncompress(filePath,outputPath)
        return {success: true, message: `解压成功，已解压到：${outputPath}`}
    } catch(err) {
        throw err
    }
})

async function unzipWithProgress(zipFilePath, outputDir) {
    // 获取压缩文件的总大小
    const totalSize = fs.statSync(zipFilePath).size;
    let processedSize = 0;
  
    return new Promise((resolve, reject) => {
      // 创建读取流
      const readStream = fs.createReadStream(zipFilePath);
      const unzipStream = new compressing.zip.UncompressStream();
  
      // 监听读取流的数据事件
      readStream.on('data', chunk => {
        processedSize += chunk.length;
        const progress = (processedSize / totalSize) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
      });
  
      // 监听解压流的完成事件
      unzipStream.on('finish', () => {
        console.log('Extraction complete.');
        resolve();
      });
  
      // 监听错误事件
      readStream.on('error', reject);
      unzipStream.on('error', reject);
  
      // 开始解压
      readStream.pipe(unzipStream).pipe(compressing.zip.uncompress(outputDir));
    });
  }
