// src/components/buttons/PdfDownloadButton.js

import React from 'react';
import '../styles/PdfDownloadButton.css'; // 버튼 스타일 분리

const PdfDownloadButton = ({ label = 'pdf 다운로드', onClick }) => {
  return (
    <button className="pdfDownload-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default PdfDownloadButton;
