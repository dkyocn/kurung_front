import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import '../../styles/healthDiagnosis/healthResult.css';

// 이미지 import
import eatingImg from '../../images/diagnosis/1_eating.jpg';
import exerciseImg from '../../images/diagnosis/2_exercise.png';
import sleepImg from '../../images/diagnosis/3_sleep.jpg';
import mentalImg from '../../images/diagnosis/4_stress.png';
import caffeineImg from '../../images/diagnosis/5_caffeine.png';
import drinkImg from '../../images/diagnosis/6_drink.jpg';
import smokingImg from '../../images/diagnosis/7_smoking.jpg';
import smartphoneImg from '../../images/diagnosis/8_smartphone.jpg';
import diseaseImg from '../../images/diagnosis/9_disease.png';

const HealthResult = ({ userUuid }) => {
  const [diagnosis, setDiagnosis] = useState(null);
  const navigate = useNavigate();
  const handleRetry = () => {
    navigate('/healthQuestion'); // URL 구조에 따라 경로 조정
  };

  const score = diagnosis?.score || 0; // 점수

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Perfect';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Normal';
    if (score >= 40) return 'Caution';
    return 'Risk';
  };

  // 점수 배경용 전체 100% (베이지색)
  const baseData = [{ name: 'full', value: 100 }];

  // 실제 점수 영역만 (초록색)
  const scoreData = [{ name: 'score', value: score }];

  // 매핑 테이블
  const categoryImageMap = {
    DIET: eatingImg,
    EXERCISE: exerciseImg,
    SLEEP: sleepImg,
    MENTAL: mentalImg,
    CAFFEINE: caffeineImg,
    DRINK: drinkImg,
    SMOKING: smokingImg,
    SMARTPHONE: smartphoneImg,
    DISEASE: diseaseImg,
    STRESS: mentalImg,
  };

  useEffect(() => {
    // console.log('[디버그] userUuid:', userUuid);

    axios
      .get(`/api/v1/kurung/diagnosis/result`, {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNTE3ODgwfQ.fqW3EodeRL9zYj4A2KdQaLDIHrt5Souu5K3e9OBqbOjyXCPlj_pxe91Fa_yRkCIgPvePpOND3iX9RFy_B1Zj1w',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzYwMDY4MH0.u-I6qQ1qbq9pulAQ_4Jr4Tl0W9_XK7Yw9dMqoVtF_9CHkX86FdhA3tXZKpwYnobVBQ2V8i750yoT1SWq2wjXsw',
        },
      })
      .then((res) => setDiagnosis(res.data))
      .catch((err) => {
        console.error('진단 결과 불러오기 실패:', err);
        alert('진단 결과를 불러오는 데 실패했습니다.');
      });
  }, [userUuid]);

  if (!diagnosis) return <div>로딩 중...</div>;

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1>건강상태 초기진단 결과</h1>
        {/* 건강 점수 섹션 */}
        <section className="score-section">
          <div className="chart-area">
            <PieChart width={200} height={200}>
              {/* 베이지색 배경 레이어 */}
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

              {/* 초록색 점수 레이어 (위에 그려짐) */}
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

              {/* 중앙 점수 표시 */}
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
          </div>
          <div className="score-text">
            <h2>
              Your Health Score: <strong>{getScoreGrade(score)}</strong>
            </h2>
            <p>{diagnosis.dianosisSummary}</p>
            <div className="retry-button-wrapper">
              <button className="retry-button" onClick={handleRetry}>
                재검사
              </button>
            </div>
          </div>
        </section>

        {/* 건강 목표 추천 */}
        <section className="recommend-section">
          <h2>맞춤형 건강 목표 추천</h2>
          {diagnosis.goalDTOList.map((goal, index) => {
            const imageSrc =
              categoryImageMap[goal.category] || categoryImageMap['DIET'];
            return (
              <div className="recommend-item" key={index}>
                <div className="text">
                  <h4>{goal.goalTitle}</h4>
                  <p>{goal.goalText}</p>
                </div>
                <img
                  src={imageSrc}
                  alt={`goal-${goal.category}`}
                  className="recommend-image"
                />
              </div>
            );
          })}
        </section>

        {/* PDF 다운로드 버튼 */}
        <div className="download-btn-wrapper">
          <button
            className="download-button"
            onClick={() => alert('PDF 다운로드 준비 중')}
          >
            Download Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthResult;
