//통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import Home from '../pages/Home';
// import About from '../pages/help/About';

// 기능별로 작성한 라우터를 불러오기
// import boardRoutes from './boardRoutes';
// import noticeRoutes from './noticeRoutes';
// import memberRoutes from './memberRoutes';
// import lifeLogRoutes from './lifeLogRoutes';
import missionRoutes from './missionRoutes';
import dietRouters from './dietRouters';
import recipeRoutes from './recipeRoutes';
import lifeLogRoutes from './lifeLogRoutes';
import exerciseRoutes from './exerciseLogRoutes';
import favoritesRoutes from './favoritesRoutes';
import diagnosisRoutes from './diagnosisLogRoutes';
import healthReportRoutes from './healthReportRoutes';
import loginRoutes from './loginRoutes';
import signupRoutes from './signupRoutes';
import passwordResetRoutes from './myPageRoutes';
import chatbotRoutes from './chatbotRoutes';
import communityRoutes from './communityRoutes';


const AppRouter = () => {
  return (
    <Routes>
      {/* 메인 페이지 라우트 추가 */}
      <Route path="/" element={<div>메인 페이지</div>} />
      <Route path="/main" element={<div>메인 페이지</div>} />
      
      {favoritesRoutes}
      {loginRoutes}
      {missionRoutes}
      {exerciseRoutes}
      {lifeLogRoutes}
      {dietRouters}
      {diagnosisRoutes}
      {recipeRoutes}
      {healthReportRoutes}
      {communityRoutes}
      {signupRoutes}
      {passwordResetRoutes}
      {chatbotRoutes}
    </Routes>
  );
};

export default AppRouter;
