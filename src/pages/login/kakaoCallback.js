import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // URL에서 code 파라미터 추출
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          setError('인증 코드를 받지 못했습니다.');
          setLoading(false);
          return;
        }

        console.log('카카오 인증 코드:', code);

        // 백엔드로 카카오 로그인 요청
        const response = await axios.post('http://localhost:8081/api/v1/kurung/user/kakao/callback', {
          code: code
        });

        console.log('카카오 로그인 응답:', response.data);

        // 토큰 저장
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // 로그인 상태 변화 이벤트 발생
          window.dispatchEvent(new Event('loginStatusChanged'));
          
          // 메인 페이지로 이동
          navigate('/main');
        } else {
          setError('로그인에 실패했습니다.');
        }

      } catch (err) {
        console.error('카카오 로그인 오류:', err);
        
        let errorMessage = '카카오 로그인에 실패했습니다.';
        
        if (err.response?.status === 404) {
          errorMessage = '카카오 로그인 API가 아직 구현되지 않았습니다. 백엔드 개발자에게 문의해주세요.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 401) {
          errorMessage = '카카오 인증에 실패했습니다.';
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = '서버에 연결할 수 없습니다.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleKakaoCallback();
  }, [navigate, location]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          카카오 로그인 처리 중...
        </div>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px', color: '#e74c3c' }}>
          {error}
        </div>
        <button 
          onClick={() => navigate('/loginSelect')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return null;
}

export default KakaoCallback; 