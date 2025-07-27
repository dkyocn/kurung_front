import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import '../../styles/login/loginPage.css';

function LoginPage() {

  // === 상태 관리 및 네비게이션 ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // === 로그인 요청 처리 ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/user/login', {
        userId: email,
        userPwd: password
      });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      navigate('/main'); // 성공 시 이동할 경로
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box">
          <h1 className="login-title">KURUNG</h1>
          <p className="login-subtitle">Welcome to Wellbeing Hub</p>
          {/* === 폼에 상태 연결 === */}
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="text"
              placeholder="Email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="login-btn-submit" type="submit">Log In</button>
          </form>
          {/* === 에러 메시지 표시 === */}
          {error && <div className="login-error">{error}</div>}
          <Link to="/passwordReset" className="login-bottom-text">비밀번호 재설정</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 