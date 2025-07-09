// src/components/common/Header.js

import React, { useState }from 'react';
import { Link } from 'react-router-dom';

import '../styles/Header.css';
import Modal from './Modal';
import WarningModal from './WarningModal';

function Header(){
    const toggleMenubar = () => {
        // setShowMenubar(!showMenubar);
    };

    // modal (비니용)
    const [showModal, setShowModal] = useState(false);

    // “비니” 클릭 시 모달 열기
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
        <header className='header'>
            <div className='container'>
                <div className='leftWrapper'>
                    <button type="button" onClick={toggleMenubar} className='menuButton'>☰</button>
                    <Link to="/" className='logoLink'>
                    KURUNG
                    </Link>
                </div>
                <div>
                    <nav>
                        <ul className='navList'>
                            <li>
                                <button className='navItem' onClick={handleBiniClick}>비니</button>
                            </li>
                            <li>
                                <button className='navItem' onClick={handleDietClick}>
                                식단
                                </button>
                            </li>
                            <li>
                                <Link to="/" className='navItem'>
                                운동
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className='navItem'>
                                라이프로그
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className='navItem'>
                                마이페이지
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className='navItem'>
                                프로필
                                </Link>
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