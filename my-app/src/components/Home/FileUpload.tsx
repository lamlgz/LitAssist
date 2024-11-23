import React, { useState } from "react";

interface FileUploadProps {
    onUploadSuccess?: (file: File) => void; // 定义回调函数类型
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
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
                setUploadStatus("File uploaded successfully!");
                // 调用回调函数，通知父组件上传成功
                if (onUploadSuccess) {
                    onUploadSuccess(file); // 传递已上传的文件信息
                }
            } else {
                setUploadStatus("File upload failed.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("File upload failed.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            <p>{uploadStatus}</p>
        </div>
    );
};

export default FileUpload;
