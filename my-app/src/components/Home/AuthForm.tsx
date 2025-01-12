import React, { useState } from "react";
import "./AuthForm.css";

interface AuthFormProps {
  onLogin: (token: string) => void;     // 登录成功回调
  onRegister: (message: string) => void; // 注册成功回调
  onClose: () => void;                  // 关闭表单的回调
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // 当前是否是登录模式
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 切换登录和注册模式
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ username: "", password: "", confirmPassword: "" });
    setErrorMessage("");
  };

  // 表单字段变更事件
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 输入校验
    if (!formData.username || !formData.password) {
      setErrorMessage("用户名和密码不能为空");
      return;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setErrorMessage("两次输入的密码不一致");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const endpoint =
      "http://127.0.0.1:8000" +
      (isLoginMode ? "/home/login/" : "/home/register/");
    const payload = isLoginMode
      ? { username: formData.username, password: formData.password }
      : {
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

    try {
      // 发起请求
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "发生错误");
      }

      if (isLoginMode) {
        // 登录成功，存储 token
        localStorage.setItem("accessToken", data.access);
        onLogin(data.access); // 调用 onLogin 回调
      } else {
        // 注册成功
        // alert("注册成功，请登录！");
        setIsLoginMode(true);
        onRegister("您的账号已成功注册！"); // 调用 onRegister 回调
      }
      onClose(); // 关闭表单
    } catch (error: any) {
      setErrorMessage(error.message || "网络错误，请稍后再试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isLoginMode ? "登录" : "注册"}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
            />
          </div>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
            </div>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "处理中..." : isLoginMode ? "登录" : "注册"}
          </button>
        </form>
        <button onClick={onClose} className="cancel-btn">取消</button>
        <button onClick={toggleMode} className="toggle-btn">
          {isLoginMode ? "没有账号？点击注册" : "已有账号？点击登录"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
