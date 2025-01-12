import React, { useState } from 'react';
import axios from 'axios';
import './FormatPage.css';

// 定义后端响应的数据类型
interface HelloResponse {
  message: string;
}

// 定义后端响应的数据类型
interface PdfResponse {
  content: string;
  image_paths: string[];
  output_dir: string;
}

function FormatPage() {
  const [file, setFile] = useState<File | null>(null); // 上传的文件
  const [markdown, setMarkdown] = useState<string>(''); // 后端返回的 Markdown 格式文本
  const [error, setError] = useState<string>(''); // 错误信息
  const [responseContent, setResponseContent] = useState<string>(''); // 后端返回的解析文本内容


// 获取后端欢迎消息
React.useEffect(() => {
  axios.get<HelloResponse>('http://127.0.0.1:8000/format/hello/')
    .then(response => {
      postMessage(response.data.message);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}, []);

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  
 // 发送文件到后端并获取解析结果
 const handleFileUpload = async () => {
  if (!file) {
    setError('请先选择一个文件');
    return;
  }

  const formData = new FormData();
  formData.append('pdf_file', file);

  try {
    // 上传文件并指定响应数据类型为 PdfResponse
    const response = await axios.post<PdfResponse>('http://127.0.0.1:8000/format/pdf/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { content, image_paths, output_dir } = response.data;

    // 文件上传成功，尝试获取解析结果
    if (content) {
      setResponseContent(content); // 设置从后端获取到的内容
      setMarkdown(content); // 如果需要，也可以将内容以 Markdown 格式显示
      setError(''); // 清除上传过程中的错误
      // 处理图片路径（显示缩略图或其他操作）
      console.log('Image Paths:', image_paths);
      console.log('Output Directory:', output_dir);
    } else {
      // 如果没有返回 content，说明格式转换失败
      setError('格式转换失败');
    }
  } catch (err: any) {
    // 如果文件上传失败，显示上传失败的错误
    console.error('Error uploading file:', err);
    
    // 检查错误对象，显示具体错误信息
    if (err.response) {
      // 服务器返回了错误
      setError(`上传失败: ${err.response.data.message || '未知错误'}`);
    } else if (err.request) {
      // 请求已发送，但没有收到响应
      setError('请求已发送，但未收到响应');
    } else {
      // 其他错误
      setError(`上传失败: ${err.message}`);
    }
  }
};


  return (
    <div className="formatpage-container">
      <div className="header">
        <h2>文献格式转换</h2>
      </div>

      {/* 文件上传区域 */}
      <div className="file-input-container">
        <p className="file-input-instruction">请上传 PDF 文件</p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
        />
        <button onClick={handleFileUpload}>上传并处理文件</button>
      </div>

      {/* 错误信息显示 */}
      {error && <div className="error-message">{error}</div>}

      {/* 后端返回的解析内容 */}
      {responseContent && (
        <div className="backend-response">
          <h3>解析结果</h3>
          <pre>{responseContent}</pre>
        </div>
      )}

      {/* Markdown 输出区域 */}
      {markdown && (
        <div className="markdown-output">
          <h3>Markdown 输出</h3>
          <pre>{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default FormatPage;