// src/routers/lifeLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSelect from '../pages/login/loginSelect';
import LoginPage from '../pages/login/loginPage';

const loginRoutes = [
  <Route path="/loginSelect" element={<LoginSelect />} />,
  <Route path="/loginPage" element={<LoginPage />} />,
];

export default loginRoutes;


