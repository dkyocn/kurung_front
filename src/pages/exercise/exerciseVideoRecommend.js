import React, { useState } from 'react';
import '../../styles/exercise/exerciseVideoRecommend.css';
import apiClient from '../../utils/axios';

function ExerciseVideoRecommend() {
  const [formData, setFormData] = useState({
    gender: '',
    timeSlot: '오전 (9-12시)',
    goal: '체중 감량',
    place: '헬스장',
    health: ''
  });

  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /** ✅ 토큰에서 userUuid 추출 */
  const getUserUuidFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || token.split('.').length !== 3) {
        console.warn('🚫 유효하지 않은 토큰입니다.');
        return null;
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      console.log('토큰에서 추출한 사용자 정보:', payload);
      return payload.userUuid || null;
    } catch (e) {
      console.error('토큰에서 userUuid 추출 실패:', e);
      return null;
    }
  };

  /** ✅ 입력 변경 처리 */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  /** ✅ 추천 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender) {
      setError('성별을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideos([]);

    try {
      const response = await fetch('http://127.0.0.1:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);

      const videoData = await response.json();
      console.log('서버 응답 데이터:', videoData);

      if (Array.isArray(videoData) && videoData.length > 0) {
        setVideos(videoData);
      } else {
        setError('추천할 운동을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /** ✅ 난이도 변환 함수 (DB 제약조건 맞춤) */
  const convertDifficultyToDbLevel = (difficulty) => {
    if (!difficulty) return '중';
    const text = difficulty.toLowerCase();
    if (text.includes('상') || text.includes('high')) return '상';
    if (text.includes('중') || text.includes('mid') || text.includes('medium')) return '중';
    if (text.includes('하') || text.includes('low')) return '하';
    return '중';
  };

  /** ✅ 유튜브 영상 시청 */
  const watchVideo = (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
  };

  /** ✅ 루틴 저장 (DB 저장) */
  const saveVideo = async (index) => {
    const userUuid = getUserUuidFromToken();
    if (!userUuid) {
      alert('로그인 후 사용 가능합니다.');
      return;
    }

    const video = videos[index];
    if (!video) return;

    // 난이도 변환 후 DB 전송
    const routineLevel = convertDifficultyToDbLevel(video.difficulty);

    // DB에 필요한 최소 데이터만 전송
    const data = {
      userUuid: userUuid,
      title: video.title,
      routineLevel: routineLevel,
      place: video.location || '집',
      videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    };

    try {
      const response = await apiClient.post('exercise/routines', data); // ✅ 엔드포인트
      if (response.status === 200) {
        alert('루틴이 저장되었습니다!');
      }
    } catch (error) {
      console.error('루틴 저장 실패:', error.response || error.message);
      alert('루틴 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="exercise-video-recommend-body">
      <div className="exercise-video-recommend-container">
        <h2 className="exercise-video-recommend-title">운동 영상 추천</h2>

        <form className="exercise-video-recommend-form" onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-column">
              <div className="form-group">
                <label className="required">성별</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">성별을 선택해주세요</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>

              <div className="form-group">
                <label className="required">운동 시간대</label>
                <select id="timeSlot" value={formData.timeSlot} onChange={handleChange}>
                  <option value="오전 (9-12시)">오전 (9-12시)</option>
                  <option value="오후 (12-18시)">오후 (12-18시)</option>
                  <option value="저녁 (18-22시)">저녁 (18-22시)</option>
                  <option value="새벽 (22-6시)">새벽 (22-6시)</option>
                </select>
              </div>

              <div className="form-group">
                <label>건강 상태</label>
                <input
                  type="text"
                  id="health"
                  value={formData.health}
                  onChange={handleChange}
                  placeholder="예: 허리 통증, 관절염 등"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label className="required">운동 목표</label>
                <select id="goal" value={formData.goal} onChange={handleChange}>
                  <option value="체중 감량">체중 감량</option>
                  <option value="근육 증가">근육 증가</option>
                  <option value="건강 유지">건강 유지</option>
                  <option value="체력 향상">체력 향상</option>
                </select>
              </div>

              <div className="form-group">
                <label className="required">운동 장소</label>
                <select id="place" value={formData.place} onChange={handleChange}>
                  <option value="헬스장">헬스장</option>
                  <option value="집">집</option>
                  <option value="공원">공원</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="recommend-btn" disabled={isLoading}>
            {isLoading ? '추천 중...' : '추천 보기'}
          </button>
        </form>

        <div className="results-container">
          {error && <p className="error-message">{error}</p>}

          {videos.length > 0 && (
            <div className="videos-grid">
              {videos.map((video, index) => (
                <div key={index} className="routine-card">
                  <div className="card-header">
                    <img src={video.thumbnail} alt={video.title} className="card-thumbnail" />
                    <h3 className="card-title">{video.title}</h3>
                  </div>
                  <div className="card-content">
                    <div className="card-info">
                      <div className="info-item">시간: {video.duration}</div>
                      <div className="info-item">난이도: {video.difficulty}</div>
                      <div className="info-item">장소: {video.location}</div>
                      <div className="info-item">장비: {video.equipment}</div>
                    </div>
                    <div className="card-tags">
                      {video.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div className="card-description">{video.description}</div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-watch" onClick={() => watchVideo(video.videoId)}>
                      운동 시청
                    </button>
                    <button className="btn-save" onClick={() => saveVideo(index)}>
                      루틴 저장
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExerciseVideoRecommend;
