// src/routers/missionRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import GetMissionsList from '../pages/missions/getMissionsList';

const missionRoutes = [
  <Route path="/missions" element={<GetMissionsList />} />,  // ✅ 정확하게 이 경로
];

export default missionRoutes;
