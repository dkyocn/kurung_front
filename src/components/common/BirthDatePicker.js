import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BirthDatePicker.css';

const BirthDatePicker = ({ onConfirm, onClose, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [container] = useState(() => {
    const existing = document.getElementById('birth-date-picker-root');
    if (existing) return existing;
    const div = document.createElement('div');
    div.id = 'birth-date-picker-root';
    document.body.appendChild(div);
    return div;
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    onConfirm(formattedDate);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="birthDatePickerOverlay" onClick={handleOverlayClick}>
      <div className="birthDatePickerContent">
        <h3 className="birthDatePickerTitle">생년월일 선택</h3>
        <div className="birthDatePickerCalendar">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            maxDate={new Date()} // 오늘 날짜까지만 선택 가능 (미래 생년월일 방지)
            minDate={new Date(1900, 0, 1)} // 1900년 1월 1일부터 선택 가능
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
        <div className="birthDatePickerBtn">
          <button className="birthDatePickerCancelBtn" onClick={onClose}>
            취소
          </button>
          <button className="birthDatePickerConfirmBtn" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>,
    container
  );
};

export default BirthDatePicker; 