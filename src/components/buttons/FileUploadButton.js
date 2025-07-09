// src/components/buttons/FileUploadButton.js

import React from 'react';
import '../styles/FileUploadButton.css'; // 버튼 스타일 분리

const FileUploadButton = ({ label = '파일 업로드', onClick }) => {
  return (
    <button className="fileUpload-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default FileUploadButton;
