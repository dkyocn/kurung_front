// src/routers/myPageRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PasswordReset from '../pages/myPage/passwordReset';
import Withdrawal from '../pages/myPage/withdrawal';
import MyInfoManagement from '../pages/myPage/myInfoManagement';

const myPageRoutes = [
   <Route path="/mypage" element={<GetMypage />} />,
  <Route path="/passwordReset" element={<PasswordReset />} />,
  <Route path="/withdrawal" element={<Withdrawal />} />,
  <Route path="/myInfoManagement" element={<MyInfoManagement />} />,
];

export default myPageRoutes;
