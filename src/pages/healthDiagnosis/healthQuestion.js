import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/healthDiagnosis/healthQuestion.css';
import WarningModal from '../../components/common/WarningModal'; // ✅ default export 기준 수정
import { useNavigate } from 'react-router-dom';

// 선지 번호 숫자 문자로 변환
const numberToSymbol = (index) => {
  const symbols = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
  return symbols[index] || `${index + 1}`;
};

// 질문 카드 : 개별 문항 렌더링 컴포넌트
const QuestionCard = ({
  question,
  index,
  category,
  disabled = false,
  onAnswer,
  answer,
}) => {
  const { questionCode, questionText, isMultiple, options = [] } = question;

  // 라벨 클릭 시 실행될 함수
  const handleChange = (e) => {
    const { value, checked } = e.target;
    const stringValue = String(value);

    let newSelected;
    if (isMultiple) {
      const current = Array.isArray(answer) ? answer : [];
      newSelected = checked
        ? [...current, stringValue]
        : current.filter((v) => v !== stringValue);
    } else {
      newSelected = stringValue;
    }

    onAnswer && onAnswer(category, questionCode, newSelected);
  };

  return (
    <div className="question-card">
      <p className="question-text">
        <strong>{index + 1}</strong>. {questionText}
      </p>

      <div className="options">
        {options.map((opt, optIndex) => {
          const optValue = String(opt.optionId);
          const isChecked = isMultiple
            ? Array.isArray(answer) && answer.includes(optValue)
            : answer === optValue;

          return (
            <label key={opt.optionId} className="option-label custom-option">
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={`q_${category}_${questionCode}`} // 같은 문항 묶음
                value={opt.optionId}
                className="option-input-hidden"
                disabled={disabled}
                onChange={handleChange}
                checked={isChecked}
              />
              <span className="option-circle">{numberToSymbol(optIndex)}</span>
              <span className="option-text">
                {opt.optionText}
                {/* 해당 선지에 text 입력이 필요한 경우 */}
                {opt.textOption === 1 && (
                  <>
                    {' '}
                    <input
                      type="text"
                      name={`text_${questionCode}_${opt.optionCode}`}
                      placeholder="내용을 입력해 주세요"
                      className="inline-textbox"
                      disabled={!isChecked || disabled}
                    />
                  </>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// 전체 설문 컴포넌트
const HealthQuestion = () => {
  const [questions, setQuestions] = useState([]); // 전체 문항 목록
  const [disabledCategories, setDisabledCategories] = useState({
    음주습관: false,
    흡연습관: false,
  });
  const [answers, setAnswers] = useState({}); // 응답 상태
  const [showModal, setShowModal] = useState(false); // 경고 모달 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달 메세지
  const navigate = useNavigate();

  // 비음주자/비흡연자 체크 시 문항 비활성화 및 응답 제거
  const handleCheckboxToggle = (category) => {
    const newValue = !disabledCategories[category];
    setDisabledCategories((prev) => ({
      ...prev,
      [category]: newValue,
    }));

    // 체크 상태가 true로 바뀔 경우, 해당 카테고리의 응답 초기화
    if (newValue) {
      setAnswers((prev) => {
        const updated = { ...prev };
        Object.entries(prev).forEach(([questionCode, { category: c }]) => {
          if (c === category) {
            delete updated[questionCode];
          }
        });
        return updated;
      });
    }
  };

  // API 요청 : 질문 목록 불러오기
  useEffect(() => {
    axios
      .get('/api/v1/kurung/diagnosis/questions')
      .then((res) => {
        console.log('✅ 응답:', res.data);
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error('❌ 질문 불러오기 실패:', err.message);
      });
  }, []);

  // 문항을 카테고리별로 그룹핑
  const grouped = questions.reduce((acc, q) => {
    (acc[q.category] = acc[q.category] || []).push(q);
    return acc;
  }, {});

  // 하위에서 응답 변경 시 호출됨
  const handleAnswerChange = (category, questionCode, selected) => {
    const key = `${category}_${questionCode}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: { category, questionCode, selected },
    }));
  };

  // 제출 버튼 클릭 시 유효성 검사
  const handleSubmit = () => {
    const unanswered = questions.filter((q) => {
      const key = `${q.category}_${q.questionCode}`;
      const ans = answers[key];
      const isDisabled = disabledCategories[q.category];
      const isAnswered =
        ans &&
        (Array.isArray(ans.selected)
          ? ans.selected.length > 0
          : ans.selected !== '');

      return !isDisabled && !isAnswered;
    });

    // 응답 안 한 문항이 있는 경우 모달 표시
    if (unanswered.length > 0) {
      setModalMessage('모든 문항에 응답해 주세요.');
      setShowModal(true);
      return;
    }

    console.log('✅ 응답 완료:', answers);
    // 다음 단계로 이동 or 저장 처리
    navigate('/healthResult');
  };

  return (
    <div className="question-container">
      <h1>건강상태 초기진단</h1>

      <div className="category-wrapper">
        {Object.entries(grouped).map(([category, qList], idx) => (
          <section key={category} className={'category-section'}>
            <div className="category-title-row">
              <div className="category-title-row">
                <h2 className="category-title">
                  {idx + 1}. {category}
                </h2>
                {(category === '음주습관' || category === '흡연습관') && (
                  <label className="category-label">
                    <input
                      className="label-input"
                      type="checkbox"
                      checked={disabledCategories[category]}
                      onChange={() => handleCheckboxToggle(category)}
                    />
                    {category === '음주습관' ? '비음주자' : '비흡연자'}
                  </label>
                )}
              </div>
            </div>
            <div
              className={`question-grid${
                disabledCategories[category] ? ' disabled-question-grid' : ''
              }`}
            >
              {qList.map((q, i) => (
                <QuestionCard
                  key={`q-${category}-${q.questionCode}-${i}`}
                  question={q}
                  index={i}
                  category={category}
                  disabled={disabledCategories[category]}
                  onAnswer={handleAnswerChange}
                  answer={answers[`${category}_${q.questionCode}`]?.selected}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        완료하기
      </button>

      {showModal && (
        <WarningModal
          message={modalMessage}
          onConfirm={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default HealthQuestion;
