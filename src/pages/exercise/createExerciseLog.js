import React, { useState, useEffect } from 'react';
import '../../styles/exercise/createExerciseLog.css';
import apiClient from '../../utils/axios';

const exercises = {
  upper: ['벤치프레스', '푸쉬업', '풀업', '숄더프레스'],
  lower: ['스쿼트', '런지', '레그프레스', '레그컬'],
  core: ['플랭크', '레그레이즈', '마운틴 클라이머', '크런치'],
  full: ['버피테스트', '점핑잭', '케틀벨 스윙'],
  cardio: ['러닝머신 인터벌 루틴', '싸이클 + 스텝퍼 복합 루틴', '러닝', '공원 순환 서킷 루틴', '실내 계단 오르기 루틴', '마운틴 클라이머']
};

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

function CreateExerciseLog() {
  const [part, setPart] = useState('upper');
  const [exercise, setExercise] = useState(exercises['upper'][0]);
  const [setList, setSetList] = useState([]);
  const [bodyCondition, setBodyCondition] = useState(3);
  const [exerciseFeeling, setExerciseFeeling] = useState(4);
  const [sensation, setSensation] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    setExercise(exercises[part][0]);
  }, [part]);

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

    const dateString = form.exerciseDate; // "2025-07-19"
    const localDateTimeString = dateString ? `${dateString}T00:00:00` : null;

    // 입력값 수집 → data 만들기
    const newLog = {
      user: { userUuid: "2025061401" },     // USER_UUID
      exercise: { exerciseId: 1 },          // EXERCISE_ID (운동명-ID 매핑 필요)
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
      await apiClient.post('/exercise/log/create', newLog);
      alert('운동 기록 저장 완료!');
      // 폼 초기화 등 추가 가능
    } catch (err) {
      alert('운동 기록 저장 실패!');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>운동 기록 입력</h1>

        <label htmlFor="date">운동 날짜</label>
        <input id="exerciseDate" type="date" onChange={handleChange} />

        <label htmlFor="pre_condition">운동 전 컨디션</label>
        <select id="pre_condition" onChange={handleChange}>
          <option value="5">매우 좋음</option>
          <option value="4">좋음</option>
          <option value="3">보통</option>
          <option value="2">나쁨</option>
          <option value="1">매우 나쁨</option>
        </select>

        <label htmlFor="part">운동 종목</label>
        <select id="part" value={part} onChange={e => setPart(e.target.value)}>
          <option value="upper">상체</option>
          <option value="lower">하체</option>
          <option value="core">코어</option>
          <option value="full">전신</option>
          <option value="cardio">유산소</option>
        </select>

        <label htmlFor="exercise">운동 유형</label>
        <select id="exercise" value={exercise} onChange={e => setExercise(e.target.value)}>
          {exercises[part].map((ex) => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>

        <label htmlFor="intensity">운동 강도</label>
        <select id="intensity" onChange={handleChange}>
          <option value="낮음">낮음</option>
          <option value="중간">중간</option>
          <option value="높음">높음</option>
        </select>

        <label htmlFor="duration">운동 시간 (분)</label>
        <input id="duration" placeholder="예: 30" type="number" onChange={handleChange} />

        <label htmlFor="calories">소모한 칼로리 (kcal)</label>
        <input id="calories" placeholder="예: 420" type="number" onChange={handleChange} />

        <label htmlFor="heartrate">평균 심박수 (bpm)</label>
        <input id="heartrate" placeholder="예: 130" type="number" onChange={handleChange} />

        <label>세트 수 및 반복 횟수</label>
        <div className="set-rep-group">
          <input id="setCount" type="number" placeholder="세트 수 (예: 3)" onChange={handleChange} />
          <input id="repCount" type="number" placeholder="반복 수 (예: 12)" onChange={handleChange} />
        </div>

        <label>세트별 무게 및 반복 입력</label>
        <div id="setList" className="set-rep-group">
          {setList.map((set, idx) => (
            <div className="set-rep-row" key={idx}>
              <input id="setCount"
                type="number"
                placeholder="무게(kg)"
                value={set.weight}
                onChange={e => handleSetChange(idx, 'weight', e.target.value)}
              />
              <input id="repCount"
                type="number"
                placeholder="반복 수"
                value={set.reps}
                onChange={e => handleSetChange(idx, 'reps', e.target.value)}
              />
              <button className="button button-delete" type="button" onClick={() => handleRemoveSet(idx)}>삭제</button>
            </div>
          ))}
        </div>
        <button className="button button-default" type="button" onClick={handleAddSet}>세트 추가</button>

        <div className="slider-double-row">
          {/* 오늘 전반적인 몸 상태 */}
          <div className="slider-group">
            <div className="slider-row">
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
            <div className="slider-label">{bodyLabels[bodyCondition]}</div>
          </div>

          {/* 운동 후 기분 */}
          <div className="slider-group">
            <div className="slider-row">
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
            <div className="slider-label">{feelingLabels[exerciseFeeling]}</div>
          </div>
        </div>

        <label>신체적으로 어떤 느낌이 있었나요?</label>
        <div className="checkbox-grid">
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

        <button className="button button-default" type="submit">운동 기록 저장하기</button>
      </form>
    </div>
  );
}

export default CreateExerciseLog; 