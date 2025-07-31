import React, { useState } from 'react';
import '../../styles/exercise/analyzingExerciseStyle.css';

// 스타일별 설명 데이터
const styleDescriptions = {
  "집중형": "목표 지향적이고 체계적인 운동을 선호하는 스타일입니다. 개인적인 목표 달성에 집중하며, 정확한 기술과 효율성을 중시합니다. 홈트레이닝이나 헬스장에서 혼자 운동하는 것을 좋아하며, 기록 관리와 진전 추적에 관심이 많습니다.",
  "사회형": "함께 운동하는 것을 즐기는 스타일입니다. 그룹 클래스나 친구와의 운동을 선호하며, 운동을 통해 사회적 연결을 만드는 것을 중요하게 생각합니다. 동기부여와 지지를 받으며 운동하는 것을 좋아합니다.",
  "자연형": "자연스럽고 유연한 운동을 선호하는 스타일입니다. 스트레스 해소와 웰빙에 중점을 두며, 요가, 필라테스, 산책 등 부드러운 운동을 즐깁니다. 일정에 얽매이지 않고 본인의 컨디션에 맞춰 운동하는 것을 선호합니다.",
  "경쟁형": "도전적이고 강도 높은 운동을 선호하는 스타일입니다. 개인 기록 달성과 경쟁을 통해 동기부여를 받으며, 크로스핏, 마라톤, 스포츠 등 도전적인 활동을 즐깁니다. 지속적인 향상과 새로운 목표 설정에 관심이 많습니다.",
  "균형형": "다양한 운동을 균형있게 즐기는 스타일입니다. 유연성, 근력, 유산소를 모두 고려한 종합적인 운동을 선호하며, 건강한 라이프스타일을 추구합니다. 새로운 운동에 대한 호기심이 많고 적응력이 뛰어납니다.",
  "도전형": "새로운 도전과 변화를 추구하는 스타일입니다. 익숙하지 않은 운동이나 새로운 환경에서의 운동을 즐기며, 자신의 한계를 끊임없이 시험해보는 것을 좋아합니다. 모험적이고 스릴을 추구합니다.",
  "편안형": "부담 없이 편안하게 운동하는 것을 선호하는 스타일입니다. 강제나 압박 없이 본인의 페이스에 맞춰 천천히 진행하는 운동을 좋아합니다. 건강 유지와 스트레스 해소에 중점을 둡니다.",
  "열정형": "운동에 대한 깊은 열정과 헌신을 가진 스타일입니다. 운동을 삶의 중요한 부분으로 여기며, 지속적인 학습과 발전에 관심이 많습니다. 운동 커뮤니티에서 리더십을 발휘하는 것을 즐깁니다."
};

// 추천 루틴 데이터
const recommendations = {
  "집중형": [
    "요가 + 명상 루틴",
    "HIIT 집중 루틴", 
    "홈트 서킷 트레이닝",
    "근력 트레이닝 프로그램"
  ],
  "사회형": [
    "그룹 피트니스 클래스",
    "친구와 함께하는 운동",
    "스포츠 클럽 활동",
    "댄스 피트니스"
  ],
  "자연형": [
    "산책 + 스트레칭",
    "요가 + 필라테스",
    "자연 속 운동",
    "타이치 + 기공"
  ],
  "경쟁형": [
    "크로스핏 루틴",
    "마라톤 트레이닝",
    "고강도 인터벌",
    "스파르타 트레이닝"
  ],
  "균형형": [
    "종합 피트니스 루틴",
    "퓨전 요가 클래스",
    "기능성 운동 프로그램",
    "웰빙 밸런스 트레이닝"
  ],
  "도전형": [
    "파크our 트레이닝",
    "익스트림 스포츠",
    "어드벤처 러닝",
    "혼합 무술 클래스"
  ],
  "편안형": [
    "저강도 유산소",
    "스트레칭 + 릴랙스",
    "워킹 + 조깅",
    "수영 + 아쿠아로빅"
  ],
  "열정형": [
    "전문가급 트레이닝",
    "멀티스포츠 루틴",
    "고급 요가 프로그램",
    "선수급 피트니스"
  ]
};

// 점수 계산 함수
function calculateStyleScore(answers) {
  const scores = {
    "집중형": 0,
    "사회형": 0,
    "자연형": 0,
    "경쟁형": 0,
    "균형형": 0,
    "도전형": 0,
    "편안형": 0,
    "열정형": 0
  };

  // q1: 환경 선호도
  switch(answers.q1) {
    case "혼자 조용히 집중":
      scores["집중형"] += 3;
      break;
    case "여럿이서 함께":
      scores["사회형"] += 3;
      break;
    case "트레이너와 1:1":
      scores["집중형"] += 2;
      scores["사회형"] += 1;
      break;
    case "밖에서 자연과 함께":
      scores["자연형"] += 3;
      break;
    case "온라인 클래스":
      scores["균형형"] += 2;
      scores["편안형"] += 1;
      break;
    case "스포츠 클럽":
      scores["열정형"] += 2;
      scores["도전형"] += 1;
      break;
    default:
      break;
  }

  // q2: 운동 시간
  switch(answers.q2) {
    case "15분 이하 밟게":
      scores["집중형"] += 2;
      break;
    case "20~30분":
      scores["균형형"] += 2;
      break;
    case "30~45분":
      scores["사회형"] += 2;
      break;
    case "45분~1시간":
      scores["열정형"] += 2;
      break;
    case "1시간 이상":
      scores["경쟁형"] += 3;
      break;
    case "그때그때 달라요":
      scores["편안형"] += 2;
      break;
    default:
      break;
  }

  // q3: 운동 목적
  switch(answers.q3) {
    case "스트레스 해소":
      scores["편안형"] += 3;
      break;
    case "체중 감량":
      scores["집중형"] += 2;
      scores["균형형"] += 1;
      break;
    case "근육 증가":
      scores["집중형"] += 3;
      break;
    case "체형 개선":
      scores["균형형"] += 3;
      break;
    case "건강 유지":
      scores["편안형"] += 2;
      break;
    case "체력 향상":
      scores["열정형"] += 2;
      break;
    case "대회 준비/기록 향상":
      scores["도전형"] += 3;
      break;
    default:
      break;
  }

  // q4: 선호 강도
  switch(answers.q4) {
    case "거의 움직이지 않는 수준":
      scores["편안형"] += 3;
      break;
    case "가볍게 땀날 정도":
      scores["편안형"] += 2;
      break;
    case "적당히 힘들 정도":
      scores["균형형"] += 2;
      break;
    case "땀 쭉 빼는 중강도":
      scores["열정형"] += 2;
      break;
    case "매우 힘든 고강도":
      scores["도전형"] += 2;
      break;
    case "끝까지 몰아붙이는 고강도":
      scores["도전형"] += 3;
      break;
    default:
      break;
  }

  // q5: 음악 선호도
  switch(answers.q5) {
    case "필수! EDM, 힙합 등":
      scores["도전형"] += 2;
      break;
    case "팝, 락 음악":
      scores["사회형"] += 2;
      break;
    case "클래식, 재즈 등":
      scores["집중형"] += 2;
      break;
    case "팟캐스트, 오디오북":
      scores["균형형"] += 2;
      break;
    case "주변 소리 집중":
      scores["편안형"] += 2;
      break;
    case "영상이나 TV":
      scores["균형형"] += 2;
      break;
    case "음악 없이":
      scores["편안형"] += 2;
      break;
    default:
      break;
  }

  return scores;
}

// 최고 점수 스타일 찾기
function findTopStyle(scores) {
  let maxScore = 0;
  let topStyle = "균형형";
  
  for (const [style, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topStyle = style;
    }
  }
  
  return topStyle;
}

function AnalyzingExerciseStyle() {
  const [form, setForm] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });
  
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    style: '',
    description: '',
    recommendations: []
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 모든 질문이 답변되었는지 확인
    if (!form.q1 || !form.q2 || !form.q3 || !form.q4 || !form.q5) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    // 점수 계산
    const scores = calculateStyleScore(form);
    const topStyle = findTopStyle(scores);
    
    console.log('Form data:', form);
    console.log('Scores:', scores);
    console.log('Top style:', topStyle);
    
    // 결과 설정
    setResult({
      style: topStyle + " 운동 스타일",
      description: styleDescriptions[topStyle],
      recommendations: recommendations[topStyle] || ["개인 맞춤 루틴", "전신 운동", "유연성 운동"]
    });
    
    console.log('Result:', result);
    
    // 결과 표시
    setShowResult(true);
  };

  const resetTest = () => {
    setForm({
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: ''
    });
    setShowResult(false);
    setResult({
      style: '',
      description: '',
      recommendations: []
    });
  };

  return (
    <div className="exercise-style-body">
      <div className="exercise-style-container">
        <h2 className="exercise-style-title">운동 성향 테스트</h2>

        {!showResult ? (
          <form className="exercise-style-form" onSubmit={handleSubmit}>
            <div className="exercise-style-question">
              <label htmlFor="q1">1. 운동할 때 선호하는 환경은?</label>
              <select id="q1" value={form.q1} onChange={handleChange} required>
                <option value="">-- 선택해주세요 --</option>
                <option value="혼자 조용히 집중">혼자 조용히 집중</option>
                <option value="여럿이서 함께">여럿이서 함께</option>
                <option value="트레이너와 1:1">트레이너와 1:1</option>
                <option value="밖에서 자연과 함께">밖에서 자연과 함께</option>
                <option value="온라인 클래스">온라인 클래스</option>
                <option value="스포츠 클럽">스포츠 클럽</option>
              </select>
            </div>

            <div className="exercise-style-question">
              <label htmlFor="q2">2. 운동 시간은 보통 얼마나?</label>
              <select id="q2" value={form.q2} onChange={handleChange} required>
                <option value="">-- 선택해주세요 --</option>
                <option value="15분 이하 밟게">15분 이하 밟게</option>
                <option value="20~30분">20~30분</option>
                <option value="30~45분">30~45분</option>
                <option value="45분~1시간">45분~1시간</option>
                <option value="1시간 이상">1시간 이상</option>
                <option value="그때그때 달라요">그때그때 달라요</option>
              </select>
            </div>

            <div className="exercise-style-question">
              <label htmlFor="q3">3. 운동 목적은?</label>
              <select id="q3" value={form.q3} onChange={handleChange} required>
                <option value="">-- 선택해주세요 --</option>
                <option value="스트레스 해소">스트레스 해소</option>
                <option value="체중 감량">체중 감량</option>
                <option value="근육 증가">근육 증가</option>
                <option value="체형 개선">체형 개선</option>
                <option value="건강 유지">건강 유지</option>
                <option value="체력 향상">체력 향상</option>
                <option value="대회 준비/기록 향상">대회 준비/기록 향상</option>
              </select>
            </div>

            <div className="exercise-style-question">
              <label htmlFor="q4">4. 선호하는 운동 강도는?</label>
              <select id="q4" value={form.q4} onChange={handleChange} required>
                <option value="">-- 선택해주세요 --</option>
                <option value="거의 움직이지 않는 수준">거의 움직이지 않는 수준</option>
                <option value="가볍게 땀날 정도">가볍게 땀날 정도</option>
                <option value="적당히 힘들 정도">적당히 힘들 정도</option>
                <option value="땀 쭉 빼는 중강도">땀 쭉 빼는 중강도</option>
                <option value="매우 힘든 고강도">매우 힘든 고강도</option>
                <option value="끝까지 몰아붙이는 고강도">끝까지 몰아붙이는 고강도</option>
              </select>
            </div>

            <div className="exercise-style-question">
              <label htmlFor="q5">5. 운동할 때 음악은?</label>
              <select id="q5" value={form.q5} onChange={handleChange} required>
                <option value="">-- 선택해주세요 --</option>
                <option value="필수! EDM, 힙합 등">필수! EDM, 힙합 등</option>
                <option value="팝, 락 음악">팝, 락 음악</option>
                <option value="클래식, 재즈 등">클래식, 재즈 등</option>
                <option value="팟캐스트, 오디오북">팟캐스트, 오디오북</option>
                <option value="주변 소리 집중">주변 소리 집중</option>
                <option value="영상이나 TV">영상이나 TV</option>
                <option value="음악 없이">음악 없이</option>
              </select>
            </div>

            <button type="submit" className="exercise-style-submit-btn">결과 보기</button>
          </form>
        ) : (
          <div className="exercise-style-result-box">
            <div className="exercise-style-result-title">당신의 운동 스타일은?</div>
            <div className="exercise-style-name">{result.style}</div>
            <div className="exercise-style-description">{result.description}</div>
            
            <div className="exercise-style-recommendations">
              <h4>추천 루틴:</h4>
              <ul>
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <button className="exercise-style-retest-btn" onClick={resetTest}>
              다시 테스트하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyzingExerciseStyle; 