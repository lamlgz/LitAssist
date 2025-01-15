import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;             // 控制对话框是否显示
  onClose: () => void;         // 关闭对话框的回调函数
  onConfirm: () => void;       // 确认回调函数
  title: string;               // 标题
  message: string;             // 主体消息内容
  confirmText?: string;        // 可选的确认按钮文本
  cancelText?: string;         // 可选的取消按钮文本
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
}) => {
  if (!isOpen) return null; // 如果对话框没有打开，则不渲染任何内容

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
