// src/components/buttons/CheckButton.js

import React from 'react';
import '../styles/CheckButton.css'; // 만든 CSS 불러오기

const CheckButton = ({ label = '작성', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="check-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default CheckButton;
