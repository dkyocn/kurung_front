// src/routers/chatbotRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import Chatbot from '../pages/chatbot/chatbot'; // 정확한 경로로 설정

const chatbotRoutes = [
  <Route key="chatbot" path="/chatbot" element={<Chatbot />} />,
];

export default chatbotRoutes;
