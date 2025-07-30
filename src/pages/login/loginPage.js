import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login/loginPage.css';

function LoginPage() {

  // === 상태 관리 및 네비게이션 ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // === 로그인 페이지 접속 시 만료된 토큰 제거 ===
  useEffect(() => {
    // 로그인 페이지에 접속할 때 기존 토큰 제거 (선택적)
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');
    // console.log('로그인 페이지: 기존 토큰 제거됨');
  }, []);

  // 로그인용 axios 인스턴스 (baseURL 직접 지정)
  const loginApi = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // === 기존 로그인 요청 처리 ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginApi.post('/api/v1/kurung/user/login', {
        userId: email,
        userPwd: password
      });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      
      // 로그인 상태 변화 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      navigate('/main'); // 성공 시 이동할 경로
    } catch (err) {
      console.error('로그인 오류:', err);
      
      // 더 구체적인 오류 메시지 처리
      let errorMessage = '로그인에 실패했습니다.';
      
      
      setError(errorMessage);
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