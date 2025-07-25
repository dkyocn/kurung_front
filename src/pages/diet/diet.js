// src/diet/diet.js

import React, { useState, useRef, useEffect } from 'react';
import '../../styles/diet/diet.css';
import calenderIcon from '../../assets/icons/calendar.png';
import searchIcon from '../../assets/icons/search-interface-symbol.png';
import starIcon from '../../assets/icons/star.png';
import starFilledIcon from '../../assets/icons/starFilled.png';
import SaveButton from '../../components/buttons/SaveButton';
import SaveModal from '../../components/common/Modal';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const DietForm = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const timeZone = 3240 * 10000;

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('BREAKFAST');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [dietDTO, setDietDTO] = useState(null);

  // 현재 날짜로 동적 초기화
  const today = new Date();
  const initialDate = `${today.getFullYear() % 100}.${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}.${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
  const [date, setDate] = useState(initialDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const dateRef = useRef(null);

  const daysInMonth = new Date(
    displayDate.getFullYear(),
    displayDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    displayDate.getFullYear(),
    displayDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = async (day) => {
    const selectedYear = displayDate.getFullYear();
    const selectedMonth = displayDate.getMonth() + 1;
    const selectedDay = day;
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    console.info('newDate : ' + newDate);
    setCurrentDate(newDate);
    const selectedDate = `${selectedYear % 100}.${selectedMonth < 10 ? '0' : ''}${selectedMonth}.${day < 10 ? '0' : ''}${day}`;
    setDate(selectedDate);
    setIsCalendarOpen(false);
    console.info('currentDate : ' + currentDate);
    fetchDietData(newDate, activeTab);
    fetchTodayNutrition(newDate);
    setSelectedFood(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moveMonth = (offset) => {
    setDisplayDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + offset);
      return new Date(newDate);
    });
  };

  const moveYear = (offset) => {
    setDisplayDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(prevDate.getFullYear() + offset);
      return new Date(newDate);
    });
  };

  const handleDayClick = (day) => {
    handleDateSelect(day);
    setSelectedDay(day);
  };

  // DTO를 초기화하거나 업데이트하는 함수 예시
  const initializeDietDTO = (data) => {
    console.info('DTO 생성 : ' + data.dietId);
    setDietDTO({
      dietId: data?.dietId || null,
      dietDate: data?.dietDate || '',
      foodList: data?.foodList || foods,
    });
  };

  // API 호출 함수
  const fetchDietData = async (date, meal) => {
    try {
      const response = await axios.get(baseUrl + 'diet', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
        params: {
          currentDate: new Date(+date + timeZone).toISOString().split('.')[0],
          meal: meal,
        },
      });
      const data = response.data;
      if (data && data.foodList) {
        initializeDietDTO(data);
        setFoods(
          data.foodList.map((food) => ({
            ...food,
            isFavorite: false, // 즐겨찾기 상태 추가
          }))
        );
      } else {
        setFoods([]);
      }
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
      setFoods([]);
    }
  };

  // 오늘의 영양 데이터 가져오기
  const fetchTodayNutrition = async (date) => {
    try {
      const response = await axios.get(baseUrl + 'diet/today', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
        params: {
          currentDate: new Date(+date + timeZone).toISOString().split('.')[0],
        },
      });
      const data = response.data;
      if (data) {
        setTodayNutrition(data);
      }
      console.log('Today Nutrition API Response:', response.data);
    } catch (error) {
      console.error('Today Nutrition API Error:', error);
      setTodayNutrition(null);
    }
  };

  const addFoodApi = async (searchInput) => {
    try {
      const response = await axios.get(baseUrl + 'diet/food', {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
        params: {
          keyword: searchInput,
        },
      });
      const data = response.data;
      if (data) {
        setSearchFood(data);
      } else {
        setSearchFood([]);
      }
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
      setSearchFood([]);
    }
  };

  const updateFoodApi = async () => {
    try {
      const response = await axios.post(baseUrl + 'diet/update', dietDTO, {
        headers: {
          Authorization:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJuYW1lIjoi7Iah66-87IScIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzUzNDA2ODg5fQ.5ZYVum2-jopUE8h4jC784qTsKYMd8M3OSjCjDLkjCbKoCgBIr2VpAfiiqICMcTCfxQLr0B2bCb0oXwQgFN50Xw',
          RefreshToken:
            'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0ajA0NTBAZ21haWwuY29tIiwidXNlclV1aWQiOiIyMDI1MDYxNDAxIiwiY2F0ZWdvcnkiOiJyZWZyZXNoIiwibmFtZSI6IuyGoeuvvOyEnCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc1MzQ4OTY4OX0.dxeRiuXKqvnt2QkalIKZX2cUpKg8-KwI9uCfrbYFGnQBtDsCqlxe5OpN9fA1OCnppv8o2rKq_tviWJSBQlH5nw',
        },
      });
    } catch (error) {
      console.error('UPDATE Error:', error);
    }
  };

  // 날짜 또는 카테고리 변경 시 API 호출
  useEffect(() => {
    fetchDietData(currentDate, activeTab);
    fetchTodayNutrition(currentDate);
  }, [activeTab]);

  // 음식 상태 관리
  const [searchFood, setSearchFood] = useState([]);
  const [foods, setFoods] = useState([]);
  const [totalFoods, setTotalFoods] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [todayNutrition, setTodayNutrition] = useState(null);

  // 음식 추가 함수
  const addFood = (newFood) => {
    const addedFood = {
      foodId: newFood.foodId,
      foodName: newFood.foodName,
      foodPhoto: newFood.foodPhoto,
      ingredList: newFood.ingredList,
      recipeList: newFood.recipeList,
      nutrition: newFood.nutrition,
      isFavorite: false,
    };

    // 새로운 foods 배열 생성
    const updatedFoods = [...foods, addedFood];

    // foods 상태 업데이트
    setFoods(updatedFoods);

    // dietDTO의 foodList에 updatedFoods 반영
    setDietDTO((prev) => ({
      ...prev,
      foodList: updatedFoods,
    }));

    // 검색 입력 초기화
    setSearchInput('');
  };

  // 즐겨찾기 토글
  const toggleFavorite = (index) => {
    setFoods(
      foods.map((food, i) => ({
        ...food,
        isFavorite: i === index ? !food.isFavorite : food.isFavorite,
      }))
    );
  };

  // 음식 삭제
  const deleteFood = (foodId) => {
    const updatedFoods = foods.filter((food) => food.foodId !== foodId);
    setFoods(updatedFoods);
    setDietDTO((prev) => ({
      ...prev,
      foodList: updatedFoods,
    }));
  };

  // 음식 클릭 시 영양 성분 업데이트
  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  // 선택된 음식을 처리하는 함수 (예: nutritional에 반영)
  const handleFoodSelect = (food) => {
    addFood(food); // 이전에 정의된 selectedFood 상태 업데이트
    setSearchInput(''); // 검색 입력 초기화
    setSearchFood([]); // 검색 결과 숨김
  };

  // useEffect로 초기 상태 관리 (필요 시)
  useEffect(() => {
    if (searchInput === '') {
      setSearchFood([]); // 입력이 비어있으면 결과 숨김
    }
  }, [searchInput]);

  // dietDTO 변경 시 디버깅
  useEffect(() => {
    console.log('업데이트된 dietDTO:', dietDTO);
  }, [dietDTO]);

  // foods 변경 시 디버깅
  useEffect(() => {
    console.log('업데이트된 foods:', foods);
    if (dietDTO && dietDTO.foodList.length > 0) {
      updateFoodApi();
    }
  }, [foods]);

  // Helper to get 목표 섭취량 (API에서 받아온 값 사용)
  const getGoalNutrition = () => {
    if (!todayNutrition) return [];
    return [
      {
        key: 'sodium',
        label: '나트륨',
        value: todayNutrition.objectiveSodium || 0,
        unit: '%',
      },
      {
        key: 'carb',
        label: '탄수화물',
        value: todayNutrition.objectiveCarb || 0,
        unit: '%',
      },
      {
        key: 'totalFat',
        label: '지방',
        value: todayNutrition.objectiveFat || 0,
        unit: '%',
      },
      {
        key: 'protein',
        label: '단백질',
        value: todayNutrition.objectiveProtein || 0,
        unit: '%',
      },
    ];
  };

  // Helper to get 일일 영양 섭취량 (API에서 받아온 값 사용)
  const getDailyNutritionData = () => {
    if (!todayNutrition) return [];
    const fields = [
      { key: 'sodium', label: '나트륨', unit: 'mg' },
      { key: 'carb', label: '탄수화물', unit: 'g' },
      { key: 'sugar', label: '당류', unit: 'g' },
      { key: 'totalFat', label: '지방', unit: 'g' },
      { key: 'transFat', label: '트랜스지방', unit: 'g' },
      { key: 'saturatedFat', label: '포화지방', unit: 'g' },
      { key: 'cholesterol', label: '콜레스테롤', unit: 'mg' },
      { key: 'protein', label: '단백질', unit: 'g' },
    ];
    return fields.map(({ key, label, unit }) => ({
      name: label,
      value: todayNutrition[key] || 0,
      unit,
    }));
  };

  // Helper to get 목표 섭취량 평균 (objective 값만 평균)
  const getGoalAveragePercent = () => {
    if (!todayNutrition) return 0;
    const values = [
      todayNutrition.objectiveSodium,
      todayNutrition.objectiveCarb,
      todayNutrition.objectiveFat,
      todayNutrition.objectiveProtein,
    ];
    const filtered = values.filter((v) => typeof v === 'number' && !isNaN(v));
    if (filtered.length === 0) return 0;
    const avg = filtered.reduce((a, b) => a + b, 0) / filtered.length;
    return avg.toFixed(1);
  };

  // Helper to check if data exists
  const hasGoalData = () => {
    if (!todayNutrition) return false;
    const goalValues = [
      todayNutrition.objectiveSodium,
      todayNutrition.objectiveCarb,
      todayNutrition.objectiveFat,
      todayNutrition.objectiveProtein,
    ];
    return goalValues.some((value) => value && value > 0);
  };

  const hasDailyData = () => {
    if (!todayNutrition) return false;
    const dailyValues = [
      todayNutrition.sodium,
      todayNutrition.carb,
      todayNutrition.sugar,
      todayNutrition.totalFat,
      todayNutrition.transFat,
      todayNutrition.saturatedFat,
      todayNutrition.cholesterol,
      todayNutrition.protein,
    ];
    return dailyValues.some((value) => value && value > 0);
  };

  // 목표 섭취량 BarChart (세로)
  const GoalBarChart = React.memo(() => {
    const goalData = getGoalNutrition();
    return (
      <div className="goalBarChartContainer">
        <BarChart width={320} height={140} data={goalData} barCategoryGap={30}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 15, fill: '#758566' }}
          />
          <YAxis hide />
          <Tooltip formatter={(value, name, props) => `${value} %`} />
          <Bar
            dataKey="value"
            fill="#758566"
            barSize={32}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </div>
    );
  });

  // 일일 영양 섭취량 BarChart (가로)
  const DailyNutritionBarChart = React.memo(() => {
    const data = getDailyNutritionData();
    // 단위 지정: 나트륨, 콜레스테롤만 mg, 나머지는 g
    const getUnit = (name) =>
      name === '나트륨' || name === '콜레스테롤' ? 'mg' : 'g';
    return (
      <div className="dailyBarChartContainer">
        <BarChart
          layout="vertical"
          width={600}
          height={260}
          data={data}
          barCategoryGap={16}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 15, fill: '#758566' }}
            width={90}
          />
          <Tooltip
            formatter={(value, name, props) => `${value} ${getUnit(name)}`}
          />
          <Bar
            dataKey="value"
            fill="#758566"
            barSize={18}
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </div>
    );
  });

  return (
    <div className="dietPage">
      <div className="dietLogs">
        <h1 className="dietLogsHeader">식단 기록</h1>
        <div className="date-container" ref={dateRef}>
          <input
            type="text"
            className="date-input"
            value={date}
            style={{ textAlign: 'start' }}
          />
          <span className="calendar-icon" onClick={toggleCalendar}>
            <img src={calenderIcon} />
          </span>
          <div className={`calendar-popup ${isCalendarOpen ? 'active' : ''}`}>
            <div className="calendar-header">
              <button onClick={() => moveYear(-1)}>&lt;&lt;</button>
              <button onClick={() => moveMonth(-1)}>&lt;</button>
              <span>
                {displayDate.getFullYear()}
                {'년 '}
                {displayDate.toLocaleString('default', { month: 'long' })}
              </span>
              <button onClick={() => moveMonth(1)}>&gt;</button>
              <button onClick={() => moveYear(1)}>&gt;&gt;</button>
            </div>
            <div className="calendar-grid">
              {dayNames.map((day) => (
                <div key={day} className="calendar-day">
                  {day.slice(0, 3)}
                </div>
              ))}
              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day"></div>
                ))}
              {days.map((day) => (
                <div
                  key={day}
                  className={`calendar-day ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'today' : ''}`}
                  onClick={() => handleDateSelect(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="tab-menu">
          <button
            className={`tab ${activeTab === 'BREAKFAST' ? 'active' : ''}`}
            onClick={() => (setActiveTab('BREAKFAST'), setSelectedFood(null))}
          >
            Breakfast
          </button>
          <button
            className={`tab ${activeTab === 'LUNCH' ? 'active' : ''}`}
            onClick={() => (setActiveTab('LUNCH'), setSelectedFood(null))}
          >
            Lunch
          </button>
          <button
            className={`tab ${activeTab === 'DINNER' ? 'active' : ''}`}
            onClick={() => (setActiveTab('DINNER'), setSelectedFood(null))}
          >
            Dinner
          </button>
        </div>
        <div className="search-bar">
          <span className="search-icon">
            <img src={searchIcon} onClick={() => addFoodApi(searchInput)} />
          </span>
          <input
            type="text"
            placeholder="Search for food"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              addFoodApi(e.target.value);
            }}
          />
        </div>
        <div className="search-results">
          {searchInput !== '' &&
            searchFood.length > 0 &&
            searchFood.map((food, index) => (
              <div
                key={food.foodId || index}
                className="search-result-item"
                onClick={() => handleFoodSelect(food)}
              >
                <span>{food.foodName}</span>
                <span>
                  {food.nutrition ? `${food.nutrition.kcal} kcal` : 'N/A'}
                </span>
              </div>
            ))}
        </div>
        <div className="food-cards">
          {foods.map((food, index) => (
            <div
              key={food.foodId}
              className="food-card"
              onClick={() => handleFoodClick(food)} // 음식 클릭 이벤트 추가
              style={{ cursor: 'pointer' }}
            >
              <img
                src={require('../../assets/images/food/GrilledChicken.jpeg')}
                alt={food.foodName}
                className="food-image"
              />
              <button className="delete-btn" onClick={() => deleteFood(index)}>
                X
              </button>
              <div className="food-details">
                <div className="food-bottom">
                  <span className="food-name">{food.foodName}</span>
                  <img
                    src={food.isFavorite ? starFilledIcon : starIcon}
                    alt="Favorite"
                    className="favorite-btn"
                    onClick={() => toggleFavorite(index)}
                  />
                </div>
                <span className="food-calories">
                  {food.nutrition
                    ? `${food.nutrition.kcal} kcal(${food.nutrition.gram}g)`
                    : 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="dietSaveButton">
          <SaveButton onClick={() => setShowSaveModal(true)} />
          {showSaveModal && (
            <SaveModal
              message="식단을 저장하시겠습니까?"
              onConfirm={null}
              onCancel={() => setShowSaveModal(false)}
            />
          )}
        </div>
        {/* 오늘의 한줄 평 */}
        {/* <div className="todayComment">{todayNutrition.comment}</div> */}
        <div className="todayComment">
          오늘의 한줄: 아침 식사는 균형이 잡혀 있으며 탄수화물, 단백질, 건강에
          좋은 지방이 적절히 혼합되어있어요.
        </div>
        {/* 목표 섭취량 */}
        {todayNutrition && hasGoalData() && (
          <div className="goalSection">
            <div className="goalTitle">목표 섭취량</div>
            <div className="goalPercent">{getGoalAveragePercent()}%</div>
            <GoalBarChart />
          </div>
        )}
        {/* 일일 영양 섭취량 */}
        {todayNutrition && hasDailyData() && (
          <div className="dailySection">
            <div className="dailyTitle">일일 영양 섭취량</div>
            <DailyNutritionBarChart />
          </div>
        )}
      </div>
      <div className="nutritional">
        <h3 className="nutritionalHead">영양 성분</h3>
        {selectedFood ? (
          <div className="nutrition-details">
            <div className="nutrition-column">
              <p className="nutrition-column-title">음식 이름</p>
              <p>{selectedFood.foodName}</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">총 내용량</p>
              <p>{selectedFood.foodName}</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">총 kcal</p>
              <p>{selectedFood.nutrition.kcal} kcal</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">나트륨</p>
              <p>{selectedFood.nutrition.sodium} mg</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">탄수화물</p>
              <p>{selectedFood.nutrition.carb} g</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">당류</p>
              <p>{selectedFood.nutrition.sugar} g</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">지방</p>
              <p>{selectedFood.nutrition.totalFat} g</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">트랜스지방</p>
              <p>{selectedFood.nutrition.transFat} g</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">포화지방</p>
              <p>{selectedFood.nutrition.saturatedFat} g</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">콜레스테롤</p>
              <p>{selectedFood.nutrition.cholesterol} mg</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">단백질</p>
              <p>{selectedFood.nutrition.protein} g</p>
            </div>
          </div>
        ) : (
          <div className="nutrition-details">
            <div className="nutrition-column">
              <p className="nutrition-column-title">음식 이름</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">총 내용량</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">총 kcal</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">나트륨</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">탄수화물</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">당류</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">지방</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">트랜스지방</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">포화지방</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">콜레스테롤</p>
            </div>
            <div className="nutrition-column">
              <p className="nutrition-column-title">단백질</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietForm;
