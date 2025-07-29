import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/axios';
import dayjs from 'dayjs';
import '../../styles/exercise/exerciseRecode.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const weekLabels = ['1주차', '2주차', '3주차', '4주차'];

function formatMinutesToHourMin(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

// 개선된 일일 메시지 생성 함수
function generateDailyMessage(dailyInfo) {
  if (!dailyInfo) return {
    title: "오늘도 화이팅! 💪",
    subtitle: "운동은 건강한 삶의 시작입니다.",
    detail: "오늘 하루도 파이팅!",
    routine: "작은 실천이 큰 변화를 만들어요! 🌟"
  };

  const { totalDuration, totalKcal, routineCount, exerciseList } = dailyInfo;
  
  // 운동 강도 분석
  const highIntensityCount = exerciseList?.filter(ex => ex.intensity === '고강도').length || 0;
  const mediumIntensityCount = exerciseList?.filter(ex => ex.intensity === '중강도').length || 0;
  const lowIntensityCount = exerciseList?.filter(ex => ex.intensity === '저강도').length || 0;
  
  // 운동 종류 분석
  const cardioCount = exerciseList?.filter(ex => 
    ex.exercise?.exerciseCategory === '유산소' || 
    ex.exercise?.effect === '유산소'
  ).length || 0;
  const strengthCount = exerciseList?.filter(ex => 
    ex.exercise?.exerciseCategory === '근력' || 
    ex.exercise?.effect === '근력'
  ).length || 0;
  
  // 제목 생성
  let title = "오늘의 운동 완료! 🏃‍♂️";
  if (totalDuration >= 90) {
    title = "정말 대단해요! 오늘도 최고! 🎉";
  } else if (totalDuration >= 60) {
    title = "오늘도 정말 대단해요! ⚡";
  } else if (totalDuration >= 30) {
    title = "오늘도 화이팅! 💪";
  } else if (totalDuration > 0) {
    title = "오늘도 수고하셨어요! 🌟";
  } else {
    title = "오늘은 휴식의 날! 😌";
  }
  
  // 부제목 생성 (시간 기반)
  let subtitle = "";
  if (totalDuration >= 90) {
    subtitle = "1시간 30분 이상! 정말 열심히 하셨네요!";
  } else if (totalDuration >= 60) {
    subtitle = "1시간 이상 운동하셨네요! 대단합니다!";
  } else if (totalDuration >= 45) {
    subtitle = "45분 이상 꾸준히 운동하셨네요!";
  } else if (totalDuration >= 30) {
    subtitle = "30분 이상 운동하셨네요! 훌륭해요!";
  } else if (totalDuration >= 15) {
    subtitle = "15분 이상 운동하셨네요! 좋아요!";
  } else if (totalDuration > 0) {
    subtitle = "오늘도 운동하셨네요! 시작이 반이에요!";
  } else {
    subtitle = "오늘은 휴식을 취하셨네요. 내일 더 힘내세요!";
  }
  
  // 상세 메시지 생성 (칼로리 + 운동 종류)
  let detail = "";
  if (totalKcal >= 800) {
    detail = `${totalKcal}kcal 소모! 정말 열심히 운동하셨네요! 🔥`;
  } else if (totalKcal >= 500) {
    detail = `${totalKcal}kcal 소모! 대단한 성과예요! ⚡`;
  } else if (totalKcal >= 300) {
    detail = `${totalKcal}kcal 소모! 꾸준함이 최고의 운동이에요! 💪`;
  } else if (totalKcal >= 100) {
    detail = `${totalKcal}kcal 소모! 작은 실천이 큰 변화를 만들어요! 🌟`;
  } else if (totalKcal > 0) {
    detail = `${totalKcal}kcal 소모! 오늘도 수고하셨어요! 😊`;
  } else {
    detail = "오늘은 휴식을 취하셨네요. 내일 더 힘내세요! 💪";
  }
  
  // 운동 종류별 추가 메시지
  if (cardioCount > 0 && strengthCount > 0) {
    detail += " 유산소와 근력운동을 균형있게 하셨네요!";
  } else if (cardioCount > 0) {
    detail += " 유산소운동으로 심폐지구력을 키우고 계시네요!";
  } else if (strengthCount > 0) {
    detail += " 근력운동으로 근육을 키우고 계시네요!";
  }
  
  // 루틴 조언 생성 (운동 횟수 + 강도)
  let routine = "";
  if (routineCount >= 6) {
    routine = `${routineCount}개의 운동을 완료하셨네요! 정말 대단합니다! 🏆`;
  } else if (routineCount >= 4) {
    routine = `${routineCount}개의 운동을 해내셨네요! 꾸준함이 최고예요! 🌟`;
  } else if (routineCount >= 2) {
    routine = `${routineCount}개의 운동을 완료하셨네요! 시작이 반이에요! 💪`;
  } else if (routineCount > 0) {
    routine = `${routineCount}개의 운동을 하셨네요! 오늘도 수고하셨어요! 😊`;
  } else {
    routine = "오늘은 휴식의 날이었나요? 내일은 함께 운동해요! 💪";
  }
  
  // 강도별 추가 조언
  if (highIntensityCount > 0) {
    routine += " 고강도 운동도 잘 해내고 계시네요! 더 강해지고 있어요! 🔥";
  } else if (mediumIntensityCount > 0) {
    routine += " 중강도 운동으로 균형잡힌 체력 향상을 하고 계시네요! ⚖️";
  } else if (lowIntensityCount > 0) {
    routine += " 저강도 운동으로 부상 없이 꾸준히 하고 계시네요! 🛡️";
  }

  return {
    title,
    subtitle,
    detail,
    routine
  };
}

// 개선된 월간 메시지 생성 함수
function generateMonthlyMessage(monthlyStats) {
  if (!monthlyStats) return {
    title: "한 달간의 기록 📊",
    subtitle: "꾸준함이 최고의 운동이에요!",
    detail: "새로운 한 달을 시작해보세요!",
    calorie: "작은 실천이 큰 변화를 만들어요! 🌟",
    pattern: "꾸준함의 힘을 믿어보세요! 💪"
  };

  const { totalDuration, totalKcal, routineCount, goalAchievementRate, weeklyRoutineCounts, weeklyDurations } = monthlyStats;
  
  // 주차별 운동 패턴 분석
  const activeWeeks = weeklyRoutineCounts?.filter(count => count > 0).length || 0;
  const totalWeeks = weeklyRoutineCounts?.length || 4;
  const consistencyRate = (activeWeeks / totalWeeks) * 100;
  
  // 평균 주간 운동 시간
  const avgWeeklyDuration = totalDuration / totalWeeks;
  
  // 제목 생성 (목표 달성률 기반)
  let title = "한 달간의 달성 기록 📊";
  if (goalAchievementRate >= 100) {
    title = "목표 100% 달성! 정말 대단해요! 🏆";
  } else if (goalAchievementRate >= 90) {
    title = "목표 90% 이상 달성! 거의 완벽해요! 🎯";
  } else if (goalAchievementRate >= 80) {
    title = "목표 80% 이상 달성! 훌륭해요! ⭐";
  } else if (goalAchievementRate >= 60) {
    title = "목표 60% 이상 달성! 잘 하고 있어요! 💪";
  } else if (goalAchievementRate > 0) {
    title = "목표 달성 중! 꾸준히 해보세요! 🌟";
  } else {
    title = "새로운 시작! 이번 달엔 더 잘해보세요! 🚀";
  }
  
  // 부제목 생성 (목표 달성률)
  let subtitle = "";
  if (goalAchievementRate >= 100) {
    subtitle = "목표를 100% 달성하셨네요! 정말 대단합니다!";
  } else if (goalAchievementRate >= 80) {
    subtitle = `목표의 ${goalAchievementRate}%를 달성하셨네요! 거의 다 왔어요!`;
  } else if (goalAchievementRate >= 60) {
    subtitle = `목표의 ${goalAchievementRate}%를 달성하셨네요! 꾸준히 잘 하고 있어요!`;
  } else if (goalAchievementRate >= 40) {
    subtitle = `목표의 ${goalAchievementRate}%를 달성하셨네요! 절반을 넘어섰어요!`;
  } else if (goalAchievementRate > 0) {
    subtitle = `목표의 ${goalAchievementRate}%를 달성하셨네요! 다음 달엔 더 잘할 수 있어요!`;
  } else {
    subtitle = "새로운 시작을 위한 준비가 되었어요! 이번 달엔 목표를 세워보세요!";
  }
  
  // 상세 메시지 생성 (총 운동 시간)
  let detail = "";
  if (totalDuration >= 3600) { // 60시간 이상
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 정말 열심히 하셨습니다! 🔥`;
  } else if (totalDuration >= 2400) { // 40시간 이상
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 대단한 한 달이었어요! ⚡`;
  } else if (totalDuration >= 1800) { // 30시간 이상
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 훌륭한 성과예요! 💪`;
  } else if (totalDuration >= 1200) { // 20시간 이상
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 꾸준함이 최고예요! 🌟`;
  } else if (totalDuration >= 600) { // 10시간 이상
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 시작이 반이에요! 😊`;
  } else if (totalDuration > 0) {
    detail = `${formatMinutesToHourMin(totalDuration)} 운동하셨네요! 작은 실천이 큰 변화를 만들어요! 💪`;
  } else {
    detail = "새로운 한 달의 시작을 준비해요! 이번 달엔 운동을 시작해보세요! 🚀";
  }
  
  // 칼로리 메시지 생성
  let calorie = "";
  if (totalKcal >= 20000) {
    calorie = `${totalKcal}kcal 소모! 정말 대단한 한 달이었어요! 🔥`;
  } else if (totalKcal >= 15000) {
    calorie = `${totalKcal}kcal 소모! 훌륭한 성과를 거두셨네요! ⚡`;
  } else if (totalKcal >= 10000) {
    calorie = `${totalKcal}kcal 소모! 대단한 한 달이었어요! 💪`;
  } else if (totalKcal >= 5000) {
    calorie = `${totalKcal}kcal 소모! 꾸준함이 최고의 운동이에요! 🌟`;
  } else if (totalKcal >= 2000) {
    calorie = `${totalKcal}kcal 소모! 작은 실천이 큰 변화를 만들어요! 😊`;
  } else if (totalKcal > 0) {
    calorie = `${totalKcal}kcal 소모! 오늘도 수고하셨어요! 💪`;
  } else {
    calorie = "새로운 시작을 위한 준비가 되었어요! 이번 달엔 칼로리도 소모해보세요! 🚀";
  }
  
  // 운동 패턴 분석 메시지
  let pattern = "";
  if (consistencyRate >= 100) {
    pattern = "매주 꾸준히 운동하고 계시네요! 정말 인상적입니다! 🏆";
  } else if (consistencyRate >= 75) {
    pattern = "3주 이상 꾸준히 운동하고 계시네요! 훌륭한 습관이에요! ⭐";
  } else if (consistencyRate >= 50) {
    pattern = "절반 이상의 주에 운동하고 계시네요! 좋은 습관을 만들어가고 있어요! 💪";
  } else if (consistencyRate >= 25) {
    pattern = "일부 주에 운동하고 계시네요! 더 꾸준히 해보세요! 🌟";
  } else if (consistencyRate > 0) {
    pattern = "운동을 시작하셨네요! 더 자주 해보세요! 😊";
  } else {
    pattern = "새로운 시작을 위한 준비가 되었어요! 이번 달엔 운동을 시작해보세요! 🚀";
  }
  
  // 평균 주간 운동 시간 추가 정보
  if (avgWeeklyDuration >= 300) { // 주 5시간 이상
    pattern += " 주 평균 5시간 이상 운동하고 계시네요! 정말 대단해요! 🔥";
  } else if (avgWeeklyDuration >= 180) { // 주 3시간 이상
    pattern += " 주 평균 3시간 이상 운동하고 계시네요! 훌륭해요! ⚡";
  } else if (avgWeeklyDuration >= 120) { // 주 2시간 이상
    pattern += " 주 평균 2시간 이상 운동하고 계시네요! 꾸준함이 최고예요! 💪";
  }

  return {
    title,
    subtitle,
    detail,
    calorie,
    pattern
  };
}

// [수정] 테스트를 위해 today를 2025-05-31으로 강제 세팅
const today = dayjs('2025-06-30');
const dateList = Array.from({ length: 30 }).map((_, i) =>
  today.subtract(i, 'day').format('YYYY-MM-DD')
);
const month = dayjs('2025-12-31');
const monthList = Array.from({ length: 12 }).map((_, i) =>
  month.subtract(i, 'month').format('YYYY-MM')
);

// 백엔드에서 날짜 포맷이 YY/MM/DD이면 아래 함수 사용
// const formatForBackend = date => dayjs(date).format('YY/MM/DD');

function ExerciseRecode() {
  // accessToken에서 userUuid 추출 (JWT 전용) - exerciseLogCheck.js 참고
  const getUserUuidFromToken = () => {
    try {
      // localStorage에서 실제 로그인된 사용자의 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('accessToken이 localStorage에 없습니다.');
        return null;
      }

      if (accessToken && accessToken.split('.').length === 3) {
        // JWT payload 추출 (Base64 디코딩)
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        console.log('토큰에서 추출한 사용자 정보:', payload);
        return payload.userUuid;
      }
    } catch (e) {
      console.error('토큰에서 userUuid 추출 실패:', e);
    }
    return null;
  };

  // 토큰 자동 검증 및 리다이렉트 - exerciseLogCheck.js 참고
  const checkAndRedirectIfNeeded = () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      window.location.href = '/loginpage';
      return false;
    }
    
    return true;
  };

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

    // 1. 토큰 자동 검증
    if (!checkAndRedirectIfNeeded()) {
      setLoading(false);
      return;
    }

    // 2. 로그인 사용자의 userUuid 동적 추출
    const userUuid = getUserUuidFromToken();
    if (!userUuid) {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      setLoading(false);
      return;
    }



    if (tab === 'daily') {
      apiClient.get(`/exercise/summary/daily`, {
        params: { date: selectedDate }
      })
        .then(res => {
          setDailyInfo(res.data);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = '/loginpage';
          } else {
            setError('일일 운동 데이터를 불러오지 못했습니다.');
          }
        })
        .finally(() => setLoading(false));
    } else {
      apiClient.get(`/exercise/summary/monthly`, { 
        params: { month: selectedMonth }
      })
        .then(res => {
          setMonthlyStats(res.data);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = '/loginpage';
          } else if (error.response?.status === 500) {
            // 500 에러 시 빈 데이터로 처리
            setMonthlyStats({
              totalDuration: 0,
              totalKcal: 0,
              routineCount: 0,
              goalAchievementRate: 0,
              weeklyRoutineCounts: [0, 0, 0, 0],
              weeklyDurations: [0, 0, 0, 0],
              weeklyKcals: [0, 0, 0, 0]
            });
          } else {
            setError('월간 통계 데이터를 불러오지 못했습니다.');
          }
        })
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
            {(() => {
              const message = generateDailyMessage(dailyInfo);
              return (
                <>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '8px' }}>{message.title}</p>
                  <p>{message.subtitle}</p>
                  {message.detail && <p>{message.detail}</p>}
                  {message.routine && <p>{message.routine}</p>}
                </>
              );
            })()}
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
            {(() => {
              const message = generateMonthlyMessage(monthlyStats);
              return (
                <>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '8px' }}>{message.title}</p>
                  <p>{message.subtitle}</p>
                  {message.detail && <p>{message.detail}</p>}
                  {message.calorie && <p>{message.calorie}</p>}
                </>
              );
            })()}
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