import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import '../../styles/exercise/exerciseRecode.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const USER_UUID = '2025061401';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const weekLabels = ['1주차', '2주차', '3주차', '4주차'];

function formatMinutesToHourMin(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

// [수정] 테스트를 위해 today를 2025-06-30으로 강제 세팅
const today = dayjs('2025-06-30');
const dateList = Array.from({ length: 30 }).map((_, i) =>
  today.subtract(i, 'day').format('YYYY-MM-DD')
);
const monthList = Array.from({ length: 12 }).map((_, i) =>
  today.subtract(i, 'month').format('YYYY-MM')
);

// 백엔드에서 날짜 포맷이 YY/MM/DD이면 아래 함수 사용
// const formatForBackend = date => dayjs(date).format('YY/MM/DD');

function ExerciseRecode() {
  const [tab, setTab] = useState('daily');
  const [dailyInfo, setDailyInfo] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState(dateList[0]);
  const [selectedMonth, setSelectedMonth] = useState(monthList[0]);

  useEffect(() => {
    setLoading(true);
    setError('');
    if (tab === 'daily') {
      axios.get(`/api/v1/kurung/exercise/summary/daily/${USER_UUID}`, {
        params: { date: selectedDate }
        })
            .then(res => {
          setDailyInfo(res.data);
          console.log('dailyInfo:', res.data);
        })
        .catch(() => setError('일일 운동 데이터를 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    } else {
      axios
        .get(`/api/v1/kurung/exercise/summary/monthly/${USER_UUID}`, { params: { month: selectedMonth } })
        .then(res => setMonthlyStats(res.data))
        .catch(() => setError('월간 통계 데이터를 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [tab, selectedDate, selectedMonth]);

  const weekPieData = (dataArr, type = '회') =>
    weekLabels.map((name, idx) => ({ name, value: dataArr ? dataArr[idx] : 0, type }));

  return (
    <div className="exercise-recode-page">
      <div className="tab-background"></div>
      <div className="tab-container">
        <div className={`tab-slider ${tab}`}></div>
        <button className={`tab${tab === 'daily' ? ' active' : ''}`} onClick={() => setTab('daily')}>daily exercise</button>
        <button className={`tab${tab === 'monthly' ? ' active' : ''}`} onClick={() => setTab('monthly')}>Monthly Summary</button>
      </div>

      {loading && <div style={{ textAlign: 'center', margin: 20 }}>로딩 중...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', margin: 20 }}>{error}</div>}

      {/* Daily Tab */}
      {tab === 'daily' && (
        <div className="content active">
          <div className="message-box">
            <p>"인간적인 마음과 건강한 마음을 가진 것, 이것이 삶의 목적입니다!"</p>
            <p>"무엇보다 최고의 운동복은, 나만의 땀을 담아내는 것!"</p>
          </div>
          <h2>일일 운동 요약</h2>
          <p style={{ color: '#666', margin: '10px 0' }}>오늘의 운동 결과를 확인해보세요!</p>
          <div className="daily-info">
            {/* 날짜 선택 드롭다운 */}
            <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
              {dateList.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            {dailyInfo && (
              <>
                <p>총 운동 시간: {formatMinutesToHourMin(dailyInfo.totalDuration)}</p>
                <p>총 소모 칼로리: {dailyInfo.totalKcal} kcal</p>
                <p>운동 횟수: {dailyInfo.routineCount}회</p>
              </>
            )}
          </div>
          <h3>오늘 운동 목록</h3>
          <table className="exercise-table">
            <thead>
              <tr>
                <th>운동명</th>
                <th>시간</th>
                <th>강도</th>
                <th>효과</th>
              </tr>
            </thead>
            <tbody>
              {dailyInfo && dailyInfo.exerciseList && dailyInfo.exerciseList.length > 0 ? (
                dailyInfo.exerciseList.map((ex, i) => (
                  <tr key={i}>
                    {/* 백엔드 exercise 객체 필드에 맞게 수정하세요 */}
                    <td>{ex.exercise?.exerciseName || ex.exercise?.name || '-'}</td>
                    <td>{ex.duration ? `${ex.duration}분` : '-'}</td>
                    <td>{ex.intensity || '-'}</td>
                    <td>{ex.exercise?.exerciseCategory || ex.exercise?.effect || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 12 }}>
                    운동 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly Tab */}
      {tab === 'monthly' && (
        <div className="content active">
          <div className="monthly-summary">
            <h2>누적 통계 및 목표 현황</h2>
            <div className="stats-container">
              <div className="stat-item">
                <h3>총 운동 시간</h3>
                <p>{monthlyStats ? formatMinutesToHourMin(monthlyStats.totalDuration) : '0분'}</p>
              </div>
              <div className="stat-item">
                <h3>총 소모 칼로리</h3>
                <p>{monthlyStats ? monthlyStats.totalKcal : 0} kcal</p>
              </div>
              <div className="stat-item">
                <h3>총 루틴 횟수</h3>
                <p>{monthlyStats ? monthlyStats.routineCount : 0}회</p>
              </div>
              <div className="stat-item">
                <h3>목표 달성률</h3>
                <p>{monthlyStats ? monthlyStats.goalAchievementRate : 0}%</p>
              </div>
            </div>
          </div>
          <div className="message-box">
            <p>한 달간의 달성한!</p>
            <p>"규칙적 운동이 자유로워진다! 이번 달도 정말 잘 해내셨어요."</p>
            <p>"상쾌한 조직되어 달성한 누적에서 나왔네요. 다음 달도 화이팅!"</p>
          </div>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ margin: '10px 0' }}>
            {monthList.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <div className="chart-container" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {monthlyStats && (
              <>
                {/* 운동 횟수 도넛차트 */}
                <div style={{ width: 350, textAlign: 'center' }}>
                  <PieChart width={350} height={300}>
                    <Pie
                      data={weekPieData(monthlyStats.weeklyRoutineCounts, '회')}
                      cx="50%"
                      cy="50%"
                      startAngle={450}
                      endAngle={90}
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {weekPieData(monthlyStats.weeklyRoutineCounts, '회').map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => <span style={{ color: 'black' }}>{value}</span>} />
                  </PieChart>
                  <div style={{ marginTop: 12, fontWeight: 600 }}>주차별 운동 횟수</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{monthlyStats.weeklyRoutineCounts.map((v, i) => `${weekLabels[i]}: ${v}회`).join(' / ')}</div>
                </div>
                {/* 운동 시간 도넛차트 */}
                <div style={{ width: 350, textAlign: 'center' }}>
                  <PieChart width={350} height={300}>
                    <Pie
                      data={weekPieData(monthlyStats.weeklyDurations, '분')}
                      cx="50%"
                      cy="50%"
                      startAngle={450}
                      endAngle={90}
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {weekPieData(monthlyStats.weeklyDurations, '분').map((entry, idx) => (
                        <Cell key={`cell2-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => <span style={{ color: 'black' }}>{value}</span>} />
                  </PieChart>
                  <div style={{ marginTop: 12, fontWeight: 600 }}>주차별 운동 시간</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{monthlyStats.weeklyDurations.map((v, i) => `${weekLabels[i]}: ${v}분`).join(' / ')}</div>
                </div>
                {/* 소모 칼로리 도넛차트 */}
                <div style={{ width: 350, textAlign: 'center' }}>
                  <PieChart width={350} height={300}>
                    <Pie
                      data={weekPieData(monthlyStats.weeklyKcals, 'kcal')}
                      cx="50%"
                      cy="50%"
                      startAngle={450}
                      endAngle={90}
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {weekPieData(monthlyStats.weeklyKcals, 'kcal').map((entry, idx) => (
                        <Cell key={`cell3-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => <span style={{ color: 'black' }}>{value}</span>} />
                  </PieChart>
                  <div style={{ marginTop: 12, fontWeight: 600 }}>주차별 소모 칼로리</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{monthlyStats.weeklyKcals.map((v, i) => `${weekLabels[i]}: ${v}kcal`).join(' / ')}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseRecode;