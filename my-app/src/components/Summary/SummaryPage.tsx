import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SummaryPage.css';

// 定义后端响应的数据类型
interface AnalyzeResponse {
  result: string;
}

function SummaryPage() {
  const [result, setResult] = useState<string>('加载中...');

  useEffect(() => {
    // 模拟从后端获取处理后的结果
    axios.post<AnalyzeResponse>('http://127.0.0.1:8000/summary/summary/', {
      pdf_text: "提供的 PDF 文本内容示例", // 替换为实际的文本
    })
      .then(response => {
        setResult(response.data.result);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setResult('无法加载数据，请稍后重试。');
      });
  }, []);

  return (
    <div className="page-container">
      <h2>文献内容总结</h2>
      <p className="page-message">{result}</p>
    </div>
  );
}

export default SummaryPage;
