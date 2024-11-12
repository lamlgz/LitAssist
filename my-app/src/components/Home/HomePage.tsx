// src/components/Home/HomePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

function HomePage() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<HelloResponse>('http://127.0.0.1:8000/home/hello/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="homepage-container">
      <h2>欢迎使用智能文献阅读助手</h2>
      <p className="hello-message">{message ? message : "加载中..."}</p>
    </div>
  );
}

export default HomePage;
