// src/routers/lifeLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CreateLifeLog from '../pages/lifeLog/createLifeLog';

const lifeLogRoutes = [
  <Route path="/createLifeLog" element={<CreateLifeLog />} />,
];

export default lifeLogRoutes;
