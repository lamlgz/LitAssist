import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/Home/HomePage";
import SummaryPage from "./components/Summary/SummaryPage";
import TranslatePage from "./components/Translate/TranslatePage";
import FormatPage from "./components/Format/FormatPage";
import ChartPage from "./components/Chart/ChartPage";
import SearchPage from "./components/Search/SearchPage";
import AuthForm from "./components/Home/AuthForm";
import ConfirmModal from "./components/Home/ConfirmModal";
import NotificationModal from "./components/Home/NotificationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faGlobe,
  faFileCode,
  faChartBar,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLogoutSuccessModalOpen, setIsLogoutSuccessModalOpen] =
    useState(false); // 控制确认对话框的显示

  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false); // 控制登录/注册表单是否显示
  const [isLoginSuccessModalOpen, setIsLoginSuccessModalOpen] = useState(false); // 控制通知对话框的显示
  const [isRegisterSuccessModalOpen, setIsRegisterSuccessModalOpen] =
    useState(false); // 控制通知对话框的显示
  const [modalTitle, setModalTitle] = useState(""); // 对话框标题
  const [modalMessage, setModalMessage] = useState(""); // 对话框消息
  const [redirect, setRedirect] = useState(false); // 控制是否需要跳转
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 从 localStorage 加载文件ID
  useEffect(() => {
    const storedFileId = localStorage.getItem("fileId");
    if (storedFileId) {
      setFileId(storedFileId);
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false); // 点击外部关闭菜单
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 更新文件ID并保存到 localStorage
  const handleFileIdChange = (id: string) => {
    setFileId(id);
    localStorage.setItem("fileId", id);
  };

  const getSummaryLink = () => {
    return fileId ? `/summary?fileId=${fileId}` : "/summary";
  };

  // 处理登录状态变化
  const handleLoginStatus = (status: boolean) => {
    setIsLoggedIn(status);
    if (!status) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  // 登录成功处理函数
  const handleLoginSuccess = (token: string) => {
    handleLoginStatus(true);
    setIsAuthFormOpen(false); // 登录成功后关闭登录/注册表单
    // 弹出登录成功的对话框
    setModalTitle("登录成功");
    setModalMessage("您已成功登录！");
    setIsLoginSuccessModalOpen(true); // 显示通知对话框
  };

  // 注册成功处理函数
  const handleRegisterSuccess = (message: string) => {
    // 显示注册成功的通知对话框
    setModalTitle("注册成功");
    setModalMessage(message);
    setIsRegisterSuccessModalOpen(true); // 显示通知对话框
  };

  const handleConfirmRegister = () => {
    setIsRegisterSuccessModalOpen(false);
    setIsAuthFormOpen(true); // 注册成功后打开登录对话框
  };

  // 退出处理函数
  const handleLogout = () => {
    setModalTitle("确认退出");
    setModalMessage("您确定要退出吗？");
    setIsLogoutModalOpen(true); // 打开确认对话框
  };

  // 退出确认处理函数
  const handleConfirmLogout = () => {
    handleLoginStatus(false); // 执行退出操作
    setIsLogoutModalOpen(false); // 关闭确认对话框
    setRedirect(true); // 设置跳转标志
    // 弹出退出成功的对话框
    setModalTitle("退出成功");
    setModalMessage("您已成功退出！");
    setIsLogoutSuccessModalOpen(true); // 显示通知对话框
  };

  if (redirect) {
    window.location.href = "/"; // 确认退出后跳转到主页
  }

  return (
    <Router>
      <div className="App">
        <div className="content">
          <aside className="sidebar">
            <ul>
              <li>
                <h3>智能文献阅读助手</h3>
              </li>
              <li>
                <Link to="/">
                  <FontAwesomeIcon
                    icon={faHome}
                    style={{ marginRight: "8px" }}
                  />
                  主页
                </Link>
              </li>
              <li>
                <Link to={getSummaryLink()}>
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{ marginRight: "8px" }}
                  />
                  文献总结
                </Link>
              </li>
              <li>
                <Link to="/translate">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    style={{ marginRight: "8px" }}
                  />
                  即时翻译
                </Link>
              </li>
              <li>
                <Link to="/format">
                  <FontAwesomeIcon
                    icon={faFileCode}
                    style={{ marginRight: "8px" }}
                  />
                  格式转换
                </Link>
              </li>
              <li>
                <Link to="/chart">
                  <FontAwesomeIcon
                    icon={faChartBar}
                    style={{ marginRight: "8px" }}
                  />
                  图表提取
                </Link>
              </li>
              <li>
                <Link to="/search">
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ marginRight: "8px" }}
                  />
                  论文检索
                </Link>
              </li>
            </ul>
          </aside>

          <div className="auth-section">
            {isLoggedIn ? (
              <div className="profile-container" ref={dropdownRef}>
                <img
                  src="/my-avatar.jpg" // 替换为用户头像 URL
                  alt="Profile"
                  className="profile-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={() => alert("更换头像")}>更换头像</button>
                    <button onClick={handleLogout}>退出</button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="auth-button"
                onClick={() => setIsAuthFormOpen(true)}
              >
                登录/注册
              </button>
            )}
          </div>
          {/* 显示登录注册对话框 */}
          {isAuthFormOpen && (
            <AuthForm
              onLogin={handleLoginSuccess}
              onRegister={handleRegisterSuccess}
              onClose={() => setIsAuthFormOpen(false)}
            />
          )}

          {/* 通知对话框：用于登录成功提示 */}
          <NotificationModal
            isOpen={isLoginSuccessModalOpen}
            onClose={() => setIsLoginSuccessModalOpen(false)}
            title={modalTitle}
            message={modalMessage}
            confirmText="确定"
          />

          {/* 通知对话框：用于注册成功提示 */}
          <NotificationModal
            isOpen={isRegisterSuccessModalOpen}
            onClose={handleConfirmRegister}
            title={modalTitle}
            message={modalMessage}
            confirmText="确定"
          />

          {/* 确认对话框：用于退出操作 */}
          <ConfirmModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={handleConfirmLogout}
            title={modalTitle}
            message={modalMessage}
            confirmText="确定"
            cancelText="取消"
          />

          {/* 通知对话框：用于退出成功提示 */}
          <NotificationModal
            isOpen={isLogoutSuccessModalOpen}
            onClose={() => setIsLogoutSuccessModalOpen(false)}
            title={modalTitle}
            message={modalMessage}
            confirmText="确定"
          />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/summary"
                element={<SummaryPage onFileIdChange={handleFileIdChange} />}
              />
              <Route path="/translate" element={<TranslatePage />} />
              <Route path="/format" element={<FormatPage />} />
              <Route path="/chart" element={<ChartPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
