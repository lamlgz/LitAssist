import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 左侧功能列表 */}
        <aside className="sidebar">
          <h2>功能列表</h2>
          <ul>
            <li><Link to="/extract-summary">文献信息提取和总结</Link></li>
            <li><Link to="/translate">文献即时翻译</Link></li>
            <li><Link to="/format-conversion">文献格式转换</Link></li>
            <li><Link to="/chart-extraction">图表信息提取</Link></li>
            <li><Link to="/paper-search">相关论文检索</Link></li>
          </ul>
        </aside>

        {/* 右上角登录注册 */}
        <div className="auth-section">
          <a href="#login">登录</a> | <a href="#register">注册</a>
        </div>

        {/* 中央内容区域 */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* 其他页面的路由可以在此处添加 */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
