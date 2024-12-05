// src/components/Translate/TranslatePage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import './TranslatePage.css';
import { backend_port } from "../global_vars"

// 定义后端响应的数据类型
interface AnalyzeResponse {
  file_id: string; // 文件 ID
  data: FileTrans; // 后端返回的 JSON 字符串或直接的对象
}
// 定义解析后的数据类型
interface FileTrans {
  origin: string
  translate: string
}

// 定义组件属性类型
interface SummaryPageProps {
  onFileIdChange?: (fileId: string) => void; // 可选回调函数
}

const TranslatePage: React.FC<SummaryPageProps> = ({ onFileIdChange }) => {
  const [fileTrans, setFileTrans] = useState<FileTrans | null>(null);
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

    axios
      .post<AnalyzeResponse>(`http://127.0.0.1:${backend_port}/translate/make_translate/`, {
        file_id: fileIdFromUrl,
      })
      .then((response) => {
        let parsedData: FileTrans;

        parsedData = response.data.data as FileTrans;

        console.log("Parsed fileData:", parsedData);
        setFileTrans(parsedData);

        // 缓存数据
        localStorage.setItem("transId", fileIdFromUrl);
        localStorage.setItem("fileTrans", JSON.stringify(parsedData));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while fetching summary:", err);
        setError("获取翻译失败，请稍后重试。");
        setLoading(false);
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
        {fileTrans ? (
          <div className="horizontal-container">
            <textarea className="text-container" defaultValue={fileTrans.origin || ""} readOnly />
            <textarea className="text-container" defaultValue={fileTrans.translate || ""} readOnly />
          </div>
        ) : (
          <p>暂无数据</p>
        )}
    </div>
  );
};

export default TranslatePage;
