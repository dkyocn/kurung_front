import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main/main.css';
import axios from '../../utils/axios';
import aiAxios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    dietRecommendation: { kcal: 0, targetKcal: 1900 },
    exerciseRecommendation: { name: '', duration: '', level: '' },
    todayWeight: { weight: 0, bmi: 0, bmiStatus: '' },
    dietLog: { message: '', suggestion: '' },
    goalProgress: 0,
    lifeLog: { message: '' },
    healthReport: { achievementRate: 0, dietScore: 0, exerciseHours: 0 },
    todayMission: {
      steps: { target: 10000, current: 0 },
      lifeLog: false,
      stressScript: false,
    },
  });

  // accessToken에서 userUuid 추출 (JWT 전용)
  const getUserUuidFromToken = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return null;
      }

      if (accessToken && accessToken.split('.').length === 3) {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        return payload.userUuid;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const aiApi = aiAxios.create({
    baseURL: 'http://localhost:8000',
  });

  // 현재 날짜를 YYYY-MM-DD 형식으로 변환
  const getCurrentLocalDate = () => {
    const today = new Date();
    return today.toISOString().split('.')[0];
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 식단 추천 데이터 가져오기
  const fetchDietRecommendation = async () => {
    try {
      const response = await axios.get(`${baseUrl}diet/today`, {
        params: { currentDate: getCurrentLocalDate() },
      });
      const data = response.data;
      if (data && data.nutrition) {
        setDashboardData((prev) => ({
          ...prev,
          dietRecommendation: {
            kcal: data.nutrition.kcal || 0,
            targetKcal: 2250,
          },
        }));
      }
    } catch (error) {
      console.error('식단 추천 데이터 불러오기 실패:', error);
    }
  };

  // 운동 추천 데이터 가져오기
  const fetchExerciseRecommendation = async () => {
    try {
      const response = await axios.get(`${baseUrl}exercise/routines/list`, {
        params: { date: getCurrentDate() },
      });
      const data = response.data;
      if (data && data.length > 0) {
        const firstRoutine = data[0];
        setDashboardData((prev) => ({
          ...prev,
          exerciseRecommendation: {
            name: firstRoutine.routineName || '전신 스트레칭 루틴',
            duration: firstRoutine.duration || '20분',
            level: firstRoutine.level || '초급',
          },
        }));
      }
    } catch (error) {
      console.error('운동 추천 데이터 불러오기 실패:', error);
    }
  };

  // 오늘의 체중 데이터 가져오기
  const fetchTodayWeight = async () => {
    try {
      const response = await axios.get(`${baseUrl}healthinfo/list`, {
        params: { currentDate: getCurrentLocalDate() },
      });
      const data = response.data;
      if (data && data.length > 0) {
        const latestWeight = data[data.length - 1];
        const bmi =
          latestWeight.weight / Math.pow(latestWeight.height / 100, 2);
        let bmiStatus = '';
        if (bmi < 18.5) bmiStatus = '저체중';
        else if (bmi < 25) bmiStatus = '정상';
        else if (bmi < 30) bmiStatus = '과체중';
        else bmiStatus = '중증도 비만';

        setDashboardData((prev) => ({
          ...prev,
          todayWeight: {
            weight: latestWeight.weight,
            bmi: bmi.toFixed(1),
            bmiStatus,
          },
        }));
      }
    } catch (error) {
      console.error('체중 데이터 불러오기 실패:', error);
    }
  };

  // 라이프로그 데이터 가져오기
  const fetchLifeLog = async () => {
    try {
      const response = await axios.get(`${baseUrl}lifeLogs/lifeLogList`, {
        params: { date: getCurrentDate().toString() },
      });
      const data = response.data;
      if (data && data.length > 0) {
        setDashboardData((prev) => ({
          ...prev,
          lifeLog: { message: '오늘 하루를 기록해 보세요.' },
        }));
      } else {
        setDashboardData((prev) => ({
          ...prev,
          lifeLog: { message: '잠깐! 오늘 하루는 어떠셨나요?' },
        }));
      }
    } catch (error) {
      console.error('라이프로그 데이터 불러오기 실패:', error);
    }
  };

  // 건강리포트 데이터 가져오기
  const fetchHealthReport = async () => {
    try {
      const response = await axios.get(`${baseUrl}healthReport/report`, {
        params: { reportMonth: getCurrentLocalDate() },
      });
      const data = response.data;
      if (data) {
        setDashboardData((prev) => ({
          ...prev,
          healthReport: {
            achievementRate: data.achievementRate || 70,
            dietScore: data.dietScore || 68,
            exerciseHours: data.exerciseHours || 59,
          },
        }));
      }
    } catch (error) {
      console.error('건강리포트 데이터 불러오기 실패:', error);
    }
  };

  // 오늘의 미션 데이터 가져오기
  const fetchTodayMission = async () => {
    try {
      const response = await axios.get(`${baseUrl}mission`, {
        params: { currentDate: getCurrentDate() },
      });
      const data = response.data;
      if (data) {
        setDashboardData((prev) => ({
          ...prev,
          todayMission: {
            steps: { target: 10000, current: data.steps || 6320 },
            lifeLog: data.lifeLog || false,
            stressScript: data.stressScript || false,
          },
        }));
      }
    } catch (error) {
      console.error('미션 데이터 불러오기 실패:', error);
    }
  };

  // 모든 데이터 가져오기
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDietRecommendation(),
        fetchExerciseRecommendation(),
        fetchTodayWeight(),
        fetchLifeLog(),
        fetchHealthReport(),
        fetchTodayMission(),
      ]);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
              {dashboardData.dietRecommendation.kcal}/
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
              <div>비타민 K가 부족해요.</div>
              <div>녹색잎 채소를 드셔보세요!</div>
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
            </div>
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
              <span>오늘의 라이프로그 작성하기</span>
              <button
                className="missionButton"
                onClick={() => navigate('/lifeLog')}
              >
                미션 시작
              </button>
            </div>
            <div className="missionItem">
              <span>스트레스 중을 위한 스크립트 연습</span>
              <button className="missionButton">미션 시작</button>
            </div>
          </div>
        </div>

        {/* 비니 */}
        <div className="dashboardCard">
          <h3 className="cardTitle">비니</h3>
          <div className="cardContent">
            <div className="biniIcon">🦕</div>
            <div className="biniMessage">비니와 얘기해요!</div>
            <button className="chatButton" onClick={() => navigate('/chatbot')}>
              채팅하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
