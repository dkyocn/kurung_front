/ src/routers/exerciseLogRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateExerciseLog from '../pages/exercise/createExerciseLog';
import CreateObjective from '../pages/exercise/createObjective';
import ExerciseRecode from '../pages/exercise/exerciseRecode';
import ExerciseLogCheck from '../pages/exercise/exerciseLogCheck';
// import UpdateObjective from '../pages/exercise/updateObjective';
// import UpdateExerciseLog from '../pages/exercise/updateExerciseLog';

// <Route path="/updateExerciseLog" element={<UpdateExerciseLog />} />, */}
// 여러 개의 route를 반환할 때는 배열로!
const exerciseLogRoutes = [

  <Route path="/createExerciseLog" element={<CreateExerciseLog />} />,
  <Route path="/createObjective" element={<CreateObjective />} />,
  <Route path="/exerciseRecode" element={<ExerciseRecode />} />,
  <Route path="/exerciseLogCheck" element={<ExerciseLogCheck />} />,  
 
];

export default exerciseLogRoutes;