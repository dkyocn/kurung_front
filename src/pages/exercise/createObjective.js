import React, { useState } from 'react';
import '../../styles/exercise/createObjective.css';
import axios from 'axios';

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

function CreateObjective() {
  const [form, setForm] = useState({
    title: '',
    count: '',
    duration: '',
    weight: '',
    month: '',
    memo: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleMonthChange = (e) => {
    setForm({ ...form, month: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.count || !form.duration || !form.weight || !form.month) {
      alert('필수 입력값을 모두 입력하세요!');
      return;
    }
    const selectedMonth = monthOptions.find(m => m.label === form.month);
    const data = {
      user: { userUuid: '2025061401' },
      objectiveTitle: form.title,
      objectiveCount: Number(form.count),
      objectiveDuration: Number(form.duration),
      objectiveWeight: Number(form.weight),
      startDate: selectedMonth.start + 'T00:00:00',
      endDate: selectedMonth.end + 'T00:00:00',
      memo: form.memo,
      // isActive: true // 필요시 주석 해제
    };
    try {
      await axios.post('/api/v1/kurung/exercise/objective/created', data);
      alert('목표가 저장되었습니다!');
    } catch (err) {
      alert('저장 실패!');
    }
  };

  const selectedMonth = monthOptions.find(m => m.label === form.month);

  return (
    <div className="objective-container">
      <h1 className="objective-title">운동 목표 설정</h1>
      <form className="objective-form" onSubmit={handleSubmit}>
        <label htmlFor="title">목표 제목 <span className="objective-required">*</span></label>
        <input id="title" placeholder="예: 6월 체중 감량 목표" value={form.title} onChange={handleChange} />

        <div className="objective-row-2col">
          <div>
            <label htmlFor="count">운동 횟수 목표 (회) <span className="objective-required">*</span></label>
            <input id="count" placeholder="예: 5" value={form.count} onChange={handleChange} type="number" />
          </div>
          <div>
            <label htmlFor="duration">운동 시간 목표 (분) <span className="objective-required">*</span></label>
            <input id="duration" placeholder="예: 300" value={form.duration} onChange={handleChange} type="number" />
          </div>
        </div>

        <label htmlFor="weight">목표 몸무게 (kg) <span className="objective-required">*</span></label>
        <input id="weight" placeholder="예: 65.0" value={form.weight} onChange={handleChange} type="number" />

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

        <button className="button objective-btn" type="submit">목표 저장하기</button>
      </form>
    </div>
  );
}

export default CreateObjective; 