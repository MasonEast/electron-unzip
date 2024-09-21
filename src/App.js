import React, { useState } from "react";
import {
  AndroidOutlined,
  AppleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Tabs, message as antdMessage, Upload } from "antd";
import "./App.less";

const { Dragger } = Upload;

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [filePath, setFilePath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [message, setMessage] = useState("");

  const handleUnzip = async () => {
    const response = await ipcRenderer.invoke("unzip-file", {
      filePath,
      outputPath,
    });
    setMessage(response?.message || "err: 解压失败");
  };

  const selectFile = async () => {
    const { canceled, filePaths } = await ipcRenderer.invoke("open-file");

    if (!canceled) {
      setFilePath(filePaths[0]);
    }
  };

  const selectOutputDir = async () => {
    const { canceled, filePaths } = await ipcRenderer.invoke("open-directory");

    if (!canceled) {
      setOutputPath(filePaths[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      console.log(file.path, "---");
      // const outputDir = path.join(__dirname, 'ExtractedFiles'); // 可以根据需要调整输出目录
      if (file.type.includes("zip")) {
        // ipcRenderer.invoke("file-drop");
        // ipcRenderer.invoke("unzip-file", file.path, outputPath);
        setFilePath(file.path);
      } else {
        alert("请拖拽一个ZIP文件");
      }
    }
  };
  return (
    <div className="app">
      <Tabs
        defaultActiveKey="2"
        centered
        items={[
          {
            key: 1,
            label: `解压`,
            icon: <AppleOutlined />,
          },
          {
            key: 2,
            label: `压缩`,
            icon: <AndroidOutlined />,
          },
        ]}
      />
      <div className="dropArea" onDragOver={handleDragOver} onDrop={handleDrop}>
        <p>拖拽一个ZIP文件到这里</p>
        {filePath && <p>文件路径: {filePath}</p>}
      </div>
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
