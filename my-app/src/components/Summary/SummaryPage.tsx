import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SummaryPage.css";
import { Document, Page, pdfjs } from "react-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faTag,
  faFileAlt,
  faSitemap,
  faCheckCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { backend_port } from "../global_vars"

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
    console.log("Checking fileID:");
    console.log(
      "localStorage fileID = ",
      localStorage.getItem("fileId"),
      typeof localStorage.getItem("fileId")
    );
    console.log("fileIdFromUrl = ", fileIdFromUrl, typeof fileIdFromUrl);
    // TODO: 这里需要处理 fileData，现在输出为 null，导致每次刷新都需要重复渲染

    console.log("fileData", fileData, typeof fileData);
    if (fileData && localStorage.getItem("fileId") === fileIdFromUrl) {
      console.log("Checking success!");
      setLoading(false);
      return;
    }
    console.log("Checking fail!");

    setLoading(true);
    setError(null);

    // 调用回调函数更新 fileId
    onFileIdChange?.(fileIdFromUrl);

    axios
      .post<AnalyzeResponse>(`http://127.0.0.1:${backend_port}/summary/make_summary/`, {
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
          {/* 题目卡片 */}
          <div className="summary-card summary-card-title">
            <div className="card-header">
              <FontAwesomeIcon icon={faBook} className="summary-icon" />
              <h3>题目</h3>
            </div >
            <div className="card-container">
            <p>{fileData.title || "暂无数据"}</p>
            </div>
          </div>
          {/* 作者卡片 */}
          <div className="summary-card summary-card-authors">
            <div className="card-header">
              <FontAwesomeIcon icon={faUser} className="summary-icon" />
              <h3>作者</h3>
            </div>
            <div className="card-container">
              {fileData.authors?.length
                ? fileData.authors.map((author, index) => (
                    <p key={index}>{author}</p>
                  ))
                : "暂无数据"}
            </div>
          </div>
          {/* 关键词卡片 */}
          <div className="summary-card summary-card-keywords">
            <div className="card-header">
              <FontAwesomeIcon icon={faTag} className="summary-icon" />
              <h3>关键词</h3>
            </div>
            <div className="card-container">
              {fileData.keywords?.length
                ? fileData.keywords.map((keyword, index) => (
                    <p key={index}>{keyword}</p>
                  ))
                : "暂无数据"}
            </div>
          </div>
          {/* 摘要卡片 */}
          <div className="summary-card summary-card-abstract">
            <div className="card-header">
              <FontAwesomeIcon icon={faFileAlt} className="summary-icon" />
              <h3>摘要</h3>
            </div>
            <div className="card-container">
            <p>{fileData.abstract || "暂无数据"}</p>
            </div>
          </div>
          {/* 全文结构卡片 */}
          <div className="summary-card summary-card-structure">
            <div className="card-header">
              <FontAwesomeIcon icon={faSitemap} className="summary-icon" />
              <h3>全文结构</h3>
            </div>
            <div className="card-container">
              {fileData.structure
                ? typeof fileData.structure === "object"
                  ? Object.entries(fileData.structure).map(
                      ([key, value], index, array) => (
                        <span key={key}>
                          <strong>{key}</strong>
                          {typeof value === "string"
                            ? `: ${value}`
                            : `: ${JSON.stringify(value)}`}
                          {index < array.length - 1 && (
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              className="arrow-icon"
                            />
                          )}
                        </span>
                      )
                    )
                  : Array.isArray(fileData.structure)
                  ? fileData.structure.join(" → ")
                  : fileData.structure
                : "暂无数据"}
            </div>
          </div>
          {/* 结论卡片 */}
          <div className="summary-card summary-card-conclusion">
            <div className="card-header">
              <FontAwesomeIcon icon={faCheckCircle} className="summary-icon" />
              <h3>结论</h3>
            </div>
            <div className="card-container">
            <p>{fileData.conclusion || "暂无数据"}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>暂无数据</p>
      )}
    </div>
  );
};

export default SummaryPage;
