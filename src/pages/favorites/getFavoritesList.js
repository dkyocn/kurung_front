import React, { useEffect, useState } from 'react';
import '../../styles/favorites/getFavoritesList.css';
import filledStar from '../../assets/star-filled.png';
import emptyStar from '../../assets/star-empty.png';
import apiClient from '../../utils/axios';

const getUserUuidFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token || token.split('.').length !== 3) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).userUuid || null;
  } catch (e) {
    console.error('토큰 파싱 실패:', e);
    return null;
  }
};

const GetFavoritesList = () => {
  const token = localStorage.getItem('accessToken');
  const userUuid = getUserUuidFromToken();
  const favoritesTypes = ['ROUTINES', 'FOOD', 'COMMUNITY'];

  const [favorites, setFavorites] = useState({
    ROUTINES: [],
    FOOD: [],
    COMMUNITY: [],
  });

  const [favoritesState, setFavoritesState] = useState({});

  // 즐겨찾기 목록 조회
  const fetchFavoritesByType = async (type) => {
    try {
      const response = await apiClient.get('/favorites/list', {
        params: { userUuid, favoritesType: type },
        headers: { Authorization: token },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        const data = response.data.slice(0, 3);
        setFavorites((prev) => ({ ...prev, [type]: data }));

        setFavoritesState((prev) => {
          const newState = { ...prev };
          data.forEach((item) => {
            newState[item.favoritesId] = true;
          });
          return newState;
        });
      } else {
        setFavorites((prev) => ({ ...prev, [type]: [] }));
      }
    } catch (error) {
      console.error(`❌ ${type} 즐겨찾기 조회 실패:`, error.response?.data || error.message);
      setFavorites((prev) => ({ ...prev, [type]: [] }));
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = (type, item) => {
    if (!item.favoritesId) return;

    const isCurrentlyFav = favoritesState[item.favoritesId];

    if (isCurrentlyFav) {
      apiClient
        .delete(`/favorites/delete`, {
          params: { favoriteId: item.favoritesId },
          headers: { Authorization: token },
        })
        .then(() => {
          setFavoritesState((prev) => ({
            ...prev,
            [item.favoritesId]: false,
          }));
          fetchFavoritesByType(type);
        })
        .catch((err) => console.error('즐겨찾기 삭제 실패:', err));
    } else {
      apiClient
        .post(
          `/favorites/create`,
          {
            userUuid,
            favoritesType: type,
            targetId: item.favoritesId,
          },
          { headers: { Authorization: token } }
        )
        .then(() => {
          setFavoritesState((prev) => ({
            ...prev,
            [item.favoritesId]: true,
          }));
          fetchFavoritesByType(type);
        })
        .catch((err) => console.error('즐겨찾기 추가 실패:', err));
    }
  };

  useEffect(() => {
    favoritesTypes.forEach((type) => fetchFavoritesByType(type));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">즐겨찾기</h1>

      {favoritesTypes.map((type) => (
        <div key={type} className="favorites-section">
          <h2 className="favorites-subtitle">
            즐겨찾는 {type === 'ROUTINES' ? '운동' : type === 'FOOD' ? '식단' : '커뮤니티'}
          </h2>

          <div className="favorites-list">
            {favorites[type] && favorites[type].length > 0 ? (
              favorites[type].map((item) => {
                let displayName = '';
                let imageUrl = '';

                switch (type) {
                  case 'ROUTINES':
                    displayName = item.routinesDTO?.title ?? `ID: ${item.favoritesId}`;
                    break;
                  case 'FOOD':
                    displayName = item.foodDTO?.foodName ?? `ID: ${item.favoritesId}`;
                    imageUrl = item.foodDTO?.foodPhoto ?? '';
                    break;
                  case 'COMMUNITY':
                    displayName = item.communityDTO?.title ?? `ID: ${item.favoritesId}`;
                    break;
                  default:
                    displayName = `ID: ${item.favoritesId}`;
                }

                return (
                  <div className="favorite-card" key={`${type}-${item.favoritesId ?? 'temp'}`}>
                    <div className="favorite-content">
                      {type === 'FOOD' && (
                        <img
                          src={
                            imageUrl.startsWith('http')
                              ? imageUrl
                              : `${process.env.PUBLIC_URL}${imageUrl}`
                          }
                          alt={displayName}
                          className="favorite-food-photo"
                        />
                      )}
                      <p className="favorite-title">{displayName}</p>

                      {type === 'ROUTINES' && item.routinesDTO?.videoUrl && (
                        <button
                          className="routine-btn start-btn"
                          onClick={() =>
                            window.open(item.routinesDTO?.videoUrl, '_blank', 'noopener,noreferrer')
                          }
                        >
                          운동 시청
                        </button>
                      )}
                    </div>

                    <img
                      src={favoritesState[item.favoritesId] ? filledStar : emptyStar}
                      alt="favorite"
                      className="favorite-icon"
                      onClick={() => toggleFavorite(type, item)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                );
              })
            ) : (
              <p className="no-favorites">즐겨찾기 없음</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetFavoritesList;
