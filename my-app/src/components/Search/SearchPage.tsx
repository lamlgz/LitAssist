// src/components/Search/SearchPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchPage.css';

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

function SearchPage() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<HelloResponse>('http://127.0.0.1:8000/api/hello/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="page-container">
      <h2>相关文献检索</h2>
      <p className="page-message">{message ? message : "加载中..."}</p>
    </div>
  );
}

export default SearchPage;
