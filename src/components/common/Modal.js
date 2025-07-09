import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/Modal.css';


const Modal = ({ message, onConfirm, onCancel, onClose }) => {
  // ① 포털 DOM을 state로 보관
  const [container] = useState(() => {
    // 이미 존재하면 그대로, 없으면 즉석에서 생성
    const existing = document.getElementById('portal-root');
    if (existing) return existing;

    const div = document.createElement('div');
    div.id = 'portal-root';
    document.body.appendChild(div);
    return div;
  });

   // ESC 키 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className="modalContent">
        <p className="modalText">{message}</p>
        <div className="modalBtn">
          <button className="cancelBtn" onClick={onCancel}>취소</button>
          <button className="confirmBtn" onClick={onConfirm}>확인</button>
        </div>
      </div>
    </div>,
    container
  );

  
};

export default Modal;