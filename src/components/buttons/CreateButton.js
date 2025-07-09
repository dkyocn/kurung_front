// src/components/buttons/CreateButton.js

import React from 'react';
import '../styles/CreateButton.css'; // 버튼 스타일 분리

const CreateButton = ({ label = '작성', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="create-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default CreateButton;
