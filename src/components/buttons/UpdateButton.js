// src/components/buttons/UpdateButton.js

import React from 'react';
import '../styles/UpdateButton.css';

const UpdateButton = ({ label = '수정', link, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(); // onClick 우선 실행
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <button className="update-button" onClick={handleClick}>
      수정
    </button>
  );
};

export default UpdateButton;
