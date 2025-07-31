import React, { useState, useEffect } from 'react';
import '../../styles/missions/getMissionsList.css'; // 🔹 미션 스타일
import apiClient from '../../utils/axios';

// 🔹 JWT 토큰에서 userUuid 추출
const getUserUuidFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token || token.split('.').length !== 3) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).userUuid;
  } catch (error) {
    console.error('토큰 파싱 오류:', error);
    return null;
  }
};

const MissionStatusButton = ({ initialStatus, onChange }) => {
  const [isComplete, setIsComplete] = useState(initialStatus);

  const toggleStatus = () => {
    const newStatus = !isComplete;
    setIsComplete(newStatus);
    if (onChange) onChange(newStatus);
  };

  return (
    <button
      className={`mission-status-btn ${isComplete ? 'complete' : 'pending'}`}
      onClick={toggleStatus}
    >
      {isComplete ? '미션 완료' : '미션 전'}
    </button>
  );
};

const GetMissionsList = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [progress, setProgress] = useState(0);
  const userUuid = getUserUuidFromToken();

  // 🔹 오늘의 미션 목록 조회
  const fetchTodayMissions = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || !userUuid) {
      setLoading(false);
      return;
    }

    try {
      // ✅ 오늘의 미션 API 호출
      const response = await apiClient.get('/missions/today', {
        baseURL: 'http://localhost:8081/api/v1/kurung',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Axios 응답 성공 :', response.data);

      // ✅ API 응답 → UI용 데이터 변환
      const mappedData = (response.data || []).map((mission) => {
        let title = '오늘의 미션  ';
        let description = '설명이 없습니다.';

        if (mission.exerciseRecDTO) {
          title = '운동 미션';
          description = mission.exerciseRecDTO.exerciseTitle || '운동 미션';
        } else if (mission.dietRecDTO) {
          title = '식단 미션';
          description = mission.dietRecDTO.dietTitle || '식단 미션';
        } else if (mission.stressRecDTO) {
          title = '스트레스 미션';
          description = mission.stressRecDTO.stressTitle || '스트레스 미션';
        } else if (mission.habitRecDTO) {
          title = '습관 미션';
          description = mission.habitRecDTO.habitName || '습관 미션';
        }

        return {
          id: mission.missionId,
          title,
          description,
          complete: mission.complete || false,
        };
      });

      setMissions(mappedData);
    } catch (error) {
      console.error('❌ 오늘의 미션 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 컴포넌트 마운트 시 오늘의 미션 불러오기
  useEffect(() => {
    fetchTodayMissions();
  }, []);

  // 🔹 진행률 계산
  useEffect(() => {
    if (missions.length > 0) {
      const completedCount = missions.filter((m) => m.complete).length;
      setProgress((completedCount / missions.length) * 100);
    } else {
      setProgress(0);
    }
  }, [missions]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="missions-container">
      <h2 className="mission-title">오늘의 미션</h2>

      {missions.length === 0 ? (
        <p className="empty-message">오늘 등록된 미션이 없습니다.</p>
      ) : (
        <>
          <div className="missions-list">
            {missions.map((mission) => (
              <div key={mission.id} className="mission-card">
                <div className="mission-info">
                  <h3 className="mission-subtitle">{mission.title}</h3>
                  <p className="mission-description">{mission.description}</p>

                  <MissionStatusButton
                    initialStatus={mission.complete}
                    onChange={(newStatus) => {
                      // 프론트 상태 변경
                      setMissions((prev) =>
                        prev.map((m) =>
                          m.id === mission.id ? { ...m, complete: newStatus } : m
                        )
                      );

                      // 필요시 백엔드 상태 업데이트 API 호출 추가
                      console.log(`미션 ${mission.id} 상태 변경:`, newStatus);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ✅ 진행률 표시 */}
          <div className="bonus-section">
            <p className="bonus-subtitle">축하합니다! 새로운 배지를 획득했어요!</p>
            <p className="bonus-progress-text">
              오늘의 미션 진행 상황 {missions.filter((m) => m.complete).length}/
              {missions.length} 완료됨
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="bonus-percentage">{Math.round(progress)}% 완료</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GetMissionsList;
