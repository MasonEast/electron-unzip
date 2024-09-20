import React, { useState } from 'react';
import { AndroidOutlined, AppleOutlined, InboxOutlined } from '@ant-design/icons';
import { Tabs, message as antdMessage, Upload } from 'antd';

const { Dragger } = Upload;

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [filePath, setFilePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [message, setMessage] = useState('');

  const handleUnzip = async () => {
    const response = await ipcRenderer.invoke('unzip-file', {filePath, outputPath});
    setMessage(response?.message || 'err: 解压失败')

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

  const props = {
    name: 'file',
    multiple: true,
  //   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        antdMessage.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        antdMessage.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files[0].size);
    },
  };

  return (
    <div>
    <Tabs
    defaultActiveKey="2"
    centered
    items={[{
        key: 1,
        label: `解压`,
        icon: <AppleOutlined />,
    },{
        key: 2,
        label: `压缩`,
        icon: <AndroidOutlined />,
    }]}
  />
    <Dragger {...props}>
        <p className="ant-upload-drag-icon">
        <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
        banned files.
        </p>
    </Dragger>
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
