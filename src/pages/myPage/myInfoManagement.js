import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import '../../styles/myPage/myInfoManagement.css';

function MyInfoManagement() {
  const [userInfo, setUserInfo] = useState({
    id: '',
    nickname: '',
    birthDate: '',
    gender: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 사용자 정보 불러오기
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/info');
      setUserInfo({
        id: response.data.id || '',
        nickname: response.data.nickname || '',
        birthDate: response.data.birthDate || '',
        gender: response.data.gender || '',
        profileImage: response.data.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      });
    } catch (error) {
      console.error('사용자 정보 불러오기 실패:', error);
      setMessage('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 성별 선택 핸들러
  const handleGenderSelect = (gender) => {
    setUserInfo(prev => ({
      ...prev,
      gender: gender
    }));
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // FACE ID 연동 핸들러
  const handleFaceId = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/user/face-id');
      setMessage('FACE ID가 성공적으로 연동되었습니다.');
    } catch (error) {
      console.error('FACE ID 연동 실패:', error);
      setMessage('FACE ID 연동에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.put('/api/user/info', userInfo);
      setMessage('정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('정보 저장 실패:', error);
      setMessage('정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    fetchUserInfo(); // 원래 정보로 되돌리기
    setMessage('');
  };

  return (
    <div className="myinfo-outer">
      <div className="myinfo-inner">
        <div className="myinfo-box">
          <h1 className="myinfo-title">내 정보 관리</h1>
          
          {message && (
            <div className={`myinfo-message ${message.includes('성공') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="myinfo-profile-block">
            <label htmlFor="profile-image-input" className="myinfo-profile-img-container">
              <img 
                className="myinfo-profile-img" 
                src={userInfo.profileImage} 
                alt="프로필" 
              />
            </label>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: 'none' }}
            />
            <div className="myinfo-profile-label">프로필 사진 변경</div>
            <div className="myinfo-profile-desc">사진 클릭시 프로필 사진 수정</div>
          </div>

          <form className="myinfo-form" onSubmit={handleSubmit}>
            <div className="myinfo-row">
              <label className="myinfo-label">아이디</label>
              <input 
                className="myinfo-input" 
                type="text" 
                value={userInfo.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                disabled
              />
              <button 
                type="button" 
                className="myinfo-faceid-btn"
                onClick={handleFaceId}
                disabled={loading}
              >
                FACE ID
              </button>
            </div>
            
            <div className="myinfo-row">
              <label className="myinfo-label">닉네임</label>
              <input 
                className="myinfo-input" 
                type="text" 
                value={userInfo.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
            
            <div className="myinfo-row">
              <label className="myinfo-label">생년월일</label>
              <input 
                className="myinfo-input" 
                type="date" 
                value={userInfo.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
              <span className="myinfo-calendar-icon">📅</span>
            </div>
            
            <div className="myinfo-row myinfo-gender-row">
              <button 
                type="button" 
                className={`myinfo-gender-btn ${userInfo.gender === '여성' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('여성')}
              >
                여성
              </button>
              <button 
                type="button" 
                className={`myinfo-gender-btn ${userInfo.gender === '남성' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('남성')}
              >
                남성
              </button>
            </div>
          </form>
          
          <div className="myinfo-btn-row">
            <button 
              type="button" 
              className="myinfo-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="myinfo-save-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfoManagement; 