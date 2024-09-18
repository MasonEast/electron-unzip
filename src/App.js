import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
// import Content from './components/Content';
import Footer from './components/Footer';
import './App.less';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [chapters, setChapters] = useState([]);

  const openFile = async () => {
    const response = await ipcRenderer.invoke('open-file');
    if (!response.canceled) {
      setChapters([]);
    }
  };



  return (
    <div className="app">
      <Header />
      <button onClick={openFile}>打开文件</button>
      <div className='content'>
      <Sidebar chapters={chapters} />
      <pre className='text_pre'>
      {chapters.map((chapter, index) => (
            <div key={index}>
              <h2 id={`chapter${index}`}>{chapter.title}</h2>
              <p>{chapter.content}</p>
            </div>
          ))}
      </pre>
      </div>
      <Footer />
    </div>
  );
};

export default App;