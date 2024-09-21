const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendFilePath: (filePath) => ipcRenderer.send("file-drop", filePath),
});
