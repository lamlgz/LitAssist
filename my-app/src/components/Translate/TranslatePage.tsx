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
  const [options, setOptions] = useState([{value:'zh',label:'简体中文'},{value:'cht',label:'繁体中文'},{value:'en',label:'英语'},{value:'jp',label:'日语'},{value:'kor',label:'韩语'},{value:'fra',label:'法语'},{value:'ru',label:'俄语'},{value:'de',label:'德语'},{value:'pt',label:'葡萄牙语'},{value:'ara',label:'阿拉伯语'},{value:'lat',label:'拉丁语'}]);
  const [selected, setSelected] = useState(options[0]);
  const [fileTrans, setFileTrans] = useState<string | null>(null);
  const [fileOrigin, setFileOrigin] = useState<string | null>(null);
  const [leftWidth, setLeftWidth] = useState<number>(45);
  const [rightWidth, setRightWidth] = useState<number>(45);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const handleSelect = (option: React.SetStateAction<{ value: string; label: string; }>) => {
    setSelected(option);
  };

  const changeLeft = () => {
    if (leftWidth > 45) {
      setLeftWidth(45);
      setRightWidth(45);
    }
    else if (leftWidth > 0) {
      setLeftWidth(0);
      setRightWidth(90);
    }
  }
  
  const changeRight = () => {
    if (rightWidth > 45) {
      setRightWidth(45);
      setLeftWidth(45);
    }
    else if (rightWidth > 0) {
      setRightWidth(0);
      setLeftWidth(90);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fileIdFromUrl = params.get("fileId");

    // 如果 URL 中没有 fileId，设置错误
    if (!fileIdFromUrl) {
      setError("未提供有效的文件 ID。");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 调用回调函数更新 fileId
    onFileIdChange?.(fileIdFromUrl);
    localStorage.setItem("transId", fileIdFromUrl);
    fetch(`http://127.0.0.1:${backend_port}/translate/make_translate?file_id=${fileIdFromUrl}&lang=${selected.value}`)
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
    fetch(`http://127.0.0.1:${backend_port}/translate/query_translate?file_id=${fileIdFromUrl}&lang=${selected.value}`)
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
  }, [location.search, onFileIdChange, selected.value]); // 依赖于 URL 的 fileId 和回调函数

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
        {options.map((option) => (
          option.value === selected.value ?
          <div key={option.value} className="selected-container" onClick={() => handleSelect(option)}>{option.label}</div>
          :
          <div key={option.value} className="option-container" onClick={() => handleSelect(option)}>{option.label}</div>
        ))}
      </div>
      <table className="table-align">
        <tr>
          <td style={{width:"2vw"}}>
            {leftWidth > 0 && <button type="button" onClick={changeLeft}>&lt;&lt;</button>}
          </td>
          <td style={{width:"0.35vw"}}></td>
          <td style={{width:"2vw"}}>
            {rightWidth > 0 && <button type="button" onClick={changeRight}>&gt;&gt;</button>}
          </td>
        </tr>
      </table>
      <div className="horizontal-container">
        {fileOrigin ? (
          <iframe style={{width:`${leftWidth}vw`}} className="text-container" src={fileOrigin + "#view=FitH,top&toolbar=0"}></iframe>
        ) : (
          <p>暂无数据</p>
        )}
        {fileTrans ? (
          <iframe style={{width:`${rightWidth}vw`}} className="text-container" src={fileTrans + "#view=FitH,top&toolbar=0"}></iframe>
        ) : (
          <p>暂无数据</p>
        )}
      </div>
    </div>
  );
};

export default TranslatePage;