// src/routers/communityRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import CommunityPage from '../pages/community/communityPage';
import CommunityCreate from '../pages/community/communityCreate';
import GetCommunity from '../pages/community/getcommunity';
import UpdateCommunity from '../pages/community/updateCommunity';

const communityRoutes = [
  <Route
    key="communityPage"
    path="/communityPage"
    element={<CommunityPage />}
  />,
  <Route
    key="CommunityCreate"
    path="/communityCreate"
    element={<CommunityCreate />}
  />,
  <Route key="getCommunity" path="/community/:id" element={<GetCommunity />} />,
  <Route
    key="updateCommunity"
    path="/UpdateCommunity/:id"
    element={<UpdateCommunity />}
  />,
];

export default communityRoutes;
