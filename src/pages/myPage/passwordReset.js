import React from 'react';
import '../../styles/login/passwordReset.css';

function PasswordReset() {
  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box password-reset-box">
          <h1 className="password-reset-title">비밀번호 재설정</h1>
          <p className="password-reset-desc">
            회원정보에 등록한 이메일주소가 동일해야<br />
            인증번호를 받을 수 있습니다.
          </p>
          <form className="password-reset-form">
            <div className="password-reset-section">
              <div className="password-reset-label">아이디(이메일)</div>
              <div className="password-reset-row">
                <input className="password-reset-input" type="email" placeholder="아이디 입력" />
                <button className="password-reset-btn" type="button">인증번호 발송</button>
              </div>
              <div className="password-reset-row">
                <input className="password-reset-input" type="text" placeholder="인증번호 6자리 숫자 입력" />
                <button className="password-reset-btn" type="button">인증번호 확인</button>
              </div>
            </div>
            <div className="password-reset-section">
              <div className="password-reset-label">비밀번호</div>
              <div className="password-reset-row">
                <input className="password-reset-input pw-new-input" type="password" placeholder="새 비밀번호 입력" />
              </div>
              <div className="password-reset-row">
                <input className="password-reset-input pw-confirm-input" type="password" placeholder="비밀번호 확인" />
                <button className="password-reset-btn" type="button">비밀번호 확인</button>
              </div>
            </div>
            <button className="password-reset-submit" type="submit">비밀번호 재설정</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset; 