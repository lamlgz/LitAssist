// src/components/Search/SearchPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faTag,
  faFileAlt,
  faSitemap,
  faCheckCircle,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

// 定义后端响应的数据类型
interface AnalyzeResponse {
  file_id: string;
  data: SearchResult[]; 
}

interface SearchResult {
  title: string;
  authors: string[];
  abstract: string;
  published_date: string;
  link: string;
}

// 定义组件属性类型
interface SearchPageProps {
  onFileIdChange?: (fileId: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onFileIdChange }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 从 URL 获取 fileId
    const params = new URLSearchParams(location.search);
    const fileIdFromUrl = params.get("fileId");

    // 如果没有 fileId，显示错误信息
    if (!fileIdFromUrl) {
      setError("未提供有效的文件 ID。");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // 调用回调函数更新 fileId
    onFileIdChange?.(fileIdFromUrl);
    
    // 请求搜索结果
    axios
      .post<AnalyzeResponse>("http://127.0.0.1:8000/search/make_search/", {
        file_id: fileIdFromUrl,
      })
      .then((response) => {
        // 直接将返回的数据赋值给 searchResults
        setSearchResults(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while fetching search results:", err);
        setError(`加载搜索结果失败，错误信息: ${err.message || err}`);
        setLoading(false);
      });
  }, [location.search, onFileIdChange]);

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
      <h2 className="page-title">检索结果</h2>
      {searchResults.length > 0 ? (
        <div className="results-container">
          {searchResults.map((result, index) => (
            <div key={index} className="result-item">
              <h3>{result.title}</h3>
              <p><strong>作者：</strong>{result.authors}</p>
              <div className="result-meta">
                <span><strong>发布时间：</strong>{result.published_date}</span>
                <a href={result.link} target="_blank" rel="noopener noreferrer">Link</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>暂无搜索结果</p>
      )}
    </div>
  );
  
  
};

export default SearchPage;
