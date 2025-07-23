import React, { useEffect, useState, PureComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import emotionIcons from '../../images/lifeLog/emotionIcons';
import 'react-calendar/dist/Calendar.css';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import '../../styles/lifeLog/getMonthlyLifeLog.css';

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

const emotionOrder = [
  '행복함',
  '평온함',
  '피곤함',
  '슬픔',
  '화남',
  '불안함',
  '신남',
  '우울함',
];

const MonthlyLifeLogReport = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState(null);
  const [lifeLogMap, setLifeLogMap] = useState({});
  const navigate = useNavigate();
  const userUuid = '2025061401';
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchMonthlyReport = async (year, month) => {
    const dateParam = `${year}-${String(month).padStart(2, '0')}`;
    try {
      const response = await fetch(
        baseUrl + 'lifeLogs/monthly?userUuid=' + userUuid + '&date=' + dateParam
      );
      if (!response.ok) throw new Error('조회 실패');
      const data = await response.json();

      if (!data || Object.keys(data).length === 0 || !data.lifeLogList) {
        setLifeLogMap({});
        setMonthlyData(null);
        return;
      }
      console.log(data);
      const logMap = {};
      data.lifeLogList.forEach((log) => {
        const dateKey = new Date(log.lifelogDate).toISOString().slice(0, 10);
        logMap[dateKey] = { emotion: log.emotion };
      });

      setLifeLogMap(logMap);
      setMonthlyData(data);
    } catch (err) {
      console.error('월간 리포트 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchMonthlyReport(viewDate.getFullYear(), viewDate.getMonth() + 1);
  }, [viewDate]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toISOString().slice(0, 10);
      const emotion = lifeLogMap[dateKey]?.emotion;

      return (
        <div className="calendar-day-wrapper">
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
          <div className="calendar-date-number">{date.getDate()}</div>
        </div>
      );
    }
    return null;
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  const renderEmotionStats = () => {
    if (!monthlyData) return null;

    const countMap = {
      행복함: monthlyData.countHappy,
      평온함: monthlyData.countCalm,
      피곤함: monthlyData.countTired,
      슬픔: monthlyData.countSad,
      화남: monthlyData.countAngry,
      불안함: monthlyData.countAnxious,
      신남: monthlyData.countExcited,
      우울함: monthlyData.countDepressed,
    };

    const chartData = emotionOrder.map((emotion) => ({
      emotion,
      count: countMap[emotion],
    }));

    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="emotion" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#88c71f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="monthly-report-page">
      <h2 className="monthly-report-title">월간 리포트</h2>
      <div className="button-top-monthly">
        <button
          className="select lifeLog-button"
          type="button"
          onClick={() => navigate(`/getLifeLogList`)}
        >
          LifeLog 조회
        </button>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          value={null}
          activeStartDate={viewDate}
          onActiveStartDateChange={handleMonthChange}
          tileContent={tileContent}
          prevLabel="〈"
          nextLabel="〉"
          locale="ko-KR"
          formatShortWeekday={(locale, date) =>
            ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
          }
          showNeighboringMonth={false}
        />
      </div>

      {monthlyData && (
        <div className="report-summary">
          <h2>{monthlyData.month}월 요약</h2>

          <div className="monthly-boxes">
            <div className="monthly-item">
              <label>작성일 수</label>
              <p className="monthly-box">{monthlyData.countLifeLog}일</p>
            </div>
            <div className="monthly-item">
              <label>평균 수면 시간</label>
              <p className="monthly-box">{monthlyData.avgSleepTime}시간</p>
            </div>
          </div>

          <h4>감정 통계</h4>
          {renderEmotionStats()}

          <div className="summary-section">
            <label className="summary-title">Summary</label>
            <div className="summary-box">
              <p className="summary-content">
                {monthlyData.monthlySummary || '요약 없음'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyLifeLogReport;
