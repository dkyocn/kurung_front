import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/SignupSuccessModal.css';

const SignupSuccessModal = ({ onConfirm, onClose }) => {
  const [container] = useState(() => {
    const existing = document.getElementById('signup-success-modal-root');
    if (existing) return existing;
    const div = document.createElement('div');
    div.id = 'signup-success-modal-root';
    document.body.appendChild(div);
    return div;
  });

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

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="signupSuccessModalOverlay" onClick={handleOverlayClick}>
      <div className="signupSuccessModalContent">
        <h2 className="signupSuccessModalTitle">🎉 회원가입 완료!</h2>
        <div className="signupSuccessModalMessage">
          <p>축하합니다! 회원가입이 성공적으로 완료되었습니다.</p>
          <p>이제 로그인하여 서비스를 이용하실 수 있습니다.</p>
        </div>
        <div className="signupSuccessModalBtn">
          <button className="signupSuccessConfirmBtn" onClick={onConfirm}>
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>,
    container
  );
};

export default SignupSuccessModal; 