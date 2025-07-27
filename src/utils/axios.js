import axios from 'axios';

// 페이지에서 공통으로 사용할 axios 객체 생성함
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함 여부
});

// === 토큰 자동 헤더 추가 ===
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    if (refreshToken) {
      config.headers['RefreshToken'] = refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (성공/실패 공통 처리)
apiClient.interceptors.response.use(
  (response) => {
    // 요청이 성공했을 때 공통 처리
    console.log('Axios 요청 성공 : ', response);
    return response;
  },
  (error) => {
    // 요청이 실패했을 때 공통 처리
    console.error('Axios 응답 에러 : ', error);
    
    // 토큰 만료 처리
    if (error.response?.status === 401) {
      const tokenExpired = error.response.headers['token-expired'];
      
      if (tokenExpired === 'Both' || tokenExpired === 'RefreshToken') {
        // 토큰이 만료되었으므로 로컬 스토리지에서 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
