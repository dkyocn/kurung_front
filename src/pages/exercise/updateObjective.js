import React, { useState, useEffect } from 'react';
import '../../styles/exercise/createObjective.css';
import apiClient from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

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

// 토큰 자동 검증 및 리다이렉트
const checkAndRedirectIfNeeded = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    alert('로그인이 필요합니다.');
    window.location.href = '/loginpage';
    return false;
  }
  return true;
};

// 월 옵션 생성 함수
function getMonthOptions(startYear, startMonth, count) {
  const options = [];
  let year = startYear;
  let month = startMonth;
  for (let i = 0; i < count; i++) {
    const monthStr = month.toString().padStart(2, '0');
    const label = `${year}-${monthStr}`;
    const start = `${year}-${monthStr}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const end = `${year}-${monthStr}-${endDate}`;
    options.push({ label, start, end });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return options;
}
const monthOptions = getMonthOptions(2025, 1, 12);

function UpdateObjective() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    count: '',
    duration: '',
    weight: '',
    month: '',
    memo: '',
  });
  const [warning, setWarning] = useState('');

  // 1. 기존 목표 데이터 불러오기
  useEffect(() => {
    async function fetchObjective() {
      if (!checkAndRedirectIfNeeded()) return;
      
      try {
        // 단일조회 API 경로(명세서 확인 필요, select/:id 구조)
        const res = await apiClient.get(`/exercise/objective/select/${id}`);
        const data = res.data;

        // 월 자동 매칭
        const matchedMonth = monthOptions.find(
          m => data.startDate && m.start === data.startDate.slice(0, 10)
        );

        setForm({
          title: data.objectiveTitle || '',
          count: data.objectiveCount || '',
          duration: data.objectiveDuration || '',
          weight: data.objectiveWeight || '',
          month: matchedMonth ? matchedMonth.label : '',
          memo: data.memo || '',
        });
      } catch (e) {
        if (e.response?.status === 401) {
          alert('로그인이 필요합니다.');
          window.location.href = '/loginpage';
        } else {
          console.error('목표 불러오기 실패:', e);
          alert('기존 목표 불러오기 실패');
        }
      }
    }
    fetchObjective();
  }, [id]);

  // input 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    const newForm = { ...form, [id]: value };
    setForm(newForm);

    // 경고 문구 로직
    let warn = '';
    if (id === 'count' && Number(value) > 0 && Number(value) <= 3) {
      warn = '운동 횟수 목표가 너무 작으면 달성률이 비정상적으로 높게 표시될 수 있습니다.';
    } else if (id === 'duration' && Number(value) > 0 && Number(value) <= 60) {
      warn = '운동 시간 목표가 너무 작으면 달성률이 비정상적으로 높게 표시될 수 있습니다.';
    } else if (id === 'weight' && Number(value) > 0 && Number(value) <= 10) {
      warn = '목표 몸무게가 너무 작게 설정되었습니다.';
    }
    setWarning(warn);
  };

  const handleMonthChange = (e) => {
    setForm({ ...form, month: e.target.value });
  };

  // 수정(업데이트) 제출
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.count || !form.duration || !form.weight || !form.month) {
      alert('필수 입력값을 모두 입력하세요!');
      return;
    }

    if (!checkAndRedirectIfNeeded()) return;

    const userUuid = getUserUuidFromToken();
    if (!userUuid) {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      return;
    }

    const selectedMonth = monthOptions.find(m => m.label === form.month);
    const data = {
      objectiveId: id, // 필수! (백엔드에서 수정대상 식별용)
      user: { userUuid: userUuid },
      objectiveTitle: form.title,
      objectiveCount: Number(form.count),
      objectiveDuration: Number(form.duration),
      objectiveWeight: Number(form.weight),
      startDate: selectedMonth.start + 'T00:00:00',
      endDate: selectedMonth.end + 'T00:00:00',
      memo: form.memo,
    };
    try {
      await apiClient.post('/exercise/objective/updated', data);
      alert('목표가 수정되었습니다!');
      navigate(-1);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/loginpage';
      } else {
        console.error('수정 실패:', err.response?.data || err);
        alert('수정 실패!');
      }
    }
  };

  const selectedMonth = monthOptions.find(m => m.label === form.month);

  return (
    <div className="create-objective-page">
      <h1 className="objective-title">운동 목표 수정</h1>
      <form className="objective-form" onSubmit={handleUpdate}>
        <label htmlFor="title">목표 제목 <span className="objective-required">*</span></label>
        <input id="title" placeholder="예: 6월 체중 감량 목표" value={form.title} onChange={handleChange} />

        <div className="objective-row-2col">
          <div>
            <label htmlFor="count">운동 횟수 목표 (회) <span className="objective-required">*</span></label>
            <input id="count" placeholder="예: 5" value={form.count} onChange={handleChange} type="number" />
            {form.count && Number(form.count) > 0 && Number(form.count) <= 7 && (
              <div className="objective-warning">한 달 목표 기준으로 7회 이하는 너무 적을 수 있습니다. 너무 작은 목표는 달성률이 비정상적으로 높게 표시될 수 있습니다.</div>
            )}
          </div>
          <div>
            <label htmlFor="duration">운동 시간 목표 (분) <span className="objective-required">*</span></label>
            <input id="duration" placeholder="예: 300" value={form.duration} onChange={handleChange} type="number" />
            {form.duration && Number(form.duration) > 0 && Number(form.duration) <= 90 && (
              <div className="objective-warning">너무 작은 목표는 달성률이 비정상적으로 높게 표시될 수 있습니다.</div>
            )}
            {form.duration && Number(form.duration) > 0 && (
              <div className="objective-duration-hint">
                {(() => {
                  const min = Number(form.duration);
                  const h = Math.floor(min / 60);
                  const m = min % 60;
                  return `${h > 0 ? h + '시간 ' : ''}${m}분`;
                })()}
              </div>
            )}
          </div>
        </div>

        <label htmlFor="weight">목표 몸무게 (kg) <span className="objective-required">*</span></label>
        <input id="weight" placeholder="예: 65.0" value={form.weight} onChange={handleChange} type="number" />
        {form.weight && Number(form.weight) > 0 && Number(form.weight) <= 10 && (
          <div className="objective-warning">목표 몸무게가 너무 작게 설정되었습니다.</div>
        )}

        <div className="objective-row-2col">
          <div>
            <label htmlFor="month">시작일 <span className="objective-required">*</span></label>
            <select id="month" value={form.month} onChange={handleMonthChange}>
              <option value="">연도-월 선택</option>
              {monthOptions.map(m => (
                <option key={m.label} value={m.label}>{m.label.replace('-', '년 ')}월</option>
              ))}
            </select>
          </div>
          <div>
            <label>종료일 <span className="objective-required">*</span></label>
            <input value={selectedMonth ? selectedMonth.end : ''} readOnly placeholder="자동 설정" />
          </div>
        </div>

        <label htmlFor="memo">메모 (선택)</label>
        <textarea id="memo" placeholder="이 목표를 설정한 이유나 계획을 적어보세요." value={form.memo} onChange={handleChange} rows={3}></textarea>

        {warning && <div className="objective-warning">{warning}</div>}

        <button className="button objective-btn" type="submit">목표 수정하기</button>
      </form>
    </div>
  );
}

export default UpdateObjective;
