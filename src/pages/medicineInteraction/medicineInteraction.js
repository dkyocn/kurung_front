import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import aiAxios from 'axios';
import searchIcon from '../../assets/icons/search-interface-symbol.png';
import SearchModal from '../../components/common/SearchModal';
import WarningModal from '../../components/common/WarningModal';
import { useNavigate } from 'react-router-dom';

import '../../styles/medicineInteraction/medicineInteraction.css';

const MedicineInteraction = ({ userUuid }) => {
  const [inputs, setInputs] = useState(Array(6).fill(''));
  const [results, setResults] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [showMediModal, setShowMediModal] = useState(false);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [modalKeyword, setModalKeyword] = useState('');
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const navigate = useNavigate();

  // 약물 상호작용 ai용 axios 인스턴스 (수정됨)
  const interactionApi = aiAxios.create({
    baseURL: 'http://localhost:8000', // FastAPI 서버
    // headers 제거 (FormData는 자동으로 설정됨)
  });

  const getUserUuidFromToken = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('accessToken이 localStorage에 없습니다.');
        return null;
      }

      if (accessToken && accessToken.split('.').length === 3) {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        console.log('토큰에서 추출한 사용자 정보:', payload);
        return payload.userUuid;
      }
    } catch (e) {
      console.error('토큰에서 userUuid 추출 실패:', e);
    }
    return null;
  };

  useEffect(() => {
    const uuid = getUserUuidFromToken();

    if (!uuid) {
      setShowLoginWarning(true);
      return;
    }

    axios
      .get('/medicine/result')
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));

    axios
      .get('/medicine/recSupp')
      .then((res) => setSupplements(res.data))
      .catch((err) => console.error(err));
  }, [userUuid]);

  const handleChange = (idx, value) => {
    const newInputs = [...inputs];
    newInputs[idx] = value;
    setInputs(newInputs);
  };

  // ✅ 약물 선택
  const handleMediSelect = (item) => {
    setShowMediModal(false);
    if (selectedInputIndex === null) return;

    const updatedInputs = [...inputs];
    updatedInputs[selectedInputIndex] = item.nameKo;
    setInputs(updatedInputs);
  };

  // ✅ 모달 열기 (입력값 전달)
  const openModalForIndex = (idx) => {
    setSelectedInputIndex(idx);
    setModalKeyword(inputs[idx]); // 현재 input값 모달에 전달
    setShowMediModal(true);
  };

  const handleSearch = async () => {
    console.log('선택된 약물:', inputs);

    try {
      await interactionApi.post('/medicine/analyze', {
        userUuid: getUserUuidFromToken(),
        inputMediList: inputs.filter((v) => v.trim() !== ''),
      });

      const [resultRes, suppRes] = await Promise.all([
        axios.get('/medicine/result'),
        axios.get('/medicine/recSupp'),
      ]);

      setResults(resultRes.data);
      setSupplements(suppRes.data);
    } catch (err) {
      console.error('❌ 오류 발생:', err);
    }
    //     axios
    //       .get('/medicine/result')
    //       .then((res) => setResults(res.data))
    //       .catch((err) => console.error('상호작용 결과 조회 실패:', err));

    //     axios
    //       .get('/medicine/recSupp')
    //       .then((res) => setSupplements(res.data))
    //       .catch((err) => console.error('추천 영양제 조회 실패:', err));
    //   })
    //   .catch((err) => {
    //     console.error('AI 분석 및 저장 실패:', err);
    //   });
  };

  const riskColor = (risk) => {
    if (risk === '경미함') return 'mild'; // 연노랑
    if (risk === '중등도') return 'moderate'; // 연녹색
    if (risk === '심각함') return 'severe'; // 빨강
    return '';
  };

  return (
    <div className="medicine-page">
      <h2>약물 검색</h2>
      <div className="search-grid">
        {inputs.map((val, idx) => (
          <div className="search-bar" key={idx}>
            <span
              className="search-icon"
              onClick={() => openModalForIndex(idx)}
            >
              <img src={searchIcon} alt="search" />
            </span>
            <input
              type="text"
              placeholder="Search for drugs"
              value={val}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="search-button-wrapper">
        <button className="search-button" onClick={handleSearch}>
          검색하기
        </button>
      </div>
      {results.length === 0 && (
        <p className="no-interaction-result">
          조회된 약물 상호작용 결과가 없습니다.
        </p>
      )}

      {/* ✅ 상호작용 결과 */}
      {results.length > 0 && (
        <div className="interaction-section">
          <h2>약물 상호작용</h2>
          {results
            .filter((item) => item.risk === '심각함')
            .map((item, idx) => (
              <div className="warning-box" key={idx}>
                ⚠ {item.medicine1.nameKo} + {item.medicine2.nameKo} 조합은
                <strong> {item.interResult} </strong>
              </div>
            ))}
          <table className="interaction-table">
            <thead>
              <tr>
                <th>약물</th>
                <th>상호작용</th>
                <th>위험성</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    {item.medicine1.nameKo} + {item.medicine2.nameKo}
                  </td>
                  <td>{item.interResult}</td>
                  <td>
                    <span className={`risk-tag ${riskColor(item.risk)}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ 추천 영양제 */}
      {results.length > 0 && (
        <div className="supplement-section">
          <h2>영양제 추천</h2>
          <div className="supplement-cards">
            {supplements.map((supp, idx) => (
              <div className="supplement-card" key={idx}>
                <h3>{supp.nameKo}</h3>
                <p>{supp.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ 로그인 필요 시 경고 모달 */}
      {showLoginWarning && (
        <WarningModal
          message={
            <>
              로그인이 필요합니다.
              <br />
              로그인 페이지로 이동합니다.
            </>
          }
          onConfirm={() => {
            setShowLoginWarning(false);
            navigate('/loginPage');
          }}
        />
      )}

      {/* ✅ 모달 컴포넌트 연결 */}

      <SearchModal
        open={showMediModal}
        onClose={() => setShowMediModal(false)}
        api="medicine/medicines"
        onSelect={handleMediSelect}
        placeholder="Search for medicines"
        initialKeyword={modalKeyword}
        getKey={(item) => item.substanceId}
        getLabel={(item) => item.nameKo}
        getValue={(item) => item.substanceId}
      />
    </div>
  );
};

export default MedicineInteraction;
