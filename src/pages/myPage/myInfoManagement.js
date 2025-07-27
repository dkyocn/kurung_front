import React from 'react';
import '../../styles/myPage/myInfoManagement.css';

function MyInfoManagement() {
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
              <input className="myinfo-input" type="text" placeholder="YYYY-MM-DD" />
              <span className="myinfo-calendar-icon">📅</span>
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
    </div>
  );
}

export default MyInfoManagement; 