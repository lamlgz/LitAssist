import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faFileAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./FileUpload.css";

interface FileUploadProps {
  onUploadSuccess?: (fileId: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("请选择一个文件后再上传！");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/home/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const fileId = Number(data.file_id);
        alert("文件上传成功！");
        if (onUploadSuccess) {
          onUploadSuccess(fileId);
        }
      } else {
        alert("文件上传失败，请重试！");
      }
    } catch (error) {
      console.error("上传出错：", error);
      alert("上传失败，请检查网络连接！");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className={`file-upload-container ${file ? "has-file" : "no-file"}`}>
      <div className="upload-section" style={{ display: "flex", alignItems: "center", justifyContent: file ? "flex-start" : "center", width: "100%" }}>
        <label htmlFor="file-upload" className="upload-button">
          <FontAwesomeIcon icon={faUpload} className="upload-icon" />
          点击上传文件
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            hidden
          />
        </label>
        {file && (
          <div className="file-preview">
            <div className="file-info">
              <FontAwesomeIcon icon={faFileAlt} className="file-icon" />
              <span className="file-name">{file.name}</span>
            </div>
            <FontAwesomeIcon
              icon={faTimes}
              className="remove-file"
              onClick={handleRemoveFile}
            />
          </div>
        )}
      </div>
      {file && (
        <button onClick={handleUpload} className="confirm-upload">
          开始阅读
        </button>
      )}
    </div>
  );
};

export default FileUpload;
