// src/routers/mypageRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import GetMypage from '../pages/mypage/getMypage';

const mypageRoutes = [
  <Route path="/mypage" element={<GetMypage />} />,
];

export default mypageRoutes;
