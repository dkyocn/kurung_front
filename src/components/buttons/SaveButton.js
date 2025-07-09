// src/components/buttons/UpdateButton.js

import React from "react";
import "../styles/UpdateButton.css"; // 버튼 스타일 분리

const UpdateButton = ({ label = "저장", onClick }) => {
  return (
    <button className="update-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default UpdateButton;
