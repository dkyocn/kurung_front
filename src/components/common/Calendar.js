import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

function SimpleCalendar() {
  const [value, setValue] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  // ✅ URL에서 date=YYYY-MM-DD 파라미터 파싱
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateString = params.get('date');

    if (dateString) {
      const parsed = new Date(dateString);
      if (!isNaN(parsed)) {
        setValue(parsed);
        setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1)); // 해당 달로 뷰 이동
      }
    }
  }, []);

  const handleDateClick = (date) => {
    setValue(date);

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    setViewDate(startOfMonth);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;

    // ✅ URL 이동 (전체 페이지 새로고침 포함)
    window.location.href = `/lifelog?date=${formatted}`;
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  return (
    <div className="calendar-container">
      <Calendar
        value={value}
        activeStartDate={viewDate}
        onActiveStartDateChange={handleMonthChange}
        onClickDay={handleDateClick}
        prevLabel="〈"
        nextLabel="〉"
        locale="ko-KR"
        formatShortWeekday={(locale, date) => {
          const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
          return weekdays[date.getDay()];
        }}
        formatDay={(locale, date) => `${date.getDate()}`}
      />
    </div>
  );
}

export default SimpleCalendar;
