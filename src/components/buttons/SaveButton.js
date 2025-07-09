// src/components/buttons/SaveButton.js

import React from 'react';
import '../styles/SaveButton.css'; // 버튼 스타일 분리

const SaveButton = ({ label = '저장', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="save-button" onClick={handleClick}>
      저장
    </button>
  );
};

export default SaveButton;
