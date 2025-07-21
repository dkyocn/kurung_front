import React, { useState } from 'react';
import '../../styles/favorites/getFavoritesList.css'; // ← styles는 src/styles 내부
import filledStar from '../../assets/star-filled.png'; // ← src/assets 내부
import emptyStar from '../../assets/star-empty.png';

const initialFavorites = [
  {
    id: 1,
    title: '즐거운 스트레스 해소',
    description:
      '편안한 음악과 함께 명상하기\n유튜브 BGM 채널에서 좋아요가 많은 명상 음악을 추천해 줍니다.',
    isFavorite: true,
  },
  {
    id: 2,
    title: '즐거운 운동',
    description:
      '스트레칭 루틴\n5분 루틴으로 온몸을 가볍게 풀어보는 상쾌한 운동 루틴을 추천드립니다.',
    isFavorite: true,
  },
  {
    id: 3,
    title: '즐거운 식단',
    description:
      '활동 전후 섭취하는 음식\n운동 전후에 추천되는 건강한 식단과 레시피 정보를 제공합니다.',
    isFavorite: true,
  },
];

const GetFavoritesList = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const toggleFavorite = async (itemId) => {
    setFavorites((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    const toggledItem = favorites.find((item) => item.id === itemId);

    if (toggledItem.isFavorite) {
      // 즐겨찾기 해제 요청 (DELETE)
      await fetch(`/api/favorites/${itemId}`, {
        method: 'DELETE',
      });
    } else {
      // 즐겨찾기 추가 요청 (POST)
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toggledItem),
      });
    }
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">즐겨찾기</h2>
      {favorites.map((item) => (
        <div key={item.id} className="favorite-item">
          <div className="favorite-text">
            <h3 className="favorite-subtitle">{item.title}</h3>
            <p className="favorite-description">{item.description}</p>
          </div>
          <div className="favorite-icon">
            <img
              src={item.isFavorite ? filledStar : emptyStar}
              alt="star"
              onClick={() => toggleFavorite(item.id)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetFavoritesList;
