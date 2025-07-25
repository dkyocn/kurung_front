import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MissionCalendar = ({ title, data, year, month }) => {
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();

  const missionMap = data.reduce((acc, item) => {
    const day = dayjs(item.missionDate).date();
    acc[day] = item.isComplete;
    return acc;
  }, {});

  return (
    <div>
      <h4>{title}</h4>
      <div>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const complete = missionMap[day];

          return (
            <div key={day}>
              {day} {complete ? '(완료)' : '(미완료)'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function HealthReport() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [missions, setMissions] = useState({
    DIET: [],
    EXERCISE: [],
    STRESS: [],
    DAILY: [],
  });

  // API 호출 함수
  const fetchReport = async (year, month) => {
    setLoading(true);
    setError(null);
    try {
      const reportMonth = dayjs(`${year}-${month}-01`)
        .startOf('month')
        .format('YYYY-MM-DDTHH:mm:ss');
      const response = await axios.get(baseUrl + 'healthReport/report', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzMzQzODU0fQ.NBuxs9OqMYfJOfYHyPaU_0rQXKTLuvHcqeX4K1SPV5tiqcpIr5mz8qJKmWZM1PSq6JaQ6sKOzMk2Y4hi9xLM5g',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQyNjY1NH0.DqHLn4onGUdomGtKoGI966DsBPghtYd4IDeMtprxvFU_zRCOJXxJENuFdEP3D-wW6Cigr6GYS1AphiW9C2i0yQ',
        },
        params: {
          reportMonth,
        },
      });
      const data = response.data;
      setReport(data);
      console.log(data);
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async (currentDate, displayType) => {
    try {
      const response = await axios.get(baseUrl + 'missions/range', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzMzQzODU0fQ.NBuxs9OqMYfJOfYHyPaU_0rQXKTLuvHcqeX4K1SPV5tiqcpIr5mz8qJKmWZM1PSq6JaQ6sKOzMk2Y4hi9xLM5g',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQyNjY1NH0.DqHLn4onGUdomGtKoGI966DsBPghtYd4IDeMtprxvFU_zRCOJXxJENuFdEP3D-wW6Cigr6GYS1AphiW9C2i0yQ',
        },
        params: {
          currentDate,
          displayType,
        },
      });

      console.log(`[${displayType}]`, response.data);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch ${displayType} missions`, err);
      return [];
    }
  };

  useEffect(() => {
    fetchReport(year, month);
    const loadMissions = async () => {
      const currentDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD');
      const types = ['DIET', 'EXERCISE', 'STRESS', 'DAILY'];

      try {
        const missionResults = await Promise.all(
          types.map((type) => fetchMissions(currentDate, type))
        );

        const missionData = {};
        types.forEach((type, idx) => {
          missionData[type] = missionResults[idx];
        });

        setMissions(missionData);
      } catch (e) {
        console.error('미션 데이터 로딩 실패', e);
      }
    };

    loadMissions();
  }, [year, month]);

  // 월/년 선택 변경 핸들러
  const handleYearChange = (e) => setYear(Number(e.target.value));
  const handleMonthChange = (e) => setMonth(Number(e.target.value));

  const generateGraphData = (key) => {
    if (!report) return [];

    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const fullDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // healthInfo (몸무게, BMI)
    if (key === 'weight' || key === 'bmi') {
      return (report.healthInfo || [])
        .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        .map((item) => ({
          day: dayjs(item.createdAt).date(),
          value: item[key] ?? 0,
        }));
    }

    if (key === 'diet') {
      const raw = (report.dietScore || []).reduce((acc, item) => {
        const day = dayjs(item.dietDate).date();
        acc[day] = item.dietScore ?? 0;
        return acc;
      }, {});
      return fullDays.map((day) => ({
        day,
        value: raw[day] ?? 0,
      }));
    }

    if (key === 'exercise') {
      const raw = (report.monthlyExercisesTimes || []).reduce((acc, item) => {
        const day = dayjs(item.exerciseDate).date();
        acc[day] = item.duration ?? 0;
        return acc;
      }, {});
      return fullDays.map((day) => ({
        day,
        value: raw[day] ?? 0,
      }));
    }

    return [];
  };

  const getAverageDietScore = () => {
    const scores = report?.dietScore ?? [];
    if (scores.length === 0) return '-';
    const total = scores.reduce((sum, item) => sum + item.dietScore, 0);
    return Math.round(total / scores.length);
  };

  const getAverageExerciseTime = () => {
    const exercise = report?.duration ?? [];
    if (exercise.length === 0) return '-';
    const total = exercise.reduce((sum, item) => sum + item.duration, 0);
    return Math.round(total / exercise.length);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Health Overview</h2>
      <div style={{ marginBottom: 20 }}>
        날짜 선택:{' '}
        <select value={year} onChange={handleYearChange}>
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y} 년
            </option>
          ))}
        </select>
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m} 월
            </option>
          ))}
        </select>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && report && (
        <>
          {/* 점수 및 상태 */}
          <div
            style={{
              backgroundColor: '#f1f9f5',
              padding: '20px 30px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `conic-gradient(#7cc700 ${report.monthlyScore * 3.6}deg, #eee 0deg)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#555',
              }}
            >
              {report.monthlyScore}
            </div>
            <div style={{ flex: 1 }}>
              <h3>Your Health Score: Average</h3>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.4 }}>
                이번 달 사용자의 건강상태는 양호한 것으로 판단됩니다.
                <br />
                식단과 운동 목표 분석결과
                <br />
                이를 지키지 않을 시 발생할 수 있는 질병은 아래와 같습니다..
              </p>
            </div>
          </div>

          {/* 그래프 영역 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 30,
            }}
          >
            {/* 몸무게 */}
            <div
              style={{
                border: '1px solid #ddd',
                padding: 20,
                borderRadius: 8,
              }}
            >
              <h4>몸무게</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {report.weightChange ?? '-'}kg
              </div>
              <div style={{ fontSize: 12, color: 'red' }}>
                Last 1 Month {report.weightChange ?? '-'}kg
              </div>
              <div style={{ width: '100%', height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateGraphData('weight')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BMI */}
            <div
              style={{
                border: '1px solid #ddd',
                padding: 20,
                borderRadius: 8,
              }}
            >
              <h4>BMI</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {report.bmiChange ?? '-'}%
              </div>
              <div style={{ fontSize: 12, color: 'red' }}>
                Last 1 Month {report.bmiChange ?? '-'}%
              </div>
              <div style={{ width: '100%', height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateGraphData('bmi')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 식단 점수 요약 */}
            <div
              style={{
                border: '1px solid #ddd',
                padding: 20,
                borderRadius: 8,
              }}
            >
              <h4>식단 점수</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {getAverageDietScore()}점
              </div>
              <div style={{ fontSize: 12, color: 'green' }}>
                Last 1 Month +10%
              </div>
              <div style={{ width: '100%', height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateGraphData('diet')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 운동시간 그래프 */}
            <div
              style={{
                border: '1px solid #ddd',
                padding: 20,
                borderRadius: 8,
              }}
            >
              <h4>운동시간</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {getAverageExerciseTime()}분
              </div>
              <div style={{ fontSize: 12, color: 'green' }}>
                Last 1 Month {report.exerciseChange ?? '-'}%
              </div>
              <div style={{ width: '100%', height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateGraphData('exercise')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* 여기 미션 달력 4개 추가 */}
          <div className="mission-calendars" style={{ marginTop: 40 }}>
            {['DIET', 'EXERCISE', 'STRESS', 'DAILY'].map((type) => (
              <MissionCalendar
                key={type}
                title={
                  type === 'DIET'
                    ? '식단 미션'
                    : type === 'EXERCISE'
                      ? '운동 미션'
                      : type === 'STRESS'
                        ? '스트레스 미션'
                        : '일상 미션'
                }
                data={missions[type] || []}
                year={year}
                month={month}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HealthReport;
