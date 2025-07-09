// src/components/Footer.js

import React from 'react';
import '../styles/Footer.css'; // CSS 파일 불러오기

const Footer = ({ isLoggedIn, user }) => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a href="#">라이프로그</a>
        <a href="#">식단</a>
        <a href="#">운동</a>
        <a href="#">멘탈케어</a>
        <a href="#">건강관리</a>
        <a href="#">약물 상호작용 확인</a>
        <a href="#">커뮤니티 보드</a>
        <a href="#">{isLoggedIn ? '마이페이지' : '마이페이지'}</a>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-section">
          <strong>(주)KURUNG</strong>
          <br />
          주소: 서울특별시 서초구 서초대로77길 41, 4층 (서초동, 대동Ⅱ)
          <br />
          사업자등록번호: 421-25-25122
          <br />
          통신판매업신고: 2024-성남수정-0912
          <br />
          관광사업 등록번호: 제2025-000025호
          <br />
          호스팅서비스 제공자: (주)KURUNG | 대표이사: 세미콜론 실종사건
        </div>
      </div>
    </footer>
  );
};

export default Footer;
