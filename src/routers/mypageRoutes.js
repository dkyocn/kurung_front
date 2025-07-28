// src/routers/mypageRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PasswordReset from '../pages/mypage/passwordReset';
import Withdrawal from '../pages/mypage/withdrawal';
import MyInfoManagement from '../pages/mypage/myInfoManagement';
import GetMypage from '../pages/mypage/getMypage';

const mypageRoutes = [
   <Route path="/mypage" element={<GetMypage />} />,
  <Route path="/passwordReset" element={<PasswordReset />} />,
  <Route path="/withdrawal" element={<Withdrawal />} />,
  <Route path="/myInfoManagement" element={<MyInfoManagement />} />,
];

export default mypageRoutes;
