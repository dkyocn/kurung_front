import React, { useState, useEffect } from 'react';
import '../../styles/exercise/createExerciseLog.css';
import apiClient from '../../utils/axios';

const bodyLabels = {
  1: '매우 나쁨',
  2: '나쁨',
  3: '보통',
  4: '좋음',
  5: '매우 좋음'
};

const feelingLabels = {
  1: '힘들고 찝찝했어요',
  2: '별로였어요',
  3: '보통이었어요',
  4: '기분이 상쾌하고 좋았어요',
  5: '최고였어요!'
};

const categoryMap = {
  'upper': '상체',
  'lower': '하체',
  'core': '코어',
  'full': '전신',
  'cardio': '유산소'
};

function CreateExerciseLog() {
  const [allExercises, setAllExercises] = useState([]);
  const [part, setPart] = useState('upper');
  const [exercise, setExercise] = useState('');
  const [exerciseId, setExerciseId] = useState(null);
  const [setList, setSetList] = useState([]);
  const [bodyCondition, setBodyCondition] = useState(3);
  const [exerciseFeeling, setExerciseFeeling] = useState(4);
  const [sensation, setSensation] = useState([]);
  const [form, setForm] = useState({});

 useEffect(() => {
  const fetchExercises = async () => {
    try {
      // 변경: /api/v1/kurung/exercise/list
      const response = await apiClient.get('/exercise/list', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
      });
      setAllExercises(response.data);
    } catch (err) {
      alert("운동 목록을 불러오는 데 실패했습니다.");
    }
  };

  fetchExercises();
}, []);

  useEffect(() => {
    console.log("-----------[운동 유형 필터링 확인]-----------");
    if (allExercises.length === 0) {
      console.log("`allExercises`가 비어있습니다. API 응답을 기다리는 중일 수 있습니다.");
      return;
    }
    console.log("현재 선택된 운동 종목 (영문):", part);
    
    const koreanPart = categoryMap[part];
    console.log("매핑된 운동 종목 (한글):", koreanPart);
    console.log("필터링에 사용될 전체 운동 배열:", allExercises);

    const availableExercises = allExercises.filter(ex => ex.exerciseCategory === koreanPart);
    console.log("필터링 후 남은 운동 배열:", availableExercises);

    if (availableExercises.length > 0) {
      console.log("필터링 성공: 운동 유형 목록을 설정합니다.");
      setExercise(availableExercises[0].exerciseName);
      setExerciseId(availableExercises[0].exerciseId);
    } else {
      setExercise('');
      setExerciseId(null);
    }
  }, [part, allExercises]);

  const handleAddSet = () => {
    setSetList([...setList, { weight: '', reps: '' }]);
  };

  const handleSetChange = (idx, field, value) => {
    const newSetList = setList.map((set, i) =>
      i === idx ? { ...set, [field]: value } : set
    );
    setSetList(newSetList);
  };

  const handleRemoveSet = (idx) => {
    setSetList(setList.filter((_, i) => i !== idx));
  };

  const handleSensationChange = (e) => {
    const { value, checked } = e.target;
    setSensation(checked
      ? [...sensation, value]
      : sensation.filter((v) => v !== value)
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  /* const handleSubmit = (e) => {
    e.preventDefault();
    // 제출 로직 구현
    alert('운동 기록이 저장되었습니다!');
  }; */


  const handleSubmit = async (e) => {
    e.preventDefault();
    // 필수값 체크
    if (
      !form.exerciseDate ||
      !form.intensity ||
      !form.duration ||
      !part ||
      !exerciseId ||
      !form.pre_condition
    ) {
      alert('필수 입력값을 모두 입력하세요!');
      return;
    }

    const dateString = form.exerciseDate; // "2025-07-19"
    const localDateTimeString = dateString ? `${dateString}T00:00:00` : null;

    // 입력값 수집 → data 만들기
    const newLog = {
      user: { userUuid: "2025061401" }, // EXERCISE_ID (운동명-ID 매핑 필요)
    exercise: { exerciseId: exerciseId },         
      exerciseDate: localDateTimeString,
      preCondition: bodyLabels[bodyCondition], // PRE_CONDITION (ex. "보통")
      duration: Number(form.duration),      // DURATION (예: 30)
      intensity: form.intensity,            // INTENSITY ("low"/"medium"/"high")
      // 나머지는 선택사항(칼로리, 심박수 등)
      calories: Number(form.calories),      // (옵션)
      heartRate: Number(form.heartrate),    // (옵션)
      setCount: Number(form.setCount),      // (옵션)
      repCount: Number(form.repCount),      // (옵션)
      bodyCondition: bodyLabels[bodyCondition],  // (옵션)
      postFeeling: feelingLabels[exerciseFeeling], // (옵션)
      physicalNote: sensation.join(', '),
      memo: form.memo,   // (옵션)
    };

    try {
      await apiClient.post('/exercise/log/create', newLog, {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
      });
      alert('운동 기록 저장 완료!');
      // 폼 초기화 등 추가 가능
    } catch (err) {
      alert('운동 기록 저장 실패!');
      console.error(err);
    }
  };

  return (
    <div className="create-exercise-log-page">
      <h1>운동 기록 입력</h1>
      <form className="exercise-log-form" onSubmit={handleSubmit}>
        {/* 운동 기본 정보 카드 */}
        <div className="exercise-log-card">
          <h2>운동 기본 정보</h2>
          <p>오늘의 운동에 관한 기본 정보를 입력해주세요.</p>

          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="exerciseDate">운동 날짜 <span className="exercise-log-required">*</span></label>
              <input id="exerciseDate" type="date" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="pre_condition">운동 전 컨디션 <span className="exercise-log-required">*</span></label>
              <select id="pre_condition" onChange={handleChange}>
                <option value="">선택</option>
                <option value="5">매우 좋음</option>
                <option value="4">좋음</option>
                <option value="3">보통</option>
                <option value="2">나쁨</option>
                <option value="1">매우 나쁨</option>
              </select>
            </div>
          </div>

          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="part">운동 종목 <span className="exercise-log-required">*</span></label>
              <select id="part" value={part} onChange={e => setPart(e.target.value)}>
                <option value="upper">상체</option>
                <option value="lower">하체</option>
                <option value="core">코어</option>
                <option value="full">전신</option>
                <option value="cardio">유산소</option>
              </select>

            </div>
            <div>
              <label htmlFor="exercise">운동 유형 <span className="exercise-log-required">*</span></label>
             <select
              id="exercise"
              value={exerciseId || ''}
              onChange={e => setExerciseId(Number(e.target.value))}
            >
              {allExercises
                .filter(ex => ex.exerciseCategory === categoryMap[part])
                .map(ex => (
                  <option key={ex.exerciseId} value={ex.exerciseId}>
                    {ex.exerciseName}
                  </option>
                ))}
            </select>
                        </div>
          </div>

          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="intensity">운동 강도 <span className="exercise-log-required">*</span></label>
              <select id="intensity" onChange={handleChange}>
                <option value="">선택</option>
                <option value="약">약</option>
                <option value="중">중</option>
                <option value="강">강</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration">운동 시간 (분) <span className="exercise-log-required">*</span></label>
              <input id="duration" placeholder="예: 30" type="number" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* 운동 상세 기록 카드 */}
        <div className="exercise-log-card">
          <h2>운동 상세 기록</h2>
          <p>선택적으로 추가 정보를 입력할 수 있습니다.</p>

          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="calories">소모한 칼로리 (kcal)</label>
              <input id="calories" placeholder="예: 420" type="number" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="heartrate">평균 심박수 (bpm)</label>
              <input id="heartrate" placeholder="예: 130" type="number" onChange={handleChange} />
            </div>
          </div>

          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="setCount">세트 수</label>
              <input id="setCount" type="number" placeholder="세트 수 (예: 3)" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="repCount">반복 수</label>
              <input id="repCount" type="number" placeholder="반복 수 (예: 12)" onChange={handleChange} />
            </div>
          </div>

          <label>세트별 무게 및 반복 입력</label>
          <div id="setList" className="exercise-log-set-rep-group">
            {setList.map((set, idx) => (
              <div className="exercise-log-set-rep-row" key={idx}>
                <input
                  type="number"
                  placeholder="무게(kg)"
                  value={set.weight}
                  onChange={e => handleSetChange(idx, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="반복 수"
                  value={set.reps}
                  onChange={e => handleSetChange(idx, 'reps', e.target.value)}
                />
                <button className="exercise-log-button exercise-log-button-delete" type="button" onClick={() => handleRemoveSet(idx)}>삭제</button>
              </div>
            ))}
          </div>
          <button className="exercise-log-button exercise-log-button-default exercise-log-set-add-btn" type="button" onClick={handleAddSet}>+ 세트 추가</button>
        </div>

        {/* 운동 후 컨디션 및 메모 카드 */}
        <div className="exercise-log-card">
          <h2>운동 후 컨디션 및 메모</h2>
          <p>운동 후 몸 상태와 느낀 점을 기록해주세요.</p>

          <div className="exercise-log-slider-group">
            <div className="exercise-log-slider-label">오늘 전반적인 몸 상태</div>
            <div className="exercise-log-slider-row">
              <span className="slider-min">매우 나쁨</span>
              <input
                type="range"
                min="1"
                max="5"
                value={bodyCondition}
                onChange={e => setBodyCondition(Number(e.target.value))}
              />
              <span className="slider-max">매우 좋음</span>
            </div>
            <div className="exercise-log-slider-label">{bodyLabels[bodyCondition]}</div>
          </div>

          <div className="exercise-log-slider-group">
            <div className="exercise-log-slider-label">운동 후 기분</div>
            <div className="exercise-log-slider-row">
              <span className="slider-min">별로</span>
              <input
                type="range"
                min="1"
                max="5"
                value={exerciseFeeling}
                onChange={e => setExerciseFeeling(Number(e.target.value))}
              />
              <span className="slider-max">최고</span>
            </div>
            <div className="exercise-log-slider-label">{feelingLabels[exerciseFeeling]}</div>
          </div>

          <label>신체적으로 어떤 느낌이 있었나요?</label>
          <div className="exercise-log-checkbox-grid">
            <label>
              <input type="checkbox" name="sensation" value="근육통 있음" checked={sensation.includes('근육통 있음')} onChange={handleSensationChange} /> 근육통 있음
            </label>
            <label>
              <input type="checkbox" name="sensation" value="관절 통증" checked={sensation.includes('관절 통증')} onChange={handleSensationChange} /> 관절 통증
            </label>
            <label>
              <input type="checkbox" name="sensation" value="전반적 피로" checked={sensation.includes('전반적 피로')} onChange={handleSensationChange} /> 전반적 피로
            </label>
            <label>
              <input type="checkbox" name="sensation" value="활력이 생김" checked={sensation.includes('활력이 생김')} onChange={handleSensationChange} /> 활력이 생김
            </label>
            <label>
              <input type="checkbox" name="sensation" value="특별한 증상 없음" checked={sensation.includes('특별한 증상 없음')} onChange={handleSensationChange} /> 특별한 증상 없음
            </label>
          </div>

          <label htmlFor="memo">기타 느낀 점 (선택)</label>
          <textarea id="memo" placeholder="예: 허벅지가 당기고 숨이 찼어요." rows="3" onChange={handleChange}></textarea>
        </div>

        <button className="exercise-log-button exercise-log-button-default exercise-log-submit-btn" type="submit">운동 기록 저장하기</button>
      </form>
    </div>
  );
}

export default CreateExerciseLog; 