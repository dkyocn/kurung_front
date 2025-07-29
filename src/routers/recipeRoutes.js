// src/routers/recipeRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Recipe from '../pages/diet/recipe';

const recipeRoutes = [<Route path="/recipe" element={<Recipe />} />];

export default recipeRoutes;
