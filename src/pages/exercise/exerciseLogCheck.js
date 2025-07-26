import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/exercise/exerciseLogCheck.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal'; // 공통 모달 import
import starIcon from '../../assets/icons/star.png';
import starFilledIcon from '../../assets/icons/starFilled.png';

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

  // 즐겨찾기 토글 함수
  const toggleFavorite = async (type, id, record) => {
    const userUuid = '2025061401';
    
    try {
      if (type === 'routine') {
        // 현재 즐겨찾기 상태 확인
        const currentRecord = recommendedRecords.find(r => r.routinesId === id);
        const isCurrentlyFavorite = currentRecord?.isFavorite || false;
        
        if (isCurrentlyFavorite) {
          // 즐겨찾기 삭제 - 즐겨찾기 ID를 찾아서 삭제
          const favoriteRecord = recommendedRecords.find(r => r.routinesId === id);
          if (favoriteRecord && favoriteRecord.favoritesId) {
            await axios.delete(`/api/v1/kurung/favorites/${favoriteRecord.favoritesId}`, {
              headers: {
                Authorization:
                  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
                RefreshToken:
                  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
              },
            });
          } else {
            console.error('즐겨찾기 ID를 찾을 수 없습니다.');
            return;
          }
        } else {
          // 즐겨찾기 추가
          const favoritesData = {
            userDTO: {
              userUuid: userUuid
            },
            routinesId: id
          };
          
          await axios.post('/api/v1/kurung/favorites/create', favoritesData, {
            headers: {
              Authorization:
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
              RefreshToken:
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
            },
          });
        }
        
        // UI 상태 업데이트
        setRecommendedRecords(prev => 
          prev.map(record => 
            record.routinesId === id 
              ? { ...record, isFavorite: !record.isFavorite }
              : record
          )
        );
        
        console.log(`${isCurrentlyFavorite ? '즐겨찾기 삭제' : '즐겨찾기 추가'} 완료`);
      }
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    }
  };

  // 데이터 불러오기
  useEffect(() => {
    const userUuid = '2025061401'; // 하드코딩

    // 내가 입력한 운동 기록
    axios.get(`/api/v1/kurung/exercise/summary/daily?date=${selectedDate}`, {
      headers: {
        Authorization:
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
        RefreshToken:
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
      },
    })
      .then(res => setMyRecords(res.data.exerciseList || []))
      .catch(() => setMyRecords([]));

    // 추천 운동 기록 (루틴)
    axios.get(`/api/v1/kurung/exercise/routines/list?date=${selectedDate}`, {
      headers: {
        Authorization:
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
        RefreshToken:
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
      },
    })
      .then(async (res) => {
        const routines = res.data || [];
        
        // 즐겨찾기 상태 불러오기
        try {
          const favoritesRes = await axios.get('/api/v1/kurung/favorites/list', {
            headers: {
              Authorization:
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
              RefreshToken:
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
            },
            params: {
              userUuid: userUuid,
              favoritesType: 'ROUTINES'
            }
          });
          
          const favorites = favoritesRes.data || [];
          const favoriteIds = favorites.map(fav => fav.routinesId).filter(id => id != null);
          
          // 루틴에 즐겨찾기 상태 추가
          const routinesWithFavorites = routines.map(routine => {
            const favoriteRecord = favorites.find(fav => fav.routinesId === routine.routinesId);
            return {
              ...routine,
              isFavorite: favoriteIds.includes(routine.routinesId),
              favoritesId: favoriteRecord ? favoriteRecord.favoritesId : null
            };
          });
          
          setRecommendedRecords(routinesWithFavorites);
        } catch (error) {
          console.error('즐겨찾기 목록 불러오기 실패:', error);
          // 즐겨찾기 불러오기 실패 시 기본 상태로 설정
          setRecommendedRecords(routines.map(routine => ({
            ...routine,
            isFavorite: false
          })));
        }
      })
      .catch(() => setRecommendedRecords([]));
  }, [selectedDate]);

  // 삭제 요청 (확인 버튼)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'routine') {
        await axios.delete(`/api/v1/kurung/exercise/routines/delete/${deleteTarget.id}`, {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
            RefreshToken:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
          },
        });
        setRecommendedRecords(prev => prev.filter(r => r.routinesId !== deleteTarget.id));
      } else if (deleteTarget.type === 'log') {
        await axios.delete(`/api/v1/kurung/exercise/log/delete/${deleteTarget.id}`, {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
            RefreshToken:
              'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
          },
        });
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
        <div className="date-input-wrapper">
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="exercise-log-check-date-input"
          />
        </div>
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
                <button
                  className="exercise-log-check-edit-btn"
                  onClick={() => navigate(`/updateExerciseLog/${log.exerciseLogsId}`)}
                >
                  수정
                </button>
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
              <div className="exercise-log-check-card-header">
                <h4>{record.title || '-'}</h4>
                <img
                  src={record.isFavorite ? starFilledIcon : starIcon}
                  alt="Favorite"
                  className="exercise-log-check-favorite-btn"
                  onClick={() => toggleFavorite('routine', record.routinesId, record)}
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
              </div>
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
