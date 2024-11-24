import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SummaryPage.css";

// 定义后端响应的数据类型
interface AnalyzeResponse {
  file_id: string; // 文件 ID
  data: string | FileData; // 后端返回的 JSON 字符串或直接的对象
}

// 定义解析后的数据类型
interface FileData {
  title: string;
  authors: string[];
  keywords: string[];
  abstract: string;
  summary: string;
  structure: string | string[] | Record<string, string>; // 支持对象类型结构
  conclusion: string;
}

// 定义组件属性类型
interface SummaryPageProps {
  onFileIdChange?: (fileId: string) => void; // 可选回调函数
}

const SummaryPage: React.FC<SummaryPageProps> = ({ onFileIdChange }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
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
    if (fileData && localStorage.getItem("fileId") === fileIdFromUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 调用回调函数更新 fileId
    onFileIdChange?.(fileIdFromUrl);

    axios
      .post<AnalyzeResponse>("http://127.0.0.1:8000/summary/make_summary/", {
        file_id: fileIdFromUrl,
      })
      .then((response) => {
        let parsedData: FileData;

        try {
          // 检查是否已经是对象
          if (typeof response.data.data === "object") {
            parsedData = response.data.data as FileData;
          } else {
            // 如果是字符串，尝试解析
            const cleanedData = response.data.data
              .replace(/^```json|```$/g, "")
              .trim();
            parsedData = JSON.parse(cleanedData);
          }
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          setError("解析后端返回的数据失败，请联系管理员。");
          return;
        }

        console.log("Parsed fileData:", parsedData);
        setFileData(parsedData);

        // 缓存数据
        localStorage.setItem("fileId", fileIdFromUrl);
        localStorage.setItem("fileData", JSON.stringify(parsedData));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while fetching summary:", err);
        setError("加载文献信息失败，请稍后重试。");
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
    <div className="page-container">
      <h2 className="page-title">文献内容总结</h2>
      {fileData ? (
        <div className="file-summary">
          <div className="summary-section">
            <h3>题目</h3>
            <p>{fileData.title || "暂无数据"}</p>
          </div>
          <div className="summary-section">
            <h3>作者</h3>
            <p>{fileData.authors?.join(", ") || "暂无数据"}</p>
          </div>
          <div className="summary-section">
            <h3>关键词</h3>
            <p>{fileData.keywords?.join(", ") || "暂无数据"}</p>
          </div>
          <div className="summary-section">
            <h3>摘要</h3>
            <p>{fileData.abstract || "暂无数据"}</p>
          </div>
          <div className="summary-section">
            <h3>全文总结</h3>
            <p>{fileData.summary || "暂无数据"}</p>
          </div>
          <div className="summary-section">
            <h3>全文结构</h3>
            <div>
              {fileData.structure
                ? typeof fileData.structure === "object"
                  ? Object.entries(fileData.structure).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong>{" "}
                        {typeof value === "string" ? value : JSON.stringify(value)}
                      </div>
                    ))
                  : Array.isArray(fileData.structure)
                  ? fileData.structure.join(" -> ")
                  : fileData.structure
                : "暂无数据"}
            </div>
          </div>
          <div className="summary-section">
            <h3>结论</h3>
            <p>{fileData.conclusion || "暂无数据"}</p>
          </div>
        </div>
      ) : (
        <p>暂无数据</p>
      )}
    </div>
  );
};

export default SummaryPage;
