import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

function App() {
  // 创建一个状态来存储从后端获取的消息
  const [message, setMessage] = useState<string>('');

  // 使用 useEffect 在组件加载时发送请求
  useEffect(() => {
    axios.get<HelloResponse>('http://127.0.0.1:8000/api/hello/')
      .then(response => {
        setMessage(response.data.message);  // 将后端返回的消息设置到状态中
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message ? message : "Loading..."}</p>
      </header>
    </div>
  );
}

export default App;
