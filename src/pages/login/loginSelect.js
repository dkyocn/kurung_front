import React, { useState, useEffect, useRef } from 'react';
import '../../styles/login/loginSelect.css';
import '../../styles/login/faceLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import kakaologo from '../../images/login/kakaologo.png';
import naverlogo from '../../images/login/naverlogo.png';
import faceLogo from '../../images/login/FaceLogin.png';

function LoginSelect() {
  const navigate = useNavigate();
  
  // === Face ID 관련 상태 ===
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState(''); // 이메일 상태 추가
  
  // === 카메라 관련 ref ===
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // === 카메라 정리 ===
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Face ID 로그인용 axios 인스턴스
  const faceLoginApi = axios.create({
    baseURL: 'http://localhost:8000', // FastAPI 서버
  });

  // === 카메라 시작 ===
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // 전면 카메라 사용
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  // === 카메라 중지 ===
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsFaceLogin(false);
    setEmail(''); // 이메일 초기화
  };

  // === 이메일 입력 핸들러 ===
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // === 얼굴 촬영 및 로그인 ===
  const captureAndLogin = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // userId 유효성 검사
    if (!email) {
      setError('아이디를 입력해주세요.');
      return;
    }

    setIsCapturing(true);
    setError('');

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // 비디오 크기에 맞춰 캔버스 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 현재 비디오 프레임을 캔버스에 그리기
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스에서 이미지 데이터를 Blob으로 변환
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('이미지 캡처에 실패했습니다.');
          setIsCapturing(false);
          return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('user_id', email); // userId 추가
        formData.append('face_image', blob, 'face.jpg');

        // Face ID 로그인 API 호출
        try {
          const response = await faceLoginApi.post('/login-face', formData);
          
          // JWT 토큰 저장
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.access_token); 
          
          // 로그인 상태 변화 이벤트 발생
          window.dispatchEvent(new Event('loginStatusChanged'));
          
          console.log('Face ID 로그인 성공:', response.data);
          stopCamera();
          navigate('/main');
          
        } catch (err) {
          console.error('Face ID 로그인 오류:', err);
          
          let errorMessage = 'Face ID 로그인에 실패했습니다.';
          
          setError(errorMessage);
        }
        
        setIsCapturing(false);
      }, 'image/jpeg', 0.8);

    } catch (err) {
      console.error('이미지 캡처 오류:', err);
      setError('이미지 캡처 중 오류가 발생했습니다.');
      setIsCapturing(false);
    }
  };

  // === Face ID 등록 ===
  const registerFaceId = async () => {
    // user_uuid =getUserUuidFromToken();
    if (!videoRef.current || !canvasRef.current) return;
    
    // 이메일 유효성 검사
    if (!email || !email.includes('@')) {
      setError('유효한 이메일을 입력해주세요.');
      return;
    }

    setIsCapturing(true);
    setError('');

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('이미지 캡처에 실패했습니다.');
          setIsCapturing(false);
          return;
        }

        const formData = new FormData();
        formData.append('user_id', email); // 이메일 추가
        formData.append('face_image', blob, 'face.jpg');

        try {
          const response = await faceLoginApi.post('/register-face', formData);
          console.log('Face ID 등록 성공:', response.data);
          setError(''); // 에러 메시지 제거
          alert('Face ID 등록이 완료되었습니다!'); // 성공 메시지
          stopCamera();
          
        } catch (err) {
          console.error('Face ID 등록 오류:', err);
          
          let errorMessage = 'Face ID 등록에 실패했습니다.';
          
          setError(errorMessage);
        }
        
        setIsCapturing(false);
      }, 'image/jpeg', 0.8);

    } catch (err) {
      console.error('Face ID 등록 오류:', err);
      setError('Face ID 등록 중 오류가 발생했습니다.');
      setIsCapturing(false);
    }
  };

  // === Face ID 로그인 핸들러 ===
  const handleFaceLogin = () => {
    setIsFaceLogin(true);
    // 약간의 지연 후 카메라 시작
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  // accessToken에서 userUuid 추출 (JWT 전용) - exerciseLogCheck.js 참고
  const getUserUuidFromToken = () => {
    try {
      // localStorage에서 실제 로그인된 사용자의 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('accessToken이 localStorage에 없습니다.');
        return null;
      }

      if (accessToken && accessToken.split('.').length === 3) {
        // JWT payload 추출 (Base64 디코딩)
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        console.log('토큰에서 추출한 사용자 정보:', payload);
        return payload.userUuid;
      }
    } catch (e) {
      console.error('토큰에서 userUuid 추출 실패:', e);
    }
    return null;
  };

  // === 네이버 로그인 핸들러 ===
  const handleNaverLogin = () => {
    const clientId = '3Os7CSY9u41ugvx8VLkz'; // 수정된 Client ID
    const redirectUri = 'http://localhost:3000/auth/naver/callback';
    const state = 'STATE';
    
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    
    console.log('네이버 로그인 URL:', naverAuthUrl); // 디버깅용
    window.location.href = naverAuthUrl;
  };

  // === 카카오 로그인 핸들러 ===
  const handleKakaoLogin = () => {
    const clientId = 'e0ccd9a1366d275242dc304128c7ef03';
    const redirectUri = 'http://localhost:3000/auth/kakao/callback';
    
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    console.log('카카오 로그인 URL:', kakaoAuthUrl); // 디버깅용
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="login-box">
          <h1 className="login-title">KURUNG</h1>
          <p className="login-subtitle">Welcome to Wellbeing Hub</p>
          
          {/* === Face ID 로그인 섹션 === */}
          {isFaceLogin ? (
            <div className="face-login-section">
              
              <div className="camera-container">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="camera-video"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              
              {/* 에러 메시지 표시 */}
              {error && (
                <div className="face-login-error">
                  {error}
                </div>
              )}
              
              <div className="face-login-buttons">
                {!isCameraOn ? (
                  <button 
                    className="face-login-btn" 
                    onClick={startCamera}
                  >
                    카메라 시작
                  </button>
                ) : (
                  <>
                    {/* 이메일 입력 섹션 */}
               <div className="email-input-section">
                 <input
                   type="email"
                   value={email}
                   onChange={handleEmailChange}
                   placeholder="아이디를 입력하세요"
                   className="email-input"
                 />
                  <button 
                        className="face-login-btn primary" 
                        onClick={captureAndLogin}
                        disabled={isCapturing || !email}
                      >
                        {isCapturing ? '인식 중...' : '로그인'}
                      </button>
               </div>
                      <button 
                        className="face-login-btn secondary" 
                        onClick={registerFaceId}
                        disabled={isCapturing || !email}
                      >
                        Face ID 등록
                      </button>
                      <button 
                        className="face-login-btn cancel" 
                        onClick={stopCamera}
                      >
                        취소
                      </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* === 기존 로그인 버튼들 (디자인 유지) === */
            <div className="login-buttons">
              <button className="login-btn kakao" onClick={handleKakaoLogin}>
                <img src={kakaologo} alt="Kakao" className="login-icon" />
              </button>
              <button className="login-btn naver" onClick={handleNaverLogin}>
                <img src={naverlogo} alt="Naver" className="login-icon" />
              </button>
              <button className="login-btn school" onClick={handleFaceLogin}>
                <img src={faceLogo} alt="Face Login" className="login-icon" />
              </button>
              <Link to="/loginPage" className="login-btn mail">
                <span className="btn-text">Mail</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginSelect;