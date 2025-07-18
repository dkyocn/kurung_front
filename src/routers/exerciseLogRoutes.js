// src/routers/exerciseLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateExerciseLog from '../pages/exercise/createExerciseLog';

// 여러 개의 route를 반환할 때는 배열로!
const exerciseLogRoutes = [
  <Route path="/createExerciseLog" element={<CreateExerciseLog />} />,
  // 여기에 다른 운동 기록 관련 Route 추가 가능
];

export default exerciseLogRoutes;
