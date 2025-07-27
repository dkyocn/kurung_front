// src/components/buttons/CancleButton.js

import React from 'react';
import '../styles/CancleButton.css'; // 버튼 스타일 분리

const CancleButton = ({ label = '취소', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="cancle-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default CancleButton;
