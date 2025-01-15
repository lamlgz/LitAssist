// src/components/Chart/ChartPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import  axios  from 'axios';
import "./ChartPage.css";
import { Document, Page, pdfjs } from "react-pdf";

// 定义后端响应的数据类型
interface ChartResponse {
  file_id: string; // 文件 ID
  table_data: TableData[]; // 后端返回的 JSON 字符串或直接的对象
  img_data: ImageData[]
}

interface FileResponse{
  files: FileItem[]
}

interface FileItem{
  id: string;
  name: string;
}

interface TableData {
  table: Array<Array<string>>;
}

interface ImageData {
  base64: string;
  description: string;
}

const ChartPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);// 用来存储文件列表
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null); // 记录当前选择的文件ID
  const [fileTables, setFileTables] = useState<TableData[]>([]); // 存储表格数据
  const [fileImgs, setFileImgs] = useState<ImageData[]>([]); // 存储图片数据

  // 获取文件列表
  const fetchFiles = async () => {
    try {
      const response = await axios.get<FileResponse>('http://127.0.0.1:8000/chart/files/');
      setFiles(response.data.files); // 假设返回的数据格式是 { files: [ { id, name } ] }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // 发送文件ID并获取表格和图片数据
  const fetchFileData = async () => {
    if (!selectedFileId) return;

    try {
      const response = await axios.post<ChartResponse>('http://127.0.0.1:8000/chart/make_chart/', { file_id: selectedFileId });
      const fileTables = response.data.table_data;
      const fileImgs = response.data.img_data;
      setFileTables(fileTables); // 设置表格数据
      setFileImgs(fileImgs); // 设置图片数据
    } catch (error) {
      console.error('Error fetching file data:', error);
    }
  };

  // 组件初始化时加载文件列表
  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="chart-page">
      <h1>文件列表</h1>
      
      <div className="file-list">
        <h2>选择一个文件：</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <button onClick={() => setSelectedFileId(file.id)}>
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={fetchFileData} disabled={!selectedFileId}>
        获取文件数据
      </button>

      <div className="file-data">
        <h2>文件表格数据</h2>
        {fileTables.length > 0 ? (
          fileTables.map((table, tableIndex) => (
            <table key={tableIndex} border = {1}>
              <thead>
                <tr>
                  {table.table[0].map((_, cellIndex) => (
                    <th key={cellIndex}>列 {cellIndex + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.table.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ))
        ) : (
          <p>没有表格数据</p>
        )}
      </div>

      <div className="file-images">
        <h2>文件图片</h2>
        {fileImgs.length > 0 ? (
          fileImgs.map((img, index) => (
            <div key={index}>
              <img src={`data:image/png;base64,${img.base64}`} alt={`Image ${index + 1}`} />
              <p>{img.description}</p>
            </div>
          ))
        ) : (
          <p>没有图片数据</p>
        )}
      </div>
    </div>
  );
};

export default ChartPage;