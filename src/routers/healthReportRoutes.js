// src/routers/healthReportRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import GetHealthReport from '../pages/healthReport/getHealthReport';

const healthReportRoutes = [
  <Route path="/getHealthReport" element={<GetHealthReport />} />,
];

export default healthReportRoutes;
