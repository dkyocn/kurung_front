import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';

function NaverCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleNaverCallback = async () => {
      try {
        // URL에서 code 파라미터 추출
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          setError('인증 코드를 받지 못했습니다.');
          setLoading(false);
          return;
        }

        console.log('네이버 인증 코드:', code);
        console.log('네이버 state:', state);

        // 백엔드로 네이버 로그인 요청
        const response = await axios.post('/user/naver/login', {
          socialToken: code
        });

        console.log('네이버 로그인 응답:', response.data);

        // 백엔드 응답 형식에 맞게 처리
        if (response.data.accessToken) {
          // 토큰 저장
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // 사용자 정보 저장
          const userInfo = {
            userUuid: response.data.userUuid,
            userId: response.data.userId,
            userNick: response.data.userNick,
            userPath: response.data.userPath,
            profileImg: response.data.profileImg,
            isNewUser: response.data.isNewUser
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          // 로그인 상태 변화 이벤트 발생
          window.dispatchEvent(new Event('loginStatusChanged'));
          
          console.log('네이버 로그인 성공:', response.data.message);
          console.log('신규 사용자 여부:', response.data.isNewUser);
          
          // 메인 페이지로 이동
          navigate('/main');
        } else {
          setError(response.data.message || '로그인에 실패했습니다.');
        }

      } catch (err) {
        console.error('네이버 로그인 오류:', err);
        
        let errorMessage = '네이버 로그인에 실패했습니다.';
        
        if (err.response?.status === 404) {
          errorMessage = '네이버 로그인 API가 아직 구현되지 않았습니다. 백엔드 개발자에게 문의해주세요.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 401) {
          errorMessage = '네이버 인증에 실패했습니다.';
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = '서버에 연결할 수 없습니다.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleNaverCallback();
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
          네이버 로그인 처리 중...
        </div>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #03c75a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
            backgroundColor: '#03c75a',
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

export default NaverCallback; 