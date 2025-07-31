// // src/lifeLog/createLifeLog.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import '../../styles/lifeLog/createLifeLog.css';
import SaveButton from '../../components/buttons/SaveButton';
import SaveModal from '../../components/common/Modal';

const CreateLifLogForm = () => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  // 오늘 날짜 (yyyy-MM-dd 형식)
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    lifelogDate: `${today}T00:00:00`,
    emotion: '',
    emotionWrite: '',
    bedTime: '',
    wakeupTime: '',
    activity: '',
    memo: '',
    llPdfPath: null,
  });

  const emotions = [
    '행복함',
    '평온함',
    '피곤함',
    '슬픔',
    '화남',
    '불안함',
    '신남',
    '우울함',
  ];

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      lifelogDate: `${selectedDate}T00:00:00`,
    }));
  };

  const handleSubmit = async () => {
    try {
      const lifelogDateOnly = formData.lifelogDate.split('T')[0];
      const [year, month, day] = lifelogDateOnly.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);

      // 기상 시간이 입력되었는지 확인
      if (!formData.wakeupTime) {
        alert('기상 시간을 입력해주세요.');
        return;
      }

      // wakeupTime이 오전 시간일 경우 다음날로 계산
      const [wakeHour] = formData.wakeupTime.split(':').map(Number);
      const isNextDay = wakeHour < 12;

      const wakeDateObj = new Date(dateObj);
      if (isNextDay) {
        wakeDateObj.setDate(wakeDateObj.getDate() + 1);
      }
      const wakeDateStr = wakeDateObj.toISOString().split('T')[0];

      console.log('wakeDateStr:', wakeDateStr);

      const body = {
        ...formData,
        bedTime: `${lifelogDateOnly}T${formData.bedTime}:00`,
        wakeupTime: `${wakeDateStr}T${formData.wakeupTime}:00`,
        user: {
          userUuid: formData.user,
        },
      };

      console.log('보낼 데이터:', body);

      const response = await axios.post('/api/v1/kurung/lifeLogs/create', body);
      alert('저장 성공');
      navigate('/getLifeLogList');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  return (
    <>
      <h2 className="create-life-log-title">Life Log 작성</h2>

      <div className="create-life-log-container">
        <div className="form-group">
          <label className="date-label">Date</label>
          <input
            type="date"
            name="lifelogDate"
            value={formData.lifelogDate.split('T')[0]}
            onChange={handleDateChange}
          />
        </div>

        <label>Emotional Status</label>
        <div className="button-group">
          {emotions.map((e) => (
            <button
              key={e}
              className={formData.emotion === e ? 'selected' : ''}
              onClick={() => handleSelect('emotion', e)}
              type="button"
            >
              {e}
            </button>
          ))}
        </div>

        <label>Emotional write</label>
        <textarea
          name="emotionWrite"
          value={formData.emotionWrite}
          onChange={handleChange}
        />

        <div className="row">
          <div>
            <label>Bedtime</label>
            <input
              type="time"
              name="bedTime"
              placeholder="22:00"
              value={formData.bedTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Wake Up Time</label>
            <input
              type="time"
              name="wakeupTime"
              placeholder="07:00"
              value={formData.wakeupTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Activity</label>
        <div className="button-group">
          {['매우활동적', '활동적', '가벼운 운동', '거의 활동 없음'].map(
            (level) => (
              <button
                key={level}
                className={formData.activity === level ? 'selected' : ''}
                onClick={() => handleSelect('activity', level)}
                type="button"
              >
                {level}
              </button>
            )
          )}
        </div>

        <label>Summary</label>
        <textarea name="memo" value={formData.memo} onChange={handleChange} />

        <div className="button-bottom">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <SaveButton onClick={() => setShowSaveModal(true)} />
        </div>

        {showSaveModal && (
          <SaveModal
            message="저장하시겠습니까?"
            onConfirm={handleSubmit}
            onCancel={() => setShowSaveModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default CreateLifLogForm;
