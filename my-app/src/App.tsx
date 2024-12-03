import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/Home/HomePage';
import SummaryPage from './components/Summary/SummaryPage';
import TranslatePage from './components/Translate/TranslatePage';
import FormatPage from './components/Format/FormatPage';
import ChartPage from './components/Chart/ChartPage';
import SearchPage from './components/Search/SearchPage';

function App() {
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileIdChange = (id: string) => {
    setFileId(id);
    localStorage.setItem("fileId", id); // 缓存 fileId
  };

  const getSummaryLink = () => {
    const storedFileId = localStorage.getItem("fileId");
    return storedFileId ? `/summary?fileId=${storedFileId}` : "/summary";
  };

  return (
    <Router>
      <div className="App">
        <aside className="sidebar">
          <h2>功能列表</h2>
          <ul>
            <li><Link to="/">主页</Link></li>
            <li><Link to={getSummaryLink()}>文献信息提取和总结</Link></li>
            <li><Link to="/translate">文献即时翻译</Link></li>
            <li><Link to="/format">文献格式转换</Link></li>
            <li><Link to="/chart">图表信息提取</Link></li>
            <li><Link to="/search">相关论文检索</Link></li>
          </ul>
        </aside>

        <div className="auth-section">
          <a href="#login">登录</a> | <a href="#register">注册</a>
        </div>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/summary" element={<SummaryPage onFileIdChange={handleFileIdChange} />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/format" element={<FormatPage />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
