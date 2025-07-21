// src/routers/favoritesRoutes.js

import React from 'react';
import { Route } from 'react-router-dom';
import GetFavoritesList from '../pages/favorites/getFavoritesList';

import filledStar from '../assets/star-filled.png';
import emptyStar from '../assets/star-empty.png';

const favoritesRoutes = (
  <>
    <Route
      path="/favorites"
      element={
        <GetFavoritesList
          filledStar={filledStar}
          emptyStar={emptyStar}
        />
      }
    />
  </>
);

export default favoritesRoutes;
