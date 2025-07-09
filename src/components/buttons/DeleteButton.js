// src/components/buttons/DeleteButton.js

import React from 'react';
import '../styles/DeleteButton.css'; // 버튼 스타일 분리

const DeleteButton = ({ label = '삭제', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="delete-button" onClick={handleClick}>
      삭제
    </button>
  );
};

export default DeleteButton;
