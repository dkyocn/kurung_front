// src/components/buttons/CheckButton.js

import React from "react";
import "../styles/CheckButton.css"; // 만든 CSS 불러오기

const CheckButton = ({ label, checked, onChange }) => {
  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        id="custom-checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor="custom-checkbox">{label}</label>
    </div>
  );
};

export default CheckButton;


