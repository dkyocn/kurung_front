// src/routers/medicineRoutes.js
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MedicineInteraction from '../pages/medicineInteraction/medicineInteraction';

const medicineRoutes = [
  <Route path="/medicineInteraction" element={<MedicineInteraction />} />,
];

export default medicineRoutes;
