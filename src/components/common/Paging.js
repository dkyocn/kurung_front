import React from 'react';
import '../styles/Paging.css';

export default function Paging({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <span
          key={i}
          className={`pagingPageNum${currentPage === i ? ' active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    return pages;
  };

  return (
    <div className="pagingContainer">
      <span className="pagingArrow" onClick={() => handlePageChange(1)}>
        &laquo;
      </span>
      <span
        className="pagingArrow"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </span>
      {renderPageNumbers()}
      <span
        className="pagingArrow"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </span>
      <span
        className="pagingArrow"
        onClick={() => handlePageChange(totalPages)}
      >
        &raquo;
      </span>
    </div>
  );
}
