// src/components/Home/HomePage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate
import FileUpload from "@/components/Home/FileUpload";
import "./HomePage.css";

interface HelloResponse {
    message: string;
}

function HomePage() {
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate(); // 初始化 useNavigate 钩子

    useEffect(() => {
        axios
            .get<HelloResponse>("http://127.0.0.1:8000/home/hello/")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // 文件上传成功后的回调
    const handleUploadSuccess = (file: File) => {
        console.log("Uploaded file:", file.name);
        alert(`文件 "${file.name}" 上传成功！`);
        // 跳转到 "/summary" 页面
        navigate("/summary");
    };

    return (
        <div className="homepage-container">
            <h2>欢迎使用智能文献阅读助手</h2>
            <p className="hello-message">{message ? message : "加载中..."}</p>
            
            {/* 传递回调函数到 FileUpload 组件 */}
            <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
    );
}

export default HomePage;
