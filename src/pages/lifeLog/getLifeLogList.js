import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emotionIcons from '../../images/lifeLog/emotionIcons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/lifeLog/getLifeLogList.css';

const emotionColors = {
  행복함: '#28C76F',
  평온함: '#87CEEB',
  슬픔: '#007AFF',
  화남: '#FF3B30',
  불안함: '#FF9500',
  피곤함: '#A9A9A9',
  신남: '#FF69B4',
  우울함: '#FFD700',
};

const formatDateTime = (isoString) => {
  if (!isoString) return '없음';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}시 ${minute}분`;
};

const LifeLogCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [lifeLogMap, setLifeLogMap] = useState({});
  const [selectedLog, setSelectedLog] = useState(null);
  const [noData, setNoData] = useState(false);

  const userUuid = '2025061401';

  const fetchLifeLogs = async (year, month) => {
    const dateParam = `${year}-${String(month).padStart(2, '0')}-01`;

    try {
      const response = await fetch(
        '/api/v1/kurung/lifeLogs/lifeLogList?userUuid=' +
          userUuid +
          '&date=' +
          dateParam
      );
      if (!response.ok) throw new Error('서버 응답 오류');

      const data = await response.json();
      const logMap = {};
      data.forEach((log) => {
        const dateObj = new Date(log.lifelogDate);
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localDate = new Date(dateObj.getTime() - offset);
        const dateKey = localDate.toISOString().slice(0, 10);
        logMap[dateKey] = { emotion: log.emotion, id: log.lifelogId };
      });
      setLifeLogMap(logMap);
    } catch (err) {
      console.error('라이프로그 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchLifeLogs(viewDate.getFullYear(), viewDate.getMonth() + 1);
  }, [viewDate]);

  const handleDateClick = async (date) => {
    setValue(date);
    const offset = date.getTimezoneOffset() * 60000;
    const kstDate = new Date(date.getTime() - offset);
    const formatted = kstDate.toISOString().slice(0, 10);
    const log = lifeLogMap[formatted];

    if (log && log.id) {
      try {
        const response = await fetch(`/api/v1/kurung/lifeLogs/${log.id}`);
        if (!response.ok) throw new Error('상세 조회 실패');
        const data = await response.json();
        setSelectedLog(data);
        setNoData(false);
      } catch (err) {
        console.error('상세 로그 조회 실패:', err);
        setSelectedLog(null);
        setNoData(true);
      }
    } else {
      setSelectedLog(null);
      setNoData(true);
    }
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      const dateKey = localDate.toISOString().slice(0, 10);
      const entry = lifeLogMap[dateKey];
      const emotion = entry?.emotion;

      return (
        <div className="calendar-day-wrapper">
          {/* 감정 이미지 (없어도 공간 유지) */}
          <div className="calendar-icon-wrapper">
            {emotion ? (
              <img
                src={emotionIcons[emotion]}
                alt={emotion}
                className="calendar-emotion-icon"
              />
            ) : (
              <div className="calendar-emotion-placeholder" />
            )}
          </div>

          {/* 날짜 숫자 */}
          <div className="calendar-date-number">{date.getDate()}</div>
        </div>
      );
    }
    return null;
  };

  const formatDate = (date) => {
    return `${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  return (
    <div className="life-log-page">
      <h2 className="life-log-title">Life Log</h2>
      <div className="button-top">
        <button
          className="select report-button"
          type="button"
          // onClick={() => (window.location.href = '/createLifeLog')}
        >
          월간 리포트 조회
        </button>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          value={null}
          activeStartDate={viewDate}
          onClickDay={handleDateClick}
          onActiveStartDateChange={handleMonthChange}
          prevLabel="〈"
          nextLabel="〉"
          locale="ko-KR"
          formatShortWeekday={(locale, date) =>
            ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
          }
          formatDay={(locale, date) => date.getDate()}
          tileContent={tileContent}
          showNeighboringMonth={false}
          tileDisabled={({ date, view }) => {
            if (view !== 'month') return false;

            const thisMonth = viewDate.getMonth();
            const thisYear = viewDate.getFullYear();
            return (
              date.getMonth() !== thisMonth || date.getFullYear() !== thisYear
            );
          }}
        />
      </div>

      {selectedLog && (
        <div className="get-life-log-container">
          <h2>{formatDate(value)} 기록</h2>

          <label>Emotional Status</label>
          <div className="button-group read-only">
            {[
              '행복함',
              '평온함',
              '피곤함',
              '슬픔',
              '화남',
              '불안함',
              '신남',
              '우울함',
            ].map((emotion) => (
              <button
                key={emotion}
                className={
                  selectedLog.emotion === emotion
                    ? 'selected read-only'
                    : 'read-only'
                }
                disabled
              >
                {emotion}
              </button>
            ))}
          </div>

          <label>Emotional write</label>
          <p className="readonly-field">{selectedLog.emotionWrite || '없음'}</p>

          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Bed Time</label>
              <p className="readonly-field">
                {formatDateTime(selectedLog.bedTime)}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <label>Wake Up Time</label>
              <p className="readonly-field">
                {formatDateTime(selectedLog.wakeupTime)}
              </p>
            </div>
          </div>

          <label>Activity</label>
          <div className="button-group read-only">
            {['매우 활동적', '활동적', '가벼운 운동', '거의 활동 없음'].map(
              (act) => (
                <button
                  key={act}
                  className={
                    selectedLog.activity === act
                      ? 'selected read-only'
                      : 'read-only'
                  }
                  disabled
                >
                  {act}
                </button>
              )
            )}
          </div>

          <label>Summary</label>
          <p className="readonly-field">{selectedLog.memo || '없음'}</p>
          <div className="button-medule">
            <button
              className="update-button"
              type="button"
              onClick={() =>
                (window.location.href = `/updateLifeLog?lifelogId=${selectedLog.lifelogId}`)
              }
            >
              수정
            </button>
            <button
              className="delete-button"
              type="button"
              onClick={async () => {
                if (window.confirm('정말 삭제하시겠습니까?')) {
                  try {
                    const response = await fetch(
                      `/api/v1/kurung/lifeLogs/${selectedLog.lifelogId}`,
                      {
                        method: 'DELETE',
                      }
                    );
                    if (!response.ok) throw new Error('삭제 실패');

                    alert('삭제되었습니다.');
                    setSelectedLog(null);
                    setNoData(true);
                    fetchLifeLogs(
                      viewDate.getFullYear(),
                      viewDate.getMonth() + 1
                    );
                  } catch (err) {
                    console.error('삭제 오류:', err);
                    alert('삭제 중 오류가 발생했습니다.');
                  }
                }
              }}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {noData && (
        <div className="get-life-log-container">
          <div className="button-bottom">
            <button
              className="cancel"
              type="button"
              onClick={() => (window.location.href = '/createLifeLog')}
            >
              작성하기
            </button>
          </div>

          <h2>{formatDate(value)} 기록</h2>

          <p className="readonly-field empty-message">
            내용이 없습니다.
            <br />
            오늘의 로그를 작성해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default LifeLogCalendar;
