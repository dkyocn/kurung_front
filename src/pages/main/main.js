import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main/main.css';
import biniIcon from '../../assets/bini.png';

const MainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    dietRecommendation: { kcal: 1900, targetKcal: 1900 },
    exerciseRecommendation: {
      name: '전신 스트레칭 루틴',
      duration: '20분',
      level: '초급',
      location: '집',
    },
    todayWeight: { weight: 60, bmi: 30, bmiStatus: '중증도 비만' },
    dietLog: {
      message: '비타민 K가 부족해요.',
      suggestion: '녹색잎 채소를 드셔보세요!',
    },
    goalProgress: 60,
    lifeLog: { message: '잠깐! 오늘 하루는 어떠셨나요?' },
    healthReport: { achievementRate: 70, dietScore: 68, exerciseHours: 59 },
    todayMission: {
      steps: { target: 10000, current: 6320 },
      lifeLog: false,
      stressScript: false,
    },
  });

  useEffect(() => {
    // 로딩 시뮬레이션
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="mainPage">
      <div className="dashboardGrid">
        {/* 식단 추천 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">식단 추천</h3>
          <div className="cardContent">
            <div className="kcalDisplay">
              {dashboardData.dietRecommendation.kcal} /{' '}
              {dashboardData.dietRecommendation.targetKcal} kcal
            </div>
            <div className="kcalLabel">오늘의 추천 섭취량</div>
          </div>
        </div>

        {/* 운동 추천 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">운동 추천</h3>
          <div className="cardContent">
            <div className="exerciseInfo">
              <div className="exerciseName">
                {dashboardData.exerciseRecommendation.name}
              </div>
              <div className="exerciseDetails">
                <span className="exerciseIcon">🧘</span>
                {dashboardData.exerciseRecommendation.duration} |{' '}
                {dashboardData.exerciseRecommendation.location} |{' '}
                {dashboardData.exerciseRecommendation.level}
              </div>
            </div>
            <button
              className="startButton"
              onClick={() => navigate('/exercise')}
            >
              운동 시작
            </button>
          </div>
        </div>

        {/* 오늘의 체중 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">오늘의 체중</h3>
          <div className="cardContent">
            <div className="weightInfo">
              <div>체중 {dashboardData.todayWeight.weight}kg</div>
              <div>
                BMI {dashboardData.todayWeight.bmi}{' '}
                {dashboardData.todayWeight.bmiStatus}
              </div>
            </div>
          </div>
        </div>

        {/* 영양소 분석 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">영양소 분석</h3>
          <div className="cardContent">
            <div className="broccoliIcon">🥦</div>
            <div className="dietMessage">
              <div>{dashboardData.dietLog.message}</div>
              <div>{dashboardData.dietLog.suggestion}</div>
            </div>
          </div>
        </div>

        {/* 목표 달성 진행률 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">목표 달성 진행률</h3>
          <div className="cardContent">
            <div className="progressRate">{dashboardData.goalProgress}%</div>
          </div>
        </div>

        {/* 라이프로그 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">라이프로그</h3>
          <div className="cardContent">
            <div className="lifeLogMessage">
              <div>{dashboardData.lifeLog.message}</div>
              <div>오늘 하루를 기록해 보세요.</div>
            </div>
            <button
              className="startButton"
              onClick={() => navigate('/lifeLog')}
            >
              기록 시작
            </button>
          </div>
        </div>

        {/* 건강리포트 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">건강리포트 (5월)</h3>
          <div className="cardContent">
            <div className="healthReportInfo">
              <div>
                목표 달성률 {dashboardData.healthReport.achievementRate}%
              </div>
              <div>식단 점수 {dashboardData.healthReport.dietScore}점</div>
              <div>운동량 {dashboardData.healthReport.exerciseHours}h</div>
            </div>
          </div>
        </div>

        {/* 오늘의 미션 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">오늘의 미션</h3>
          <div className="cardContent">
            <div className="missionItem">
              <span>10000보 걷기</span>
              <span>{dashboardData.todayMission.steps.current}보</span>
            </div>
            <div className="missionItem">
              <span>스트레스 중을 위한 스크리프트 연습</span>
              <button className="missionButton">미션 시작</button>
            </div>
          </div>
        </div>

        {/* 비니 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">비니</h3>
          <div className="cardContent">
            <img src={biniIcon} alt="비니" className="biniIcon" />
            <div className="biniMessage">비니와 얘기해요!</div>
            <button className="chatButton" onClick={() => navigate('/chatbot')}>
              채팅 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
