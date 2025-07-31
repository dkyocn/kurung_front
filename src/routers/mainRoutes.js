import React from 'react';
import { Route } from 'react-router-dom';
import MainPage from '../pages/main/main';

const mainRoutes = [<Route key="main" path="/main" element={<MainPage />} />];

export default mainRoutes;
