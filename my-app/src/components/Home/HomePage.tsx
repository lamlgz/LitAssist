import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/Home/FileUpload";
import "./HomePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faGlobe,
  faFileCode,
  faChartBar,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // 上传成功后回调
  const handleUploadSuccess = (fileId: number) => {
    console.log("Uploaded file ID:", fileId);
    localStorage.setItem("fileId", fileId.toString());
    navigate(`/summary?fileId=${fileId}`);
  };

  const features = [
    { label: "文献总结", route: "/summary", icon: faFileAlt },
    { label: "即时翻译", route: "/translate", icon: faGlobe },
    { label: "格式转换", route: "/format", icon: faFileCode },
    { label: "图表提取", route: "/chart", icon: faChartBar },
    { label: "论文检索", route: "/search", icon: faSearch },
  ];

  return (
    <div className="homepage">
      <div className="title">
        <h1>智能文献阅读助手</h1>
        <p>Smart Literature Reading Assistant</p>
      </div>
      <div className="upload-section">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="features">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature"
            onClick={() => navigate(feature.route)}
          >
            <div className="feature-icon">
              <FontAwesomeIcon icon={feature.icon} />
            </div>
            <div className="feature-label">{feature.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
