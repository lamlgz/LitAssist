import React, { useEffect, useState } from 'react';
import axios from 'axios';


// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}


function ExtractSummary() {
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    axios.get<HelloResponse>('http://127.0.0.1:8000/api/chart-extraction/')
      .then(response => {
        setSummary(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
      });
  }, []);

  return (
    <div>
      <h2>图表信息提取</h2>
      <p>{summary ? summary : "加载中..."}</p>
    </div>
  );
}

export default ExtractSummary;
