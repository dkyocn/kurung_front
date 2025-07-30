import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import SignupSuccessModal from '../../components/common/SignupSuccessModal';
import '../../styles/signup/signupPage.css';

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 이메일 중복 체크 함수
  const checkEmailDuplicate = async (email) => {
    try {
      const response = await axios.post('/user/check-email-duplicate', {
        email: email
      });
      return response.data; // true: 중복됨, false: 중복되지 않음
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
      return false; // 에러 시 중복되지 않은 것으로 처리
    }
  };

  // 인증번호 발송 함수
  const handleSendVerificationCode = async () => {
    console.log('인증번호 발송 버튼 클릭됨');
    console.log('이메일:', email);
    
    if (!email) {
      setMessage('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 먼저 이메일 중복 체크
      console.log('이메일 중복 체크 시작');
      const isDuplicate = await checkEmailDuplicate(email);
      
      if (isDuplicate) {
        setMessage('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
        setIsLoading(false);
        return;
      }

      console.log('인증번호 발송 API 요청 시작');
      const response = await axios.post('/user/send-verification-code', {
        email: email
      });

      console.log('인증번호 발송 API 응답:', response.data);
      // 백엔드에서 String으로 응답하므로 response.data를 직접 사용
      if (response.data) {
        setMessage(response.data);
        setIsEmailSent(true);
        console.log('인증번호 발송 성공, isEmailSent = true');
      }
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
      console.log('인증번호 발송 실패, isEmailSent = false');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 함수
  const handleVerifyCode = async () => {
    console.log('인증번호 확인 버튼 클릭됨');
    console.log('이메일:', email);
    console.log('인증번호:', verificationCode);
    console.log('이메일 발송 상태:', isEmailSent);
    
    if (!verificationCode) {
      setMessage('인증번호를 입력해주세요.');
      return;
    }

    if (!isEmailSent) {
      setMessage('먼저 인증번호를 발송해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('API 요청 시작');
      const response = await axios.post('/user/confirm-verification-code', {
        email: email,
        verificationCode: verificationCode
      });

      console.log('API 응답:', response.data);
      // 백엔드에서 String으로 응답하므로 response.data를 직접 사용
      if (response.data) {
        setMessage(response.data);
        setIsEmailVerified(true);
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 확인 함수
  const handleConfirmPassword = () => {
    console.log('비밀번호 확인 버튼 클릭됨');
    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setIsPasswordConfirmed(false);
      return;
    }
    if (password.length < 6) {
      setMessage('비밀번호는 6자리 이상이어야 합니다.');
      setIsPasswordConfirmed(false);
      return;
    }
    setMessage('비밀번호가 확인되었습니다.');
    setIsPasswordConfirmed(true);
  };

  // 회원가입 처리 함수
  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('회원가입 버튼 클릭됨');
    
    if (!isEmailVerified) {
      setMessage('이메일 인증을 완료해주세요.');
      return;
    }
    
    if (!isPasswordConfirmed) {
      setMessage('비밀번호 확인을 완료해주세요.');
      return;
    }
    
    if (!nickname.trim()) {
      setMessage('닉네임을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('회원가입 API 요청 시작');
      const response = await axios.post('/user/signup', {
        userId: email,
        userPwd: password,
        userNick: nickname,
        userGender: 'MALE', // 기본값
        userPath: 'NORMAL' // 기본값
      });
      
      console.log('회원가입 API 응답:', response.data);
      if (response.data) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error.response?.data) {
        setMessage(error.response.data);
      } else {
        setMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 확인 버튼 클릭 시 로그인 페이지로 이동
  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    navigate('/loginPage');
  };

  // 모달 닫기
  const handleModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="signup-box">
          <h1 className="signup-title">KURUNG</h1>
          <form className="signup-form">
            {/* 메시지 표시 영역 */}
            {message && (
              <div className="signup-message" style={{ 
                color: message.includes('성공') || message.includes('완료') ? '#88C71F' : '#ff4444',
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}
            

            
            <div className="signup-row">
              <label className="signup-label">아이디</label>
              <input 
                className="signup-input" 
                type="email" 
                placeholder="이메일을 입력하세요" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailVerified}
              />
              <button 
                className="signup-btn" 
                type="button"
                onClick={handleSendVerificationCode}
                disabled={isLoading || isEmailVerified}
              >
                {isLoading ? '발송 중...' : isEmailSent ? '재발송' : '인증번호 발송'}
              </button>
            </div>
            <div className="signup-row">
              <label className="signup-label">인증코드</label>
              <input 
                className="signup-input" 
                type="text" 
                placeholder="인증번호 입력하세요." 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isEmailVerified}
              />
              <button 
                className="signup-btn" 
                type="button"
                onClick={handleVerifyCode}
                disabled={isLoading || isEmailVerified}
                style={{ 
                  backgroundColor: (isLoading || isEmailVerified) ? '#ccc' : '#88C71F',
                  cursor: (isLoading || isEmailVerified) ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? '확인 중...' : '인증번호 확인'}
              </button>
            </div>
            <div className="signup-row">
              <label className="signup-label">닉네임</label>
              <input 
                className="signup-input" 
                type="text" 
                placeholder="닉네임을 입력하세요" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className="signup-row">
              <label className="signup-label">비밀번호</label>
              <input 
                className="signup-input" 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="signup-row">
              <label className="signup-label">비밀번호 확인</label>
              <input 
                className="signup-input" 
                type="password" 
                placeholder="비밀번호를 다시 입력하세요" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                className="signup-btn" 
                type="button"
                onClick={handleConfirmPassword}
                style={{ 
                  backgroundColor: isPasswordConfirmed ? '#88C71F' : '#ccc',
                  cursor: isPasswordConfirmed ? 'pointer' : 'not-allowed'
                }}
              >
                비밀번호 확인
              </button>
            </div>
            <button 
              className="signup-btn-submit" 
              type="button"
              onClick={handleSignup}
              disabled={!isEmailVerified || !isPasswordConfirmed || isLoading}
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
      
      {/* 회원가입 성공 모달 */}
      {showSuccessModal && (
        <SignupSuccessModal
          onConfirm={handleModalConfirm}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default SignupPage; 