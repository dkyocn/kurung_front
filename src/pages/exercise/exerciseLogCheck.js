import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/exercise/exerciseLogCheck.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal'; // 공통 모달 import

function ExerciseLogCheck() {
  // 오늘 날짜 기본값
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [myRecords, setMyRecords] = useState([]);
  const [recommendedRecords, setRecommendedRecords] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null); // {type, id}
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 데이터 불러오기
  useEffect(() => {
    const userUuid = '2025061401'; // 하드코딩

    // 내가 입력한 운동 기록
    axios.get(`/api/v1/kurung/exercise/summary/daily/${userUuid}?date=${selectedDate}`)
      .then(res => setMyRecords(res.data.exerciseList || []))
      .catch(() => setMyRecords([]));

    // 추천 운동 기록 (루틴)
    axios.get(`/api/v1/kurung/exercise/routines/list?userUuid=${userUuid}&date=${selectedDate}`)
      .then(res => setRecommendedRecords(res.data || []))
      .catch(() => setRecommendedRecords([]));
  }, [selectedDate]);

  // 삭제 요청 (확인 버튼)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'routine') {
        await axios.delete(`/api/v1/kurung/exercise/routines/delete/${deleteTarget.id}`);
        setRecommendedRecords(prev => prev.filter(r => r.routinesId !== deleteTarget.id));
      } else if (deleteTarget.type === 'log') {
        await axios.delete(`/api/v1/kurung/exercise/log/delete/${deleteTarget.id}`);
        setMyRecords(prev => prev.filter(log => log.exerciseLogsId !== deleteTarget.id));
      }
      setShowModal(false);
      setDeleteTarget(null);
      alert('삭제되었습니다!'); // 여기 알림 추가**
    } catch (e) {
      alert('삭제에 실패했습니다.');
      setShowModal(false);
      setDeleteTarget(null);
    }
  };

  // 삭제 버튼 클릭
  const openDeleteModal = (type, id) => {
    setDeleteTarget({ type, id });
    setShowModal(true);
  };

  // 취소(닫기) 버튼
  const handleModalCancel = () => {
    setShowModal(false);
    setDeleteTarget(null);
  };

  return (
    <div className="exercise-log-check-page">
      <div className="exercise-log-check-filter-section">
        <label htmlFor="date">날짜 선택:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="exercise-log-check-date-input"
        />
      </div>

      {/* 내가 입력한 운동 기록 */}
      <section className="exercise-log-check-section">
        <div className="exercise-log-check-section-header">
          <h3>내가 입력한 운동 기록</h3>
          <button className="exercise-log-check-add-btn" onClick={() => navigate('/createExerciseLog')}>운동 기록</button>
        </div>
        <p className="exercise-log-check-desc">직접 수행한 운동을 수동으로 입력하고 기록하세요.</p>
        <div className="exercise-log-check-list">
          {myRecords.length === 0 ? (
            <div style={{ color: '#bbb', padding: '18px 0 4px 12px' }}>기록이 없습니다.</div>
          ) : myRecords.map(log => (
            <div className="exercise-log-check-card" key={log.exerciseLogsId}>
              <div className="exercise-log-check-card-actions">
                <button className="exercise-log-check-edit-btn">수정</button>
                <button
                  className="exercise-log-check-delete-btn"
                  onClick={() => openDeleteModal('log', log.exerciseLogsId)}
                >삭제</button>
              </div>
              <h4>{log.exercise?.exerciseCategory || log.memo || '-'}</h4>
              <p>
                {log.exercise.exerciseName} / {log.duration}분 / 강도: {log.intensity} / 칼로리: {log.calories}kcal
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 추천 받은 운동 기록 */}
      <section className="exercise-log-check-section">
        <h3>추천 받은 운동 기록</h3>
        <p className="exercise-log-check-desc">AI가 추천한 루틴을 바탕으로 기록합니다.</p>
        <div className="exercise-log-check-list">
          {recommendedRecords.length === 0 ? (
            <div style={{ color: '#bbb', padding: '18px 0 4px 12px' }}>추천 기록이 없습니다.</div>
          ) : recommendedRecords.map(record => (
            <div className="exercise-log-check-card" key={record.routinesId}>
              <div className="routine-check-card-actions">
                <button
                  className="exercise-log-check-delete-btn"
                  onClick={() => openDeleteModal('routine', record.routinesId)}
                >삭제</button>
              </div>
              <h4>{record.title || '-'}</h4>
              <p>
                {record.routineLevel || '-'} / {record.place || '-'}
              </p>
              {record.videoUrl && (
                <button
                  className="exercise-log-check-watch-btn"
                  onClick={() => window.open(record.videoUrl, '_blank')}
                >
                  운동 시청
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 삭제 확인 모달 */}
      {showModal && (
        <Modal
          message="정말 삭제하시겠습니까?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleModalCancel}
          onClose={handleModalCancel}
        />
      )}
    </div>
  );
}

export default ExerciseLogCheck;
