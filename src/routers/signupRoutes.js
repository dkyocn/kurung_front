// src/routers/signupRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/signup/signupPage';


const signupRoutes = [
  <Route path="/signupPage" element={<SignupPage />} />,
];

export default signupRoutes;
