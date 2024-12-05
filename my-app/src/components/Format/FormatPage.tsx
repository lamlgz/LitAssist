// src/components/Format/FormatPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FormatPage.css';
import { backend_port } from "../global_vars"

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

function FormatPage() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<HelloResponse>(`http://127.0.0.1:${backend_port}/format/hello/`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="page-container">
      <h2>文献格式转换</h2>
      <p className="page-message">{message ? message : "加载中..."}</p>
    </div>
  );
}

export default FormatPage;
