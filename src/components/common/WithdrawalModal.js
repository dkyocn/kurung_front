import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/WithdrawalModal.css';

const WithdrawalModal = ({ onConfirm, onCancel, onClose }) => {
  // ① 포털 DOM을 state로 보관
  const [container] = useState(() => {
    // 이미 존재하면 그대로, 없으면 즉석에서 생성
    const existing = document.getElementById('withdrawal-modal-root');
    if (existing) return existing;

    const div = document.createElement('div');
    div.id = 'withdrawal-modal-root';
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
    <div className="withdrawalModalOverlay" onClick={handleOverlayClick}>
      <div className="withdrawalModalContent">
        <h2 className="withdrawalModalTitle">회원 탈퇴</h2>
        <div className="withdrawalModalMessage">
          <p>정말 탈퇴하시겠어요? 😥</p>
          <p>지금 탈퇴하시면 회원님의</p>
          <p>모든 정보가 삭제됩니다.</p>
        </div>
        <div className="withdrawalModalBtn">
          <button className="withdrawalCancelBtn" onClick={onCancel}>취소</button>
          <button className="withdrawalConfirmBtn" onClick={onConfirm}>회원 탈퇴</button>
        </div>
      </div>
    </div>,
    container
  );
};

export default WithdrawalModal; 