// src/components/common/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

import '../styles/Header.css';
import Modal from './Modal';
import WarningModal from './WarningModal';

// function Header(){
//     const toggleMenubar = () => {
//         // setShowMenubar(!showMenubar);
//     };

function Header({ toggleMenubar }) {
  const navigate = useNavigate();

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

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        // 백엔드 로그아웃 API 호출 (선택사항)
        try {
          await axios.post('/user/logout', {}, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log('백엔드 로그아웃 API 호출 완료');
        } catch (error) {
          console.log('백엔드 로그아웃 API 호출 실패 (프론트엔드 로그아웃은 계속 진행)');
        }
      }
      
      // localStorage에서 토큰 및 사용자 정보 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      // 로그인 상태 변화 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      // 로그인 페이지로 리다이렉트
      navigate('/loginSelect');
      
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 오류가 발생해도 프론트엔드 로그아웃은 진행
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('loginStatusChanged'));
      navigate('/loginSelect');
    }
  };

  // Warning 모달 (식단용)
  const [warnOpen, setWarnOpen] = useState(false);

  const handleDietClick = () => setWarnOpen(true);
  const warnConfirm = () => {
    alert('식단 – 확인');
    setWarnOpen(false);
  };
  const warnClose = () => setWarnOpen(false);

  // 마이페이지 클릭 핸들러
  const handleMyPageClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      console.log('로그인되지 않은 상태 - 로그인 페이지로 이동');
      navigate('/loginSelect');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="leftWrapper">
          <button type="button" onClick={toggleMenubar} className="menuButton">
            ☰
          </button>
          <Link to="/" className="logoLink">
            KURUNG
          </Link>
        </div>
        <div>
          <nav>
            <ul className="navList">
              <li>
                <button className="navItem" onClick={handleBiniClick}>
                  비니
                </button>
              </li>
              <li>
                <Link to="/diet" className="navItem">
                  식단
                </Link>
              </li>
              <li>
                <Link to="/" className="navItem" onClick={handleDietClick}>
                  운동
                </Link>
              </li>
              <li>
                <Link to="/" className="navItem">
                  라이프로그
                </Link>
              </li>
              <li>
                <Link to="/myInfoManagement" className="navItem" onClick={handleMyPageClick}>
                  마이페이지
                </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/myInfoManagement" className="navItem">
                      프로필
                    </Link>
                    <button onClick={handleLogout} className="navItem" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15pt' }}>
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link to="/loginSelect" className="navItem">
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
