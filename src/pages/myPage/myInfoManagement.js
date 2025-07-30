import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BirthDatePicker from '../../components/common/BirthDatePicker';
import '../../styles/myPage/myInfoManagement.css';

function MyInfoManagement() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('로그인되지 않은 상태 - 로그인 페이지로 이동');
      navigate('/loginSelect');
      return;
    }
    console.log('로그인된 상태 - 마이페이지 접근 허용');
  }, [navigate]);

  const handleBirthDateClick = () => {
    setShowBirthDatePicker(true);
  };

  const handleBirthDateConfirm = (date) => {
    setBirthDate(date);
  };

  const handleBirthDateClose = () => {
    setShowBirthDatePicker(false);
  };

  return (
    <div className="myinfo-outer">
      <div className="myinfo-inner">
        <div className="myinfo-box">
          <h1 className="myinfo-title">내 정보 관리</h1>
          <div className="myinfo-profile-block">
            <img className="myinfo-profile-img" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="프로필" />
            <div className="myinfo-profile-label">프로필 사진 변경</div>
            <div className="myinfo-profile-desc">사진 클릭시 프로필 사진 수정</div>
          </div>
          <form className="myinfo-form">
            <div className="myinfo-row">
              <label className="myinfo-label">아이디</label>
              <input className="myinfo-input" type="text" />
              <button type="button" className="myinfo-faceid-btn">FACE ID</button>
            </div>
            <div className="myinfo-row">
              <label className="myinfo-label">닉네임</label>
              <input className="myinfo-input" type="text" />
            </div>
            <div className="myinfo-row">
              <label className="myinfo-label">생년월일</label>
              <input 
                className="myinfo-input" 
                type="text" 
                placeholder="YYYY-MM-DD" 
                value={birthDate}
                readOnly
                onClick={handleBirthDateClick}
                style={{ cursor: 'pointer' }}
              />
              <span 
                className="myinfo-calendar-icon" 
                onClick={handleBirthDateClick}
                style={{ cursor: 'pointer' }}
              >
                📅
              </span>
            </div>
            <div className="myinfo-row myinfo-gender-row">
              <button type="button" className="myinfo-gender-btn">여성</button>
              <button type="button" className="myinfo-gender-btn">남성</button>
            </div>
          </form>
          <div className="myinfo-btn-row">
            <button type="button" className="myinfo-cancel-btn">취소</button>
            <button type="submit" className="myinfo-save-btn">저장</button>
          </div>
        </div>
      </div>
      
                     {/* 생년월일 선택 모달 */}
        {showBirthDatePicker && (
          <BirthDatePicker
            onConfirm={handleBirthDateConfirm}
            onClose={handleBirthDateClose}
            initialDate={birthDate ? new Date(birthDate) : null}
          />
        )}
    </div>
  );
}

export default MyInfoManagement; 