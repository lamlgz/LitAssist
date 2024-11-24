import React, { useState } from "react";

interface FileUploadProps {
  onUploadSuccess?: (fileId: number) => void; // 这里将 fileId 的类型设置为 number
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>(""); // 状态提示
  const [isUploading, setIsUploading] = useState<boolean>(false); // 上传中标志

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadStatus(""); // 清除之前的状态提示
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true); // 开始上传

    try {
      const response = await fetch("http://127.0.0.1:8000/home/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);

        const fileId = Number(data.file_id); // 确保 fileId 是 number 类型
        setUploadStatus("File uploaded successfully!");

        if (onUploadSuccess) {
          onUploadSuccess(fileId); // 传递 number 类型的 fileId
        }
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("File upload failed.");
    } finally {
      setIsUploading(false); // 上传结束
    }
  };

  return (
    <div className="file-upload-container">
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
      <p className="upload-status">{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;
