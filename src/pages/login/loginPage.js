import React from 'react';
import '../../styles/login/loginPage.css';

function LoginPage() {
  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box">
          <h1 className="login-title">KURUNG</h1>
          <p className="login-subtitle">Welcome to Wellbeing Hub</p>
          <form className="login-form">
            <input
              className="login-input"
              type="text"
              placeholder="Email"
              autoComplete="username"
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button className="login-btn-submit" type="submit">Log In</button>
          </form>
          <div className="login-bottom-text">비밀번호 재설정</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 