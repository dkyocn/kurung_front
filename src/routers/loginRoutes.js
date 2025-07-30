// src/routers/lifeLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSelect from '../pages/login/loginSelect';
import LoginPage from '../pages/login/loginPage';
import KakaoCallback from '../pages/login/kakaoCallback';
import NaverCallback from '../pages/login/naverCallback';

const loginRoutes = [
  <Route path="/loginSelect" element={<LoginSelect />} />,
  <Route path="/loginPage" element={<LoginPage />} />,
  <Route path="/auth/kakao/callback" element={<KakaoCallback />} />,
  <Route path="/auth/naver/callback" element={<NaverCallback />} />,
];

export default loginRoutes;


