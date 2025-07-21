// src/routers/lifeLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CreateLifeLog from '../pages/lifeLog/createLifeLog';
import GetLifeLogList from '../pages/lifeLog/getLifeLogList';
import UpdateLifeLog from '../pages/lifeLog/updateLifeLog';

const lifeLogRoutes = [
  <Route path="/createLifeLog" element={<CreateLifeLog />} />,
  <Route path="/getLifeLogList" element={<GetLifeLogList />} />,
  <Route path="/updateLifeLog" element={<UpdateLifeLog />} />,
];

export default lifeLogRoutes;
