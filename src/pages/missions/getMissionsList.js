import React, { useEffect, useState } from 'react';
import '../../styles/missions/getMissionsList.css'; // 기존 CSS 유지

const TodayMissions = () => {
  const [missions, setMissions] = useState([]);
  const userUuid = '2025061402'; // 로그인 연동 시 교체

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    fetch("/api/v1/kurung/missions/today?userUuid=...&date=...")
      .then((res) => {
        if (!res.ok) throw new Error('미션 조회 실패');
        return res.json();
      })
      .then((data) => setMissions(data))
      .catch((err) => {
        console.error(err);
        setMissions([]);
      });
  }, []);

  return (
    <div className="mission-list-container">
      <h2>오늘의 미션</h2>
      {missions.length === 0 ? (
        <p>오늘 등록된 미션이 없습니다.</p>
      ) : (
        <ul className="mission-list">
          {missions.map((mission) => (
            <li key={mission.id} className="mission-card">
              <div className="mission-card-content">
                <div className="mission-header">
                  <strong>{mission.title}</strong>
                </div>
                <div className="mission-desc">
                  <p>{mission.description}</p>
                </div>
                <div className="mission-footer">
                  <span className="mission-status green">{mission.status}</span>
                  <span className="mission-icon">🔍 mission</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="reward-system">
        <h4>🎁 보상 시스템</h4>
        <p>습관 시작</p>
        <p>초급 1단계</p>
        <p>🎉 축하합니다! 새로운 시작을 축복합니다!</p>
        <p>오늘의 미션 진행 상황</p>
        <progress value={missions.filter(m => m.status === '미션 완료').length} max={missions.length} />
        <p>{missions.filter(m => m.status === '미션 완료').length}/{missions.length} 완료됨</p>
      </div>
    </div>
  );
};

export default TodayMissions;
