import React from 'react';
import '../../styles/signup/signupPage.css';

function SignupPage() {
  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="signup-box">
          <h1 className="signup-title">KURUNG</h1>
          <form className="signup-form">
            <div className="signup-row">
              <label className="signup-label">아이디</label>
            <input className="signup-input" type="email" placeholder="이메일을 입력하세요" />
              <button className="signup-btn" type="button">인증번호 발송</button>
          </div>
            <div className="signup-row">
              <label className="signup-label">인증코드</label>
              <input className="signup-input" type="text" placeholder="이메일로 전송된 인증코드를 입력하세요" />
              <button className="signup-btn" type="button">인증번호 확인</button>
          </div>
            <div className="signup-row">
              <label className="signup-label">닉네임</label>
              <input className="signup-input" type="text" placeholder="닉네임" />
          </div>
            <div className="signup-row">
              <label className="signup-label">비밀번호</label>
              <input className="signup-input" type="password" placeholder="비밀번호" />
          </div>
            <div className="signup-row">
              <label className="signup-label">비밀번호 확인</label>
              <input className="signup-input" type="password" placeholder="비밀번호 확인" />
              <button className="signup-btn" type="button">비밀번호 확인</button>
          </div>
            <button className="signup-btn-submit" type="submit">회원가입</button>
          </form>
          </div>
      </div>
    </div>
  );
}

export default SignupPage; 