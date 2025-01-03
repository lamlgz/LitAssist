// src/components/Translate/TranslatePage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import './TranslatePage.css';
import { backend_port } from "../global_vars"

// 定义组件属性类型
interface TranslatePageProps {
  onFileIdChange?: (fileId: string) => void; // 可选回调函数
}

const TranslatePage: React.FC<TranslatePageProps> = ({ onFileIdChange }) => {
  const [fileTrans, setFileTrans] = useState<string | null>(null);
  const [fileOrigin, setFileOrigin] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fileIdFromUrl = params.get("fileId");

    // 如果 URL 中没有 fileId，设置错误
    if (!fileIdFromUrl) {
      setError("未提供有效的文件 ID。");
      setLoading(false);
      return;
    }

    // 如果已经加载了相同的 fileId 数据，直接返回
    if (fileTrans && localStorage.getItem("transId") === fileIdFromUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 调用回调函数更新 fileId
    onFileIdChange?.(fileIdFromUrl);
    localStorage.setItem("transId", fileIdFromUrl);
    fetch(`http://127.0.0.1:${backend_port}/translate/make_translate?file_id=${fileIdFromUrl}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Response was not ok ' + response.statusText);
      }
      return response.blob()
    }) // 确保响应被解析为Blob对象
    .then(blob => {
      const url = URL.createObjectURL(blob);
      setFileOrigin(url);
      // 完成后，记得释放ObjectURL
      // URL.revokeObjectURL(url);
      localStorage.setItem("fileOrigin", JSON.stringify(url));
    })
    .catch(error => {
      console.error('Error fetching PDF:', error);
    });
    fetch(`http://127.0.0.1:${backend_port}/translate/query_translate?file_id=${fileIdFromUrl}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Response was not ok ' + response.statusText);
      }
      return response.blob()
    }) // 确保响应被解析为Blob对象
    .then(blob => {
      const url = URL.createObjectURL(blob);
      setFileTrans(url);
      setLoading(false);
      // 完成后，记得释放ObjectURL
      // URL.revokeObjectURL(url);
      localStorage.setItem("fileTrans", JSON.stringify(url));
    })
    .catch(error => {
      console.error('Error fetching PDF:', error);
    });
  }, [location.search, onFileIdChange]); // 依赖于 URL 的 fileId 和回调函数

  if (loading) {
    return (
      <div className="page-container">
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-align">
      <div className="horizontal-container">
        {fileOrigin ? (
          <iframe className="text-container" src={fileOrigin + "#view=FitH,top&toolbar=0"}></iframe>
        ) : (
          <p>暂无数据</p>
        )}
        {fileTrans ? (
          <iframe className="text-container" src={fileTrans + "#view=FitH,top&toolbar=0"}></iframe>
        ) : (
          <p>暂无数据</p>
        )}
      </div>
    </div>
  );
};

export default TranslatePage;
