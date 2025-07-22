// src/routers/diagnosisLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HealthQuestion from '../pages/healthDiagnosis/healthQuestion';
import HealthResult from '../pages/healthDiagnosis/healthResult';

// 여러 개의 route를 반환할 때는 배열로!
const diagnosisLogRoutes = [
  <Route path="/healthQuestion" element={<HealthQuestion />} />,
  <Route path="/healthResult" element={<HealthResult />} />,
  // 여기에 다른 진단 기록 관련 Route 추가 가능
];

export default diagnosisLogRoutes;
