// import React from 'react';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import apiClient from '../src/utils/axios';
import './App.css';

// 사용할 컴포넌트 불러오기 : 모든 페이지에 적용됨
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// 별도로 작성된 라우터 등록 설정 파일을 불러오기함
import AppRouter from './routers/router';

function App() {
  const [dietId, setDietId] = useState('');

  useEffect(() => {
    apiClient.get('/diet/1').then((res) => {
      setDietId(res.data.dietId);
    });
  }, []);
  return <div className="App">백엔드 데이터 : {dietId}</div>;
  // return (
  //   <Router>
  //     {/* 라우터 등록은 App.js 에서 설정함 */}
  //     <Header /> {/* 모든 페이지에 공통으로 표시 */}
  //     <AppRouter /> {/* 라우터 설정 */}
  //     <Footer /> {/* 모든 페이지에 공통으로 표시 */}
  //   </Router>
  // );
}

export default App;
