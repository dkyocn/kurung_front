import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login/passwordReset.css';

function PasswordReset() {
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  // === 비밀번호 재설정 페이지 접속 시 만료된 토큰 제거 ===
  useEffect(() => {
    // 비밀번호 재설정 페이지에 접속할 때 기존 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('비밀번호 재설정 페이지: 기존 토큰 제거됨');
  }, []);

  // 인증이 필요하지 않은 API용 axios 인스턴스
  const authApi = axios.create({
    baseURL: 'http://localhost:8081', // 직접 URL 지정
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 인증번호 발송
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await authApi.post('/api/v1/kurung/user/send-verification-code', {
        email: formData.email,
        verificationType: "PASSWORD_RESET"  // ✅ 추가
      });
      setMessage('인증번호가 이메일로 발송되었습니다.');
      setIsEmailVerified(true);
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      setMessage(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await authApi.post('/api/v1/kurung/user/confirm-verification-code', {
        email: formData.email,
        verificationCode: formData.verificationCode
      });
      setMessage('인증번호가 확인되었습니다.');
      setIsCodeVerified(true);
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      setMessage(error.response?.data?.message || '인증번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setIsPasswordValid(false);
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage('비밀번호는 8자 이상이어야 합니다.');
      setIsPasswordValid(false);
      return false;
    }

    setMessage('비밀번호가 확인되었습니다.');
    setIsPasswordValid(true);
    return true;
  };

  // 비밀번호 확인
  const handleConfirmPassword = () => {
    validatePassword();
  };

  // 비밀번호 재설정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEmailVerified || !isCodeVerified || !isPasswordValid) {
      setMessage('모든 단계를 완료해주세요.');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await authApi.post('/api/v1/kurung/user/reset-password-by-email', {
        email: formData.email,
        verificationCode: formData.verificationCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword  // ✅ 추가
      });
      setMessage('비밀번호가 성공적으로 재설정되었습니다.');
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setMessage(error.response?.data?.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
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
          
          {message && (
            <div className={`password-reset-message ${message.includes('성공') || message.includes('확인') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form className="password-reset-form" onSubmit={handleSubmit}>
            <div className="password-reset-section">
              <div className="password-reset-label">아이디(이메일)</div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input" 
                  type="email" 
                  placeholder="아이디 입력" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isEmailVerified}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={loading || isEmailVerified}
                >
                  {loading ? '발송 중...' : '인증번호 발송'}
                </button>
              </div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input" 
                  type="text" 
                  placeholder="인증번호 6자리 숫자 입력" 
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  disabled={isCodeVerified}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={loading || isCodeVerified || !isEmailVerified}
                >
                  {loading ? '확인 중...' : '인증번호 확인'}
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
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  disabled={!isCodeVerified}
                />
              </div>
              <div className="password-reset-row">
                <input 
                  className="password-reset-input pw-confirm-input" 
                  type="password" 
                  placeholder="비밀번호 확인" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={!isCodeVerified}
                />
                <button 
                  className="password-reset-btn" 
                  type="button"
                  onClick={handleConfirmPassword}
                  disabled={loading || !isCodeVerified || !formData.newPassword || !formData.confirmPassword}
                >
                  비밀번호 확인
                </button>
              </div>
            </div>
            
            <button 
              className="password-reset-submit" 
              type="submit"
              disabled={loading || !isEmailVerified || !isCodeVerified || !isPasswordValid}
            >
              {loading ? '재설정 중...' : '비밀번호 재설정'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset; 