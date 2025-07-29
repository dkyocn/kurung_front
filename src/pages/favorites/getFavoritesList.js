import React, { useState, useEffect } from 'react';
import '../../styles/favorites/getFavoritesList.css';
import filledStar from '../../assets/star-filled.png';
import emptyStar from '../../assets/star-empty.png';
import apiClient from '../../utils/axios';

// JWT 토큰에서 userUuid 추출
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
    return JSON.parse(jsonPayload).userUuid;
  } catch (error) {
    console.error('토큰 파싱 오류:', error);
    return null;
  }
};

const GetFavoritesList = () => {
  const [favorites, setFavorites] = useState({ ROUTINES: [], RECIPE: [], COMMUNITY: [] });
  const [loading, setLoading] = useState(true);
  const userUuid = getUserUuidFromToken();

  // 1️⃣ 타입별 즐겨찾기 조회
  const fetchFavoritesByType = async (type) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await apiClient.get('/favorites/list', {
        params: { favoritesType: type, userUuid }, // 로그인한 사용자 기준 + 타입별 조회
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data || [];
    } catch (error) {
      console.error(`❌ ${type} 즐겨찾기 조회 실패:`, error);
      return [];
    }
  };

  // 2️⃣ 전체 즐겨찾기 조회
  const fetchAllFavorites = async () => {
    const routines = await fetchFavoritesByType('ROUTINES');
    const recipe = await fetchFavoritesByType('RECIPE');
    const community = await fetchFavoritesByType('COMMUNITY');

    setFavorites({
      ROUTINES: routines || [],
      RECIPE: recipe || [],
      COMMUNITY: community || [],
    });
    setLoading(false);
  };

  // 3️⃣ 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (userUuid) {
      fetchAllFavorites();
    } else {
      setLoading(false);
    }
  }, [userUuid]);

  if (loading) return <div>로딩 중...</div>;

  const toggleFavorite = async (itemId) => {
  const token = localStorage.getItem('accessToken');

  setFavorites((prev) =>
    prev.map((item) =>
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    )
  );

  const toggledItem = favorites.find((item) => item.id === itemId);
  const newStatus = !toggledItem.isFavorite; // 새 상태 계산

  try {
    if (!newStatus) {
      // 즐겨찾기 해제 (DELETE)
      await apiClient.delete(`/favorites/delete/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // 즐겨찾기 추가 (POST)
      await apiClient.post(
        '/favorites/create',
        { favoriteId: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.error('즐겨찾기 토글 실패:', error);

    // ❗ 요청 실패 시 상태 원복
    setFavorites((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFavorite: toggledItem.isFavorite } : item
      )
    );
  }
};


  return (
    <div className="favorites-container">
      <h2 className="favorites-title">즐겨찾기</h2>

      <div className="favorites-section">
        <h3>즐겨찾는 커뮤니티</h3>
        {favorites.COMMUNITY.length === 0 ? (
          <p>데이터 없음</p>
        ) : (
          favorites.COMMUNITY.map((fav, index) => (
            <div key={fav.favoriteId || `COMMUNITY-${index}`} className="favorite-card">
              <div className="favorite-info">
                <p className="favorite-title">{fav.title || '제목 없음'}</p>
                <p className="favorite-description">{fav.description || '설명 없음'}</p>
              </div>
              <img src={filledStar} alt="star" className="star-icon" />
            </div>
          ))
        )}
      </div>

      {/* 운동 */}
      <div className="favorites-section">
        <h3>즐겨찾는 운동</h3>
        {favorites.ROUTINES.length === 0 ? (
          <p>데이터 없음</p>
        ) : (
          favorites.ROUTINES.map((fav, index) => (
            <div key={fav.favoriteId || `ROUTINES-${index}`} className="favorite-card">
              <div className="favorite-info">
                <p className="favorite-title">{fav.title || '운동명 없음'}</p>
                <p className="favorite-description">{fav.description || '운동 설명 없음'}</p>
              </div>
              <img src={filledStar} alt="star" className="star-icon" />
            </div>
          ))
        )}
      </div>

      {/* 식단 */}
      <div className="favorites-section">
        <h3>즐겨찾는 식단</h3>
        {favorites.RECIPE.length === 0 ? (
          <p>데이터 없음</p>
        ) : (
          favorites.RECIPE.map((fav, index) => (
            <div key={fav.favoriteId || `RECIPE-${index}`} className="favorite-card">
              <div className="favorite-info">
                <p className="favorite-title">{fav.title || '레시피명 없음'}</p>
                <p className="favorite-description">{fav.description || '레시피 설명 없음'}</p>
              </div>
              <img src={filledStar} alt="star" className="star-icon" />
            </div>

            
          ))
        )}
      </div>
    </div>
  );
};

export default GetFavoritesList;
