const { ipcRenderer } = require('electron');

document.getElementById('start-unzip').addEventListener('click', () => {
  const zipFilePath = 'your-archive.zip'; // 替换为你的 zip 文件路径
  const outputDir = 'output-folder'; // 替换为你的输出目录
  ipcRenderer.send('start-unzip', zipFilePath, outputDir);
});

ipcRenderer.on('unzip-progress', (event, progress) => {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  progressBar.value = progress;
  progressText.textContent = `${progress}%`;
});

ipcRenderer.on('unzip-complete', () => {
  alert('Unzip complete!');
});

ipcRenderer.on('unzip-error', (event, errorMessage) => {
  alert(`Error during unzip: ${errorMessage}`);
});