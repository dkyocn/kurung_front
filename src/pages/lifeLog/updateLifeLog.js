// src/lifeLog/UpdateLifeLog.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/lifeLog/updateLifeLog.css';
import SaveButton from '../../components/buttons/SaveButton';
import SaveModal from '../../components/common/WarningModal';
import axios from 'axios';

const UpdateLifeLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const lifelogId = params.get('lifelogId');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [formData, setFormData] = useState({
    lifelogId: '',
    lifelogDate: '',
    emotion: '',
    emotionWrite: '',
    bedTime: '',
    wakeupTime: '',
    activity: '',
    memo: '',
    llPdfPath: null,
    user: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}lifeLogs/${lifelogId}`, {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDI4NTEyfQ.lzYit7hax1CtumOjoX41I3_EoenAKbgwnLYQv4o8WcS2xj9eM7TnXuSJOEXQ60VvBJQXWFKd9fVL1VF5oNgCvQ',
            RefreshToken:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzUxMTMxMn0.lo4fYGmfKFMTm9LlKfPLq15MmEOmVAIiHFhLz7jLd-pSPzKWXXrJgFDJeQSlpLoYVrKIMcRxjT1K-hHi-9C6Dg',
          },
        });
        const data = response.data;

        const datePart = data.lifelogDate?.split('T')[0] || '';
        const bedTimePart = data.bedTime?.split('T')[1]?.slice(0, 5) || '';
        const wakeupTimePart =
          data.wakeupTime?.split('T')[1]?.slice(0, 5) || '';

        setFormData({
          ...data,
          lifelogDate: `${datePart}T00:00:00`,
          bedTime: bedTimePart,
          wakeupTime: wakeupTimePart,
        });
      } catch (err) {
        console.error('수정 페이지 조회 실패:', err);
        alert('데이터를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };

    if (lifelogId) fetchData();
  }, [lifelogId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      lifelogDate: `${selectedDate}T00:00:00`,
    }));
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const baseDate = formData.lifelogDate.split('T')[0];
      const body = {
        ...formData,
        bedTime: `${baseDate}T${formData.bedTime}:00`,
        wakeupTime: `${baseDate}T${formData.wakeupTime}:00`,
      };

      const response = await fetch('/api/v1/kurung/lifeLogs/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDI4NTEyfQ.lzYit7hax1CtumOjoX41I3_EoenAKbgwnLYQv4o8WcS2xj9eM7TnXuSJOEXQ60VvBJQXWFKd9fVL1VF5oNgCvQ',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzUxMTMxMn0.lo4fYGmfKFMTm9LlKfPLq15MmEOmVAIiHFhLz7jLd-pSPzKWXXrJgFDJeQSlpLoYVrKIMcRxjT1K-hHi-9C6Dg',
        },
        body: JSON.stringify(body),
      });
      alert('수정이 완료되었습니다.');
      navigate('/getLifeLogList');
    } catch (err) {
      console.error('수정 오류:', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <h2 className="update-life-log-title">Life Log 수정</h2>

      <div className="update-life-log-container">
        <label>Date</label>
        <input
          type="date"
          name="lifelogDate"
          value={formData.lifelogDate.split('T')[0]}
          onChange={handleDateChange}
        />

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
              type="text"
              name="bedTime"
              placeholder="22:00"
              value={formData.bedTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Wake Up Time</label>
            <input
              type="text"
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
            onClose={() => setShowSaveModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default UpdateLifeLog;
