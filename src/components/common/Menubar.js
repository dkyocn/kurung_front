import React, { useState } from 'react';
import '../styles/Menubar.css';
import BiniImg from '../../assets/bini.png';
import ArrowDown from '../../assets/arrow-down.png';
import ArrowUp from '../../assets/arrow-up.png'

const Menubar = () => {

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

   const renderMenuTitle = (title, sectionKey) => (
    <div className="menu-title" onClick={() => toggleSection(sectionKey)}>
      <span>{title}</span>
      <img
        src={openSection === sectionKey ? ArrowUp : ArrowDown}
        alt="arrow"
        className="arrow-icon"
      />
    </div>
  );

  return (
    <div className="sidebar">
      <div className="logo">KURUNG</div>
      
      <div className="menu-title">라이프 로그</div>

      <div className="menu-section">

        {renderMenuTitle("식단", "life")}
        {openSection === 'life' && (
          <>
            <div className="submenu">식단 기록</div>
            <div className="submenu">식단 추천</div>
          </>
        )}

        {renderMenuTitle("운동", "exercise")}
        {openSection === 'exercise' && (
          <>
            <div className="submenu">운동 기록</div>
            <div className="submenu">운동 추천</div>
          </>
        )}

         {renderMenuTitle("멘탈 케어", "mental")}
        {openSection === 'mental' && (
          <>
            <div className="submenu">
              <img src={BiniImg} alt="비니" className="bini-icon" />
              비니
            </div>
            <div className="submenu">스트레스 해소 추천</div>
          </>
        )}

         {renderMenuTitle("건강 관리", "health")}
        {openSection === 'health' && (
          <>
            <div className="submenu">건강 리포트</div>
            <div className="submenu">건강 상태 초기 진단</div>
          </>
        )}


        <div className="menu-title">약물 상호작용 확인</div>
        <div className="menu-title">커뮤니티 보드</div>

        {renderMenuTitle("마이페이지", "mypage")}
        {openSection === 'mypage' && (
          <>
            <div className="submenu">내 정보 관리</div>
            <div className="submenu">mission</div>
            <div className="submenu">즐겨찾기</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menubar;
