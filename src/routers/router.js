//통합하기 위해 별도로 작성된 라우터 파일들을 임포트함
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import Home from '../pages/Home';
// import About from '../pages/help/About';

// 기능별로 작성한 라우터를 불러오기
// import boardRoutes from './boardRoutes';
// import noticeRoutes from './noticeRoutes';
// import memberRoutes from './memberRoutes';

const AppRouter = () => {
  return (
    <Routes>
      {/* {boardRoutes}
      {noticeRoutes}
      {memberRoutes}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};

export default AppRouter;
