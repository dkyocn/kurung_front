import React, { useEffect, useState } from 'react';
import '../../styles/mypage/getMypage.css';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from '../../components/common/Modal'; 
import axios from 'axios';

const GetMypage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [editable, setEditable] = useState(false);
  const [activeTab, setActiveTab] = useState('스트레스');
  const [missions, setMissions] = useState([]);
  const [bodyInfo, setBodyInfo] = useState({
    height: '170cm',
    weight: '65kg',
    fat: '25%',
    muscle: '32kg',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBodyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
  const formatUnit = (value, unit) => {
    const numeric = value.replace(/[^0-9.]/g, '');
    return numeric ? numeric + unit : '';
  };

  const formatted = {
    height: formatUnit(bodyInfo.height, 'cm'),
    weight: formatUnit(bodyInfo.weight, 'kg'),
    fat: formatUnit(bodyInfo.fat, '%'),
    muscle: formatUnit(bodyInfo.muscle, 'kg'),
  };

  setBodyInfo(formatted);
  setEditable(false);
};


const favoritesData = {
  스트레스: [
    { title: '스트레스 해소 음악', desc: '편안한 음악으로 스트레스 완화' },
    { title: '호흡 명상', desc: '5분간 깊은 호흡과 명상' },
    { title: '자연 배경 사운드', desc: '숲과 바다 소리로 안정감 제공' },
  ],
  식단: [
    { title: '단백질 위주 식단', desc: '운동 후 회복에 좋은 식단' },
    { title: '아침 건강 식단', desc: '하루를 시작하는 에너지 식단' },
    { title: '채소 중심 저염식', desc: '건강을 위한 균형 잡힌 식단' },
  ],
  운동: [
    { title: '전신 스트레칭', desc: '하루 10분 전신 이완 루틴' },
    { title: '홈트레이닝 루틴', desc: '기구 없이 하는 전신 운동' },
    { title: '코어 강화 루틴', desc: '복부 집중 루틴' },
  ]
};


useEffect(() => {
  const dummyMissions = [
    { title: '오전 운동 하기', status: '미션 전' },
    { title: '스트레스 해소 명상', status: '미션 전' },
    { title: '점심 건강 식단', status: '미션 완료' },
    { title: '습관 기록하기', status: '미션 전' },
  ];
  setMissions(dummyMissions);
}, []);

// useEffect(() => {
//   const fetchMissions = async () => {
//     try {
//       const res = await axios.get('/api/missions/today?uuid=사용자UUID');
//       setMissions(res.data); // [{ title: '', status: '' }, ...]
//     } catch (e) {
//       console.error('미션 로딩 실패:', e);
//     }
//   };

//   fetchMissions();
// }, []);


const [showTimeModal, setShowTimeModal] = useState(false);
const [reminderEnabled, setReminderEnabled] = useState(true);
const [ampm, setAmpm] = useState("오전");
const [hour, setHour] = useState("08");
const [minute, setMinute] = useState("00");

const handleSaveTime = () => {
  const timeString = `${ampm} ${hour}:${minute}`;
  console.log("설정된 알림 시간:", timeString);
  setShowTimeModal(false);
};

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {children} 
      </div>
    </div>
  );
};


  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      {/* ✅ 캘린더 영역은 그대로 유지 */}
      <section className="calendar-section">
        <h3>기록 날짜 보기</h3>
        <div className="calendar-component">
          <Calendar
            value={value}
            activeStartDate={viewDate}
            onChange={setValue}
            onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
            prevLabel="〈"
            nextLabel="〉"
            locale="ko-KR"
            formatShortWeekday={(locale, date) =>
              ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
            }
            formatDay={(locale, date) => String(date.getDate())}
            showNeighboringMonth={false}
            tileContent={tileContent}
            tileDisabled={({ date, view }) => {
              const thisMonth = viewDate.getMonth();
              const thisYear = viewDate.getFullYear();
              return (
                date.getMonth() !== thisMonth || date.getFullYear() !== thisYear
              );
            }}
          />
        </div>
      </section>

      {/* ✅ 신체 정보 수정 가능 영역 */}
      <section className="body-info-section">
  <h3>기본 신체 정보</h3>
  <div className="info-row">
    <label>키</label>
    <input
      name="height"
      value={bodyInfo.height}
      onChange={handleChange}
      readOnly={!editable}
      className="info-input"
    />
    <label>체중</label>
    <input
      name="weight"
      value={bodyInfo.weight}
      onChange={handleChange}
      readOnly={!editable}
      className="info-input"
    />
  </div>
  <div className="info-row">
    <label>체지방률</label>
    <input
      name="fat"
      value={bodyInfo.fat}
      onChange={handleChange}
      readOnly={!editable}
      className="info-input"
    />
    <label>골격근량</label>
    <input
      name="muscle"
      value={bodyInfo.muscle}
      onChange={handleChange}
      readOnly={!editable}
      className="info-input"
    />
  </div>
  <div className="info-row">
    <label>BMI</label>
    <div className="bmi-wrapper">
      <input
        name="bmi"
        value={bmi}
        readOnly
        className="info-input bmi-readonly"
      />
      <span className={`bmi-status ${bmiStatus}`}>{bmiStatus}</span>
    </div>
  </div>
  <div className="edit-buttons">
    {editable && (
      <button className="save-btn" onClick={handleSave}>저장</button>
    )}
    <button onClick={() => setEditable(true)}>신체 정보 수정</button>
  </div>
</section>


      {/* 나머지 영역 유지 */}
      <section className="favorites-section">
  <h3>즐겨찾기</h3>
  <div className="favorite-tabs">
    {['스트레스', '식단', '운동'].map((category) => (
      <button
        key={category}
        className={`favorite-tab ${activeTab === category ? 'active' : ''}`}
        onClick={() => setActiveTab(category)}
      >
        {category}
      </button>
    ))}
  </div>

  <div className="favorites">
    {favoritesData[activeTab].slice(0, 3).map((item, index) => (
      <div className="favorite-card" key={index}>
        <p className="favorite-title">{item.title}</p>
        <p className="favorite-desc">{item.desc}</p>
      </div>
    ))}
  </div>
   <div className="move-favorites-btn-wrapper">
        <button className="move-favorites-btn" onClick={() => navigate('/favorites')}>
            즐겨찾기 페이지로 이동
        </button>
    </div>
</section>

<section className="mission-section">
  <h3>오늘의 미션</h3>
  {missions.map((mission, index) => (
    <div className="mission-item" key={index}>
      <div className="mission-title">{mission.title}</div>
      <div
        className={`mission-status ${
          mission.status === '미션 완료' ? 'done' : ''
        }`}
      >
        {mission.status === '미션 완료' ? '미션 완료' : '미션 전'}
      </div>
    </div>
  ))}
</section>


<section className="reminder-section">
  <h3> 리마인더 및 알림 설정</h3>
  <p>{`${ampm} ${hour}시 ${minute}분`}</p>
  <p className="reminder-subtext" onClick={() => setShowTimeModal(true)}>
    미션 시간 알림 설정
  </p>
  <button
    className="toggle-btn"
    onClick={() => setReminderEnabled(!reminderEnabled)}
  >
    {reminderEnabled ? "ON" : "OFF"}
  </button>

  <div className="account-menu">
    <p onClick={() => navigate("/mypage/account")}>내 정보 관리</p>
    <p onClick={() => navigate("/mypage/withdraw")}>회원 탈퇴</p>
  </div>
</section>

{showTimeModal && (
  <Modal onClose={() => setShowTimeModal(false)}>
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h4 style={{ marginBottom: "20px" }}>알림 시간 설정</h4>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <select value={ampm} onChange={(e) => setAmpm(e.target.value)}>
          <option value="오전">오전</option>
          <option value="오후">오후</option>
        </select>
        <select value={hour} onChange={(e) => setHour(e.target.value)}>
          {[...Array(12)].map((_, i) => {
            const h = String(i + 1).padStart(2, "0");
            return <option key={h} value={h}>{h}</option>;
          })}
        </select>
        <select value={minute} onChange={(e) => setMinute(e.target.value)}>
          {[...Array(60)].map((_, i) => {
            const m = String(i).padStart(2, "0");
            return <option key={m} value={m}>{m}</option>;
          })}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#f2f2f2",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setShowTimeModal(false)}
        >
          취소
        </button>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#A5EB4D",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
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
