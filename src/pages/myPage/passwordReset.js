import React, { useState } from 'react';
import '../../styles/login/passwordReset.css';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [message, setMessage] = useState('');

  // === 인증번호 발송 ===
  const handleSendVerificationCode = async () => {
    console.log('인증번호 발송 버튼 클릭됨'); // 디버깅용
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      console.log('API 호출 시작:', email); // 디버깅용
      const response = await fetch('http://localhost:8081/api/v1/kurung/user/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const message = await response.text(); // JSON이 아닌 String으로 받기
        console.log('API 응답:', message); // 디버깅용
        setMessage(message);
        setIsCodeSent(true);
      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage || '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 오류:', error); // 디버깅용
      setMessage('서버 연결에 실패했습니다.');
    }
  };

  // === 인증번호 확인 ===
  const handleVerifyCode = async () => {
    console.log('인증번호 확인 버튼 클릭됨'); // 디버깅용
    if (!verificationCode) {
      setMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/v1/kurung/user/confirm-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (response.ok) {
        const message = await response.text(); // String으로 받기
        setMessage(message);
        setIsCodeVerified(true);
      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('API 오류:', error); // 디버깅용
      setMessage('서버 연결에 실패했습니다.');
    }
  };

  // === 비밀번호 확인 ===
  const handleConfirmPassword = () => {
    console.log('비밀번호 확인 버튼 클릭됨'); // 디버깅용
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('비밀번호는 6자리 이상이어야 합니다.');
      return;
    }
    setMessage('비밀번호가 확인되었습니다.');
  };

  // === 비밀번호 재설정 ===
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    console.log('비밀번호 재설정 버튼 클릭됨'); // 디버깅용
    
    if (!isCodeVerified) {
      setMessage('인증번호를 먼저 확인해주세요.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/v1/kurung/user/reset-password-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          verificationCode, 
          newPassword, 
          confirmPassword 
        }),
      });

      if (response.ok) {
        const data = await response.json(); // 이 API는 UserDTO를 반환
        setMessage('비밀번호가 성공적으로 재설정되었습니다.');
        // 로그인 페이지로 이동
        window.location.href = '/loginPage';
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 오류:', error); // 디버깅용
      setMessage('서버 연결에 실패했습니다.');
    }
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box password-reset-box">
          <h1 className="password-reset-title">비밀번호 재설정</h1>
          <p className="password-reset-desc">
            회원정보에 등록한 이메일주소가 동일해야<br />
            인증번호를 받을 수 있습니다.
          </p>
          <form className="password-reset-form" onSubmit={handlePasswordReset}>
            <div className="password-reset-section">
              <div className="password-reset-label">아이디(이메일)</div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input" 
                  type="email" 
                  placeholder="아이디 입력" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleSendVerificationCode}
                  style={{ cursor: 'pointer' }} // 커서 스타일 추가
                >
                  인증번호 발송
                </button>
              </div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input" 
                  type="text" 
                  placeholder="인증번호 6자리 숫자 입력" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleVerifyCode}
                  style={{ cursor: 'pointer' }} // 커서 스타일 추가
                >
                  인증번호 확인
                </button>
              </div>
            </div>
            <div className="password-reset-section">
              <div className="password-reset-label">비밀번호</div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input pw-new-input" 
                  type="password" 
                  placeholder="새 비밀번호 입력" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input pw-confirm-input" 
                  type="password" 
                  placeholder="비밀번호 확인" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleConfirmPassword}
                  style={{ cursor: 'pointer' }} // 커서 스타일 추가
                >
                  비밀번호 확인
                </button>
              </div>
            </div>
            <button 
              className="password-reset-submit" 
              type="submit"
              style={{ cursor: 'pointer' }} // 커서 스타일 추가
            >
              비밀번호 재설정
            </button>
          </form>
          {message && (
            <div className="password-reset-message" style={{ 
              color: message.includes('성공') || message.includes('확인') ? 'green' : 'red',
              marginTop: '10px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;