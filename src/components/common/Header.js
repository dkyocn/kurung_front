// src/components/common/Header.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/Header.css';
import Modal from './Modal';
import WarningModal from './WarningModal';

// function Header(){
//     const toggleMenubar = () => {
//         // setShowMenubar(!showMenubar);
//     };

function Header({ toggleMenubar }) {
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  };

  // 컴포넌트 마운트 시 로그인 상태 확인 및 이벤트 리스너 등록
  useEffect(() => {
    // 초기 로그인 상태 확인
    checkLoginStatus();

    // localStorage 변화 감지를 위한 이벤트 리스너
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        checkLoginStatus();
      }
    };

    // storage 이벤트 리스너 등록 (다른 탭에서의 변화 감지)
    window.addEventListener('storage', handleStorageChange);

    // 커스텀 이벤트 리스너 등록 (같은 탭에서의 변화 감지)
    const handleLoginChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('loginStatusChanged', handleLoginChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleLoginChange);
    };
  }, []);

  // modal (비니용)
  const [showModal, setShowModal] = useState(false);

  // "비니" 클릭 시 모달 열기
  const handleBiniClick = () => setShowModal(true);

  const handleConfirm = () => {
    alert('비니 - 확인');
    setShowModal(false);
  };
  const handleCancel = () => {
    alert('비니 - 취소');
    setShowModal(false);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  // Warning 모달 (식단용)
  const [warnOpen, setWarnOpen] = useState(false);

  const handleDietClick = () => setWarnOpen(true);
  const warnConfirm = () => {
    alert('식단 – 확인');
    setWarnOpen(false);
  };
  const warnClose = () => setWarnOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="leftWrapper">
          <button type="button" onClick={toggleMenubar} className="menuButton">
            ☰
          </button>
          <Link to="/main" className="logoLink">
            KURUNG
          </Link>
        </div>
        <div>
          <nav>
            <ul className="navList">
              <li>
                <Link to="/chatbot" className="navItem">
                  비니
                </Link>
              </li>
              <li>
                <Link to="/diet" className="navItem">
                  식단
                </Link>
              </li>
              <li>
                <Link to="/createExerciseLog" className="navItem">
                  운동
                </Link>
              </li>
              <li>
                <Link to="/getLifeLogList" className="navItem">
                  라이프로그
                </Link>
              </li>
              <li>
                <Link to="/mypage" className="navItem">
                  마이페이지
                </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <Link to="/myInfoManagement" className="navItem">
                    프로필
                  </Link>
                ) : (
                  <Link to="/" className="navItem">
                    로그인
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
        {/* Header 내부에서 조건부로 모달 렌더링 */}
        {showModal && (
          <Modal
            message="비니를 삭제하시겠습니까?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={handleClose}
          />
        )}
        {warnOpen && (
          <WarningModal
            message="식단 기능은 준비 중입니다."
            onConfirm={warnConfirm}
            onClose={warnClose}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
