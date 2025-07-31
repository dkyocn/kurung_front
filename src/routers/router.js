//통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import Home from '../pages/Home';
// import About from '../pages/help/About';

// 기능별로 작성한 라우터를 불러오기
// import boardRoutes from './boardRoutes';
// import noticeRoutes from './noticeRoutes';
// import memberRoutes from './memberRoutes';

import mainRoutes from './mainRoutes';
import dietRouters from './dietRouters';
import recipeRoutes from './recipeRoutes';
import lifeLogRoutes from './lifeLogRoutes';
import exerciseRoutes from './exerciseLogRoutes';
import diagnosisRoutes from './diagnosisLogRoutes';
import healthReportRoutes from './healthReportRoutes';
import loginRoutes from './loginRoutes';
import signupRoutes from './signupRoutes';
import myPageRoutes from './mypageRoutes';
import chatbotRoutes from './chatbotRoutes';
import communityRoutes from './communityRoutes';
import medicineRoutes from './medicineRoutes';
import favoritesRoutes from './favoritesRoutes';
import missionRoutes from './missionRoutes';

const AppRouter = () => {
  return (
    <Routes>
      {mainRoutes}
      {myPageRoutes}
      {chatbotRoutes}
      {/* 메인 페이지 라우트 추가 */}
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
      {loginRoutes}
      {signupRoutes}
      {medicineRoutes}
    </Routes>
  );
};

export default AppRouter;
