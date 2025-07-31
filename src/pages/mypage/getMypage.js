import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/myPage/getMypage.css';
import Modal from '../../components/common/Modal';
import apiClient from '../../utils/axios';
const GetMypage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [editable, setEditable] = useState(false);
  const [bodyInfo, setBodyInfo] = useState({
    healthInfoId: '',
    height: '',
    weight: '',
    fat: '',
    muscle: '',
  });
  const [favorites, setFavorites] = useState({
    ROUTINES: [],
    FOOD: [],
    COMMUNITY: [],
  });
  const favoritesTypes = ['ROUTINES', 'FOOD', 'COMMUNITY'];

  // ✅ 추가: 활성 탭 상태
  const [activeTab, setActiveTab] = useState('ROUTINES');
  const [missions, setMissions] = useState([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  // 리마인더
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [ampm, setAmpm] = useState('오전');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');

  /** ✅ JWT에서 userUuid 추출 */
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
    } catch (e) {
      console.error('토큰 디코딩 실패:', e);
      return null;
    }
  };

  /** ✅ 건강 정보 조회 */
  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const currentDate = `${yyyy}-${mm}-${dd}T00:00:00`;

        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await apiClient.get('/healthinfo/list', {
          params: { currentDate },
          headers,
          validateStatus: (status) => status >= 200 && status < 500,
        });

        if (!response.data || response.status === 204) {
          console.warn('📭 건강정보가 없습니다.');
          return;
        }

        const result = response.data.result || response.data;
        setBodyInfo({
          healthInfoId: result.healthinfoId,
          height: result.height ? `${result.height}cm` : '',
          weight: result.weight ? `${result.weight}kg` : '',
          fat: result.bodyfatpercent != null ? `${result.bodyfatpercent}%` : '',
          muscle: result.musclemass != null ? `${result.musclemass}kg` : '',
        });
      } catch (err) {
        alert('건강정보를 불러오는데 실패했습니다.');
        console.error(
          '🔴 서버 응답 오류:',
          err.response?.status,
          err.response?.data || err.message
        );
      }
    };

    fetchHealthInfo();
  }, []);

  /** ✅ 즐겨찾기 조회 */
  useEffect(() => {
    const fetchFavorites = async () => {
      const uuid = getUserUuidFromToken();
      if (!uuid) return;

      try {
        const responses = await Promise.all(
          favoritesTypes.map((category) =>
            apiClient.get(`/favorites/list`, {
              params: { userUuid: uuid, favoritesType: category },
              headers: { Authorization: localStorage.getItem('accessToken') },
            })
          )
        );

        const newFavorites = {};
        favoritesTypes.forEach((category, idx) => {
          newFavorites[category] = responses[idx].data || [];
        });

        setFavorites(newFavorites);
      } catch (error) {
        console.error('❌ 즐겨찾기 불러오기 실패:', error);
      }
    };

    fetchFavorites();
  }, []);

  const MypageMissionCard = ({ mission }) => {
    return (
      <div className="mypage-card">
        <h4 className="mypage-card-title">{mission.title}</h4>
        <p className="mypage-card-desc">{mission.description}</p>
        <span
          className={`mypage-card-status ${mission.complete ? 'done' : 'pending'}`}
        >
          <p>{mission.complete ? '미션완료' : '미션전'}</p>
        </span>
      </div>
    );
  };

  /** ✅ 오늘의 미션 (더미 데이터) */
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await apiClient.get('/missions/today');
        console.log('✅ 마이페이지 미션 응답:', response.data);

        // response.data가 배열인지 확인
        const data = Array.isArray(response.data) ? response.data : [];

        // DTO 매핑
        const mappedData = data.map((mission) => {
          let title = '오늘의 미션';
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
        console.error('❌ 마이페이지 미션 fetch 실패:', error);
      }
    };

    fetchMissions();
  }, []);

  /** ✅ BMI 계산 */
  const calculateBMI = () => {
    const heightMeter = parseFloat(bodyInfo.height) / 100;
    const weightKg = parseFloat(bodyInfo.weight);
    if (!heightMeter || !weightKg) return 0;
    return (weightKg / (heightMeter * heightMeter)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    const value = parseFloat(bmi);
    if (value < 18.5) return '저체중';
    if (value < 23) return '정상';
    if (value < 25) return '과체중';
    return '비만';
  };

  const bmi = calculateBMI();
  const bmiStatus = getBMIStatus(bmi);

  /** ✅ 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBodyInfo((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 신체 정보 저장 */
  const handleSave = async () => {
    try {
      const userUuid = localStorage.getItem('userUuid');
      const token = localStorage.getItem('accessToken');

      const numeric = (val) =>
        parseFloat(val.toString().replace(/[^0-9.]/g, ''));

      const requestData = {
        healthinfoId: bodyInfo.healthInfoId,
        height: numeric(bodyInfo.height),
        weight: numeric(bodyInfo.weight),
        bodyfatpercent: numeric(bodyInfo.fat),
        muscle_mass: numeric(bodyInfo.muscle),
        user: { userUuid },
      };

      const response = await apiClient.post('/healthinfo/update', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('신체 정보가 성공적으로 수정되었습니다!');
        setBodyInfo({
          ...bodyInfo,
          height: `${requestData.height}cm`,
          weight: `${requestData.weight}kg`,
          fat: `${requestData.bodyfatpercent}%`,
          muscle: `${requestData.muscle_mass}kg`,
        });
        setEditable(false);
      } else {
        alert('수정에 실패했습니다. 상태 코드: ' + response.status);
      }
    } catch (err) {
      console.error('❌ 수정 실패:', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  /** ✅ 알림 시간 저장 */
  const handleSaveTime = () => {
    const timeString = `${ampm} ${hour}:${minute}`;
    console.log('설정된 알림 시간:', timeString);
    setShowTimeModal(false);
  };

  /** ✅ 캘린더 타일 */
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      return (
        <div className="calendar-day-wrapper">
          <div className="calendar-date-number">{date.getDate()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      {/* ✅ 캘린더 */}
      <section className="calendar-section">
        <h3>기록 날짜 보기</h3>
        <div className="calendar-component">
          <Calendar
            value={value}
            activeStartDate={viewDate}
            onChange={setValue}
            onActiveStartDateChange={({ activeStartDate }) =>
              setViewDate(activeStartDate)
            }
            prevLabel="〈"
            nextLabel="〉"
            locale="ko-KR"
            formatShortWeekday={(locale, date) =>
              ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
            }
            formatDay={(locale, date) => String(date.getDate())}
            showNeighboringMonth={false}
            tileContent={tileContent}
            tileDisabled={({ date, view }) =>
              date.getMonth() !== viewDate.getMonth() ||
              date.getFullYear() !== viewDate.getFullYear()
            }
          />
        </div>
      </section>

      {/* ✅ 신체 정보 */}
      <section className="body-info-section">
        <h3>기본 신체 정보</h3>
        <div className="info-row">
          <label>키</label>
          <input
            name="height"
            value={bodyInfo.height}
            onChange={handleChange}
            readOnly={!editable}
          />
          <label>체중</label>
          <input
            name="weight"
            value={bodyInfo.weight}
            onChange={handleChange}
            readOnly={!editable}
          />
        </div>
        <div className="info-row">
          <label>체지방률</label>
          <input
            name="fat"
            value={bodyInfo.fat}
            onChange={handleChange}
            readOnly={!editable}
          />
          <label>골격근량</label>
          <input
            name="muscle"
            value={bodyInfo.muscle}
            onChange={handleChange}
            readOnly={!editable}
          />
        </div>
        <div className="info-row">
          <label>BMI</label>
          <div className="bmi-wrapper">
            <input name="bmi" value={bmi} readOnly className="bmi-readonly" />
            <span className={`bmi-status ${bmiStatus}`}>{bmiStatus}</span>
          </div>
        </div>
        <div className="edit-buttons">
          {editable && (
            <button className="save-btn" onClick={handleSave}>
              저장
            </button>
          )}
          <button onClick={() => setEditable(true)}>신체 정보 수정</button>
        </div>
      </section>

      <section className="health-goal">
        <h3>나의 건강 목표</h3>
        <div className="goal-progress">
          <p>주 5회 운동</p>

          <p>
            <span className="highlight">2/5 미션</span> 달성
          </p>
        </div>
        <div className="goal-buttons">
          {/* 목표 설정 */}
          <button
            className="goal-btn"
            onClick={() => navigate('/createObjective')}
          >
            목표 설정
          </button>

          {/* 목표 수정 (동적 id 적용) */}
          <button
            className="goal-btn"
            onClick={() => navigate(`/updateObjective/1`)}
          >
            목표 수정
          </button>
        </div>
      </section>

      {/* ✅ 즐겨찾기 */}
      <section className="favorites-section">
        <h3>즐겨찾기</h3>
        <div className="favorites-tabs">
          {favoritesTypes.map((category) => (
            <button
              key={category}
              className={`favorite-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category === 'ROUTINES'
                ? '운동'
                : category === 'FOOD'
                  ? '식단'
                  : '커뮤니티'}
            </button>
          ))}
        </div>

        {/* 선택된 탭의 즐겨찾기 카드 */}
        <div className="mypage-favorites-cards">
          {favorites[activeTab] && favorites[activeTab].length > 0 ? (
            favorites[activeTab].slice(0, 3).map((item) => {
              let displayName = '';
              let imageUrl = '';

              switch (activeTab) {
                case 'ROUTINES':
                  displayName =
                    item.routinesDTO?.title ?? `ID: ${item.favoritesId}`;
                  break;
                case 'FOOD':
                  displayName =
                    item.foodDTO?.foodName ?? `ID: ${item.favoritesId}`;
                  break;
                case 'COMMUNITY':
                  displayName =
                    item.communityDTO?.title ?? `ID: ${item.favoritesId}`;
                  break;
                default:
                  displayName = `ID: ${item.favoritesId}`;
              }

              return (
                <div key={item.favoritesId} className="mypage-favorites-card">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={displayName}
                      className="card-img"
                    />
                  )}
                  <p className="card-title2">{displayName}</p>
                </div>
              );
            })
          ) : (
            <p className="empty-message">즐겨찾기 항목이 없습니다.</p>
          )}
        </div>

        <div className="move-favorites-btn-wrapper">
          <button
            className="move-favorites-btn"
            onClick={() => navigate('/favorites')}
          >
            즐겨찾기 페이지로 이동
          </button>
        </div>
      </section>

      <div className="mypage-missions-container">
        <h3 className="mypage-missions-title">오늘의 미션</h3>

        {missions.length === 0 ? (
          <p className="mypage-empty">오늘 등록된 미션이 없습니다.</p>
        ) : (
          <div className="mypage-missions-list">
            {missions.map((mission) => (
              <MypageMissionCard
                key={mission.id}
                mission={mission}
                onStatusChange={(newStatus) => {
                  // 상태 업데이트 로직 유지
                  setMissions((prev) =>
                    prev.map((m) =>
                      m.id === mission.id ? { ...m, complete: newStatus } : m
                    )
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ 리마인더 */}
      <section className="reminder-section">
        <h3>리마인더 및 알림 설정</h3>
        <p>{`${ampm} ${hour}시 ${minute}분`}</p>
        <p className="reminder-subtext" onClick={() => setShowTimeModal(true)}>
          미션 시간 알림 설정
        </p>
        <button
          className="toggle-btn"
          onClick={() => setReminderEnabled(!reminderEnabled)}
        >
          {reminderEnabled ? 'ON' : 'OFF'}
        </button>

        <div className="account-menu">
          <p onClick={() => navigate('/mypage/account')}>내 정보 관리</p>
        </div>
      </section>

      {showTimeModal && (
        <Modal onClose={() => setShowTimeModal(false)}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '20px' }}>알림 시간 설정</h4>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <select value={ampm} onChange={(e) => setAmpm(e.target.value)}>
                <option value="오전">오전</option>
                <option value="오후">오후</option>
              </select>
              <select value={hour} onChange={(e) => setHour(e.target.value)}>
                {[...Array(12)].map((_, i) => {
                  const h = String(i + 1).padStart(2, '0');
                  return (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  );
                })}
              </select>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              >
                {[...Array(60)].map((_, i) => {
                  const m = String(i).padStart(2, '0');
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
            >
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f2f2f2',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setShowTimeModal(false)}
              >
                취소
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#A5EB4D',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={handleSaveTime}
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GetMypage;
