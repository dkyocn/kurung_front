// src/components/buttons/ListButton.js

import React from 'react';
import '../styles/ListButton.css'; // 버튼 스타일 분리

const ListButton = ({ label = '목록', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="update-button" onClick={handleClick}>
      목록
    </button>
  );
};

export default ListButton;
