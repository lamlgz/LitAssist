// src/components/Translate/TranslatePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TranslatePage.css';

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

function TranslatePage() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<HelloResponse>('http://127.0.0.1:8000/translate/hello/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="page-container">
      <h2>文献翻译</h2>
      <p className="page-message">{message ? message : "加载中..."}</p>
    </div>
  );
}

export default TranslatePage;
