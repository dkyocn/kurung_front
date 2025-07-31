// src/components/common/Menubar.js

import React, { useState } from 'react';
import '../styles/Menubar.css';
import BiniImg from '../../assets/bini.png';
import ArrowDown from '../../assets/arrow-down.png';
import ArrowUp from '../../assets/arrow-up.png'
import { Link } from 'react-router-dom';

const Menubar = ({ isOpen }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
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
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="menu-title menu-title-lifelog">라이프 로그</div>

      <div className="menu-section">
        {renderMenuTitle('식단', 'life')}
        {openSection === 'life' && (
          <>
            <Link to="/diet" className="submenu">
              식단 기록
            </Link>
            <Link to="/recipe" className="submenu">
              추천 래시피
            </Link>
          </>
        )}

        {renderMenuTitle('운동', 'exercise')}
        {openSection === 'exercise' && (
          <>
            <Link to="/createExerciseLog" className="submenu">
              운동 기록
            </Link>
            <div className="submenu">운동 추천</div>
          </>
        )}

        {renderMenuTitle('멘탈 케어', 'mental')}
        {openSection === 'mental' && (
          <>
            <Link
              to="/chatbot"
              className="submenu"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                src={BiniImg}
                alt="비니"
                className="bini-icon"
                style={{ marginRight: '8px' }}
              />
              비니
            </Link>
            <div className="submenu">스트레스 해소 추천</div>
          </>
        )}

        {renderMenuTitle('건강 관리', 'health')}
        {openSection === 'health' && (
          <>
            <div className="submenu">건강 리포트</div>
            <Link to="/healthQuestion" className="submenu">
              건강 상태 초기 진단
            </Link>
          </>
        )}

        <div className="menu-title">약물 상호작용 확인</div>
        <Link to="/communityPage" className="menu-title">
          커뮤니티 보드
        </Link>

        {renderMenuTitle('마이페이지', 'mypage')}
        {openSection === 'mypage' && (
          <>
            <div className="submenu">내 정보 관리</div>
             <Link to="/mypage" className="submenu">마이페이지</Link>
            <Link to="/missions" className="submenu">mission</Link>
            <Link to="/favorites" className="submenu">즐겨찾기</Link>
          </>

        )}
      </div>
    </div>
  );
};

export default Menubar;
