import React from 'react';
import '../../styles/login/loginSelect.css';
import kakaologo from '../../images/login/kakaologo.png';
import naverlogo from '../../images/login/naverlogo.png';
import faceLogo from '../../images/login/FaceLogin.png';

function LoginSelect() {
  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box">
          <h1 className="login-title">KURUNG</h1>
          <p className="login-subtitle">Welcome to Wellbeing Hub</p>
          <div className="login-buttons">
            <button className="login-btn kakao">
              <img src={kakaologo} alt="Kakao" className="login-icon" />
            </button>
            <button className="login-btn naver">
              <img src={naverlogo} alt="Naver" className="login-icon" />
            </button>
            <button className="login-btn school">
              <img src={faceLogo} alt="Face Login" className="login-icon" />
            </button>
            <button className="login-btn mail">
              <span className="btn-text">Mail</span>
            </button>
          </div>
          <div className="login-bottom-text">이메일로 회원가입</div>
        </div>
      </div>
    </div>
  );
}

export default LoginSelect; 