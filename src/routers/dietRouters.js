// src/routers/dietRouters.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Diet from '../pages/diet/diet';

const dietRoutes = [<Route path="/diet" element={<Diet />} />];

export default dietRoutes;
