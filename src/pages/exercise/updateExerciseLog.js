import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/exercise/createExerciseLog.css';
import apiClient from '../../utils/axios';

// bodyLabels, feelingLabels, categoryMap 기존과 동일
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

const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([en, ko]) => [ko, en])
);

function labelToValue(obj, label) {
  // label을 숫자값으로 변환(없으면 3)
  for (let [key, val] of Object.entries(obj)) {
    if (val === label) return Number(key);
  }
  return 3;
}

function UpdateExerciseLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allExercises, setAllExercises] = useState([]);
  const [part, setPart] = useState('upper');
  const [exercise, setExercise] = useState('');
  const [exerciseId, setExerciseId] = useState(null);
  const [setList, setSetList] = useState([]);
  const [bodyCondition, setBodyCondition] = useState(3);
  const [exerciseFeeling, setExerciseFeeling] = useState(4);
  const [sensation, setSensation] = useState([]);
  const [form, setForm] = useState({});

  // 운동 목록 불러오기
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await apiClient.get('/exercise/list');
        setAllExercises(response.data);
      } catch (err) {
        alert("운동 목록을 불러오는 데 실패했습니다.");
      }
    };
    fetchExercises();
  }, []);

  // 기존 운동 기록 불러오기 및 state 세팅
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await apiClient.get(`/exercise/log/select/${id}`);
        const data = res.data;
        setForm({
          exerciseDate: data.exerciseDate?.split('T')[0] || "",
          intensity: data.intensity || "",
          duration: data.duration || "",
          calories: data.calories || "",
          heartrate: data.heartRate || "",
          setCount: data.setCount || "",
          repCount: data.repCount || "",
          pre_condition: labelToValue(bodyLabels, data.preCondition) || 3,
          memo: data.memo || "",
        });
        setBodyCondition(labelToValue(bodyLabels, data.bodyCondition));
        setExerciseFeeling(labelToValue(feelingLabels, data.postFeeling));
        setSensation(data.physicalNote ? data.physicalNote.split(',').map(s => s.trim()) : []);
        setSetList(data.setList || []);
        // 운동종류 세팅
        if (data.exercise) {
          setExerciseId(data.exercise.exerciseId);
          setExercise(data.exercise.exerciseName);
          setPart(reverseCategoryMap[data.exercise.exerciseCategory] || "upper");
        }
      } catch (e) {
        alert('기존 기록 불러오기 실패');
      }
    };
    fetchLog();
  }, [id]);

  // 운동 부위 선택 변경 시 운동 이름/ID 세팅
  useEffect(() => {
    if (allExercises.length === 0) return;
    const availableExercises = allExercises.filter(ex => ex.exerciseCategory === categoryMap[part]);
    if (availableExercises.length > 0) {
      setExercise(availableExercises[0].exerciseName);
      setExerciseId(availableExercises[0].exerciseId);
    } else {
      setExercise('');
      setExerciseId(null);
    }
  }, [part, allExercises]);

  // 세트 추가/삭제/변경
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

  // 감각 체크박스
  const handleSensationChange = (e) => {
    const { value, checked } = e.target;
    setSensation(checked
      ? [...sensation, value]
      : sensation.filter((v) => v !== value)
    );
  };

  // input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  // === [핵심] 수정 버튼 ===
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !form.exerciseDate ||
      !form.intensity ||
      !form.duration ||
      !part ||
      !exerciseId
    ) {
      alert('필수 입력값을 모두 입력하세요!');
      return;
    }
    const localDateTimeString = form.exerciseDate ? `${form.exerciseDate}T00:00:00` : null;
    const updateLog = {
      exerciseLogsId: id, 
      user: { userUuid: "2025061401" }, // 실제 로그인 사용자 UUID로 대체
      exercise: { exerciseId: exerciseId },
      exerciseDate: localDateTimeString,
      preCondition: bodyLabels[bodyCondition],
      duration: Number(form.duration),
      intensity: form.intensity,
      calories: Number(form.calories),
      heartRate: Number(form.heartrate),
      setCount: Number(form.setCount),
      repCount: Number(form.repCount),
      bodyCondition: bodyLabels[bodyCondition],
      postFeeling: feelingLabels[exerciseFeeling],
      physicalNote: sensation.join(', '),
      memo: form.memo,
      setList: setList
    };
    try {
      await apiClient.post(`/exercise/log/update`, updateLog);
      alert('수정 완료!');
      navigate(-1);
    } catch (err) {
      alert('수정 실패!');
    }
  };

  // === 취소 ===
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="create-exercise-log-page">
      <h1>운동 기록 수정</h1>
      <form className="exercise-log-form" onSubmit={handleUpdate}>
        {/* 운동 기본 정보 카드 */}
        <div className="exercise-log-card">
          <h2>운동 기본 정보</h2>
          <p>오늘의 운동에 관한 기본 정보를 입력해주세요.</p>
          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="exerciseDate">운동 날짜 <span className="exercise-log-required">*</span></label>
              <input id="exerciseDate" type="date" value={form.exerciseDate || ""} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="pre_condition">운동 전 컨디션 <span className="exercise-log-required">*</span></label>
              <select id="pre_condition" value={bodyCondition} onChange={e => setBodyCondition(Number(e.target.value))}>
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
              <select id="intensity" value={form.intensity || ""} onChange={handleChange}>
                <option value="">선택</option>
                <option value="약">약</option>
                <option value="중">중</option>
                <option value="강">강</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration">운동 시간 (분) <span className="exercise-log-required">*</span></label>
              <input id="duration" type="number" value={form.duration || ""} placeholder="예: 30" onChange={handleChange} />
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
              <input id="calories" type="number" value={form.calories || ""} placeholder="예: 420" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="heartrate">평균 심박수 (bpm)</label>
              <input id="heartrate" type="number" value={form.heartrate || ""} placeholder="예: 130" onChange={handleChange} />
            </div>
          </div>
          <div className="exercise-log-row-2col">
            <div>
              <label htmlFor="setCount">세트 수</label>
              <input id="setCount" type="number" value={form.setCount || ""} placeholder="세트 수 (예: 3)" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="repCount">반복 수</label>
              <input id="repCount" type="number" value={form.repCount || ""} placeholder="반복 수 (예: 12)" onChange={handleChange} />
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
          <textarea id="memo" placeholder="예: 허벅지가 당기고 숨이 찼어요." rows="3" value={form.memo || ""} onChange={handleChange}></textarea>
        </div>

        {/* 버튼 영역 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            className="exercise-log-button exercise-log-button-default"
            type="submit"
            style={{ backgroundColor: '#88C71F' }}
          >
            수정
          </button>
          <button
            className="exercise-log-button exercise-log-button-cancel"
            type="button"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateExerciseLog;
