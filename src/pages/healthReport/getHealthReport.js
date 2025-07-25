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
  BarChart,
  Bar,
  Rectangle,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import '../../styles/healthReport/getHealthReport.css';

function SingleMissionBarChart({ title, data }) {
  console.log(title, data);
  // 성공 개수 계산
  const total = data.length;
  const successCount = data.filter((item) => item.complete === true).length;
  const failCount = total - successCount;
  console.log(
    `[${title}] 성공 수: ${data.filter((i) => i.complete).length}, 전체 수: ${data.length}`
  );

  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  const chartData = [
    { name: '완료', count: successCount },
    { name: '미완료', count: failCount },
  ];

  return (
    <div style={{ width: '100%', height: 250 }}>
      <h3>
        {title}({successRate}%)
      </h3>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA1ODY2fQ.KUVV-2F1TPbZrXVmKNKadwGsv-zr0uW9RB1Wc28-IEfhvIuPzUH1GfqD9omZQwtJl7iTso3nrmC3yBb04DRf2Q',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4ODY2Nn0.tYu9Te9Dyged3XGT_5jxSy7aHrdlrS2DXIPSUplW-dZbwsd_-jdPITwKSSikG7gRsdqD9ZySsVjAFJgluEntEg',
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
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA1ODY2fQ.KUVV-2F1TPbZrXVmKNKadwGsv-zr0uW9RB1Wc28-IEfhvIuPzUH1GfqD9omZQwtJl7iTso3nrmC3yBb04DRf2Q',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4ODY2Nn0.tYu9Te9Dyged3XGT_5jxSy7aHrdlrS2DXIPSUplW-dZbwsd_-jdPITwKSSikG7gRsdqD9ZySsVjAFJgluEntEg',
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
    const exercise = report?.monthlyExercisesTimes ?? [];
    if (exercise.length === 0) return '-';
    const total = exercise.reduce((sum, item) => sum + item.duration, 0);
    return Math.round(total / exercise.length);
  };

  function calculateWeightChange(healthInfo) {
    if (!healthInfo || healthInfo.length < 2) return null;

    const sorted = [...healthInfo]
      .filter((item) => item.weight != null && item.createdAt)
      .sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());

    const first = sorted[0].weight;
    const last = sorted[sorted.length - 1].weight;
    const diff = (last - first).toFixed(1);

    return diff > 0 ? `+${diff}` : `${diff}`;
  }

  function calculateBmiChange(healthInfo) {
    if (!healthInfo || healthInfo.length < 2) return null;

    const sorted = [...healthInfo]
      .filter((item) => item.bmi != null && item.createdAt)
      .sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());

    const first = sorted[0].bmi;
    const last = sorted[sorted.length - 1].bmi;
    const biff = (last - first).toFixed(1);

    return biff > 0 ? `+${biff}` : `${biff}`;
  }

  function PieChartWithOnlyGreenRounded({ score }) {
    const baseData = [{ name: 'full', value: 100 }];
    const scoreData = [{ name: 'score', value: score }];

    return (
      <PieChart width={180} height={180}>
        {/* 배경 (베이지색) */}
        <Pie
          data={baseData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          isAnimationActive={false}
          stroke="none"
        >
          <Cell fill="#f6edd5" />
        </Pie>

        {/* 점수 영역 (초록색) */}
        <Pie
          data={scoreData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          startAngle={90}
          endAngle={90 - 360 * (score / 100)}
          dataKey="value"
          cornerRadius={12}
          isAnimationActive={true}
          animationDuration={1500}
          stroke="none"
        >
          <Cell fill="#88c71f" />
        </Pie>

        {/* 중앙 점수 텍스트 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={35}
          fill="#666"
        >
          {score}
        </text>
      </PieChart>
    );
  }

  return (
    <div className="health-report-container">
      <h2>Health Overview</h2>
      <div className="date-selector">
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
          <div className="health-score-box">
            <div className="score-circle">
              <PieChartWithOnlyGreenRounded score={report.monthlyScore} />
            </div>
            <div className="score-text">
              <h3>이번 달 건강상태: {report.healthStatus}</h3>
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
          <div className="summary-graph-grid">
            {/* 몸무게 */}
            <div className="summary-card">
              <h4>몸무게</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {report?.healthInfo
                  ? `${calculateWeightChange(report.healthInfo)}kg`
                  : '-'}
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
            <div className="summary-card">
              <h4>BMI</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {report?.healthInfo
                  ? `${calculateBmiChange(report.healthInfo)}`
                  : '-'}
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
            <div className="summary-card">
              <h4>식단 점수</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {getAverageDietScore()}점
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
            <div className="summary-card">
              <h4>운동시간</h4>
              <div
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}
              >
                {getAverageExerciseTime()}분
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

          <div className="health-graph-grid">
            <SingleMissionBarChart
              title="식단 미션 성공률"
              data={missions.DIET || []}
            />
            <SingleMissionBarChart
              title="운동 미션 성공률"
              data={missions.EXERCISE || []}
            />
            <SingleMissionBarChart
              title="스트레스 미션 성공률"
              data={missions.STRESS || []}
            />
            <SingleMissionBarChart
              title="일상 미션 성공률"
              data={missions.DAILY || []}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default HealthReport;
