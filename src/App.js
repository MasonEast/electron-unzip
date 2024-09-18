import React, { useState } from 'react';
// import { remote } from 'electron';
// import extractZip from 'extract-zip';
// import path from 'path';

const { ipcRenderer, remote } = window.require('electron');

const App = () => {
  const [filePath, setFilePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [message, setMessage] = useState('');

  const handleUnzip = async () => {
    const response = await ipcRenderer.invoke('unzip-file', {filePath, outputPath});

  };

  const selectFile = async () => {
    const {canceled, filePaths } = await ipcRenderer.invoke('open-file');

    if (!canceled) {
      setFilePath(filePaths[0]);
    }
  };

  const selectOutputDir = async () => {
    const {canceled, filePaths } = await ipcRenderer.invoke('open-directory');

    if (!canceled) {
        setOutputPath(filePaths[0]);
    }
  };

  return (
    <div>
      <h1>Unzipper</h1>
      <button onClick={selectFile}>Select ZIP File</button>
      <p>{filePath}</p>
      <button onClick={selectOutputDir}>Select Output Directory</button>
      <p>{outputPath}</p>
      <button onClick={handleUnzip}>Unzip</button>
      <p>{message}</p>
    </div>
  );
};

export default App;
