import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BirthDatePicker from '../../components/common/BirthDatePicker';
import apiClient from '../../utils/axios';
import '../../styles/myPage/myInfoManagement.css';

function MyInfoManagement() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [gender, setGender] = useState(''); // 성별 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [message, setMessage] = useState(''); // 메시지 상태 추가
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태 추가
  const fileInputRef = useRef(null);

  // 로그인 상태 확인 및 기존 정보 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('로그인되지 않은 상태 - 로그인 페이지로 이동');
      navigate('/loginSelect');
      return;
    }
    console.log('로그인된 상태 - 마이페이지 접근 허용');
    
    // 기존 사용자 정보 불러오기
    loadUserInfo();
  }, [navigate]);

  // 사용자 정보 불러오기
  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/user/profile');
      const userData = response.data;
      
      setNickname(userData.userNick || '');
      setBirthDate(userData.userAge ? userData.userAge.split('T')[0] : ''); // LocalDateTime을 YYYY-MM-DD 형식으로 변환
      setGender(userData.userGender || '');
      if (userData.profileImg) {
        // 백엔드 서버 주소로 이미지 URL 수정
        const imageUrl = userData.profileImg.startsWith('http') 
          ? userData.profileImg 
          : `http://localhost:8081${userData.profileImg}`;
        setProfileImage(imageUrl);
      }
      
      console.log('사용자 정보 로드 성공:', userData);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setMessage('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBirthDateClick = () => {
    setShowBirthDatePicker(true);
  };

  const handleBirthDateConfirm = (date) => {
    setBirthDate(date);
  };

  const handleBirthDateClose = () => {
    setShowBirthDatePicker(false);
  };

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택해주세요.');
        return;
      }

      // 파일 크기 검증 (5MB 이하)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 선택된 파일 저장
      setSelectedFile(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 닉네임 중복 확인 핸들러
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim().length > 20) {
      alert('닉네임은 20자 이내로 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post('/user/check-nickname', { 
        userNick: nickname.trim() 
      });
      
      if (response.data.available) {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      } else {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임 변경 시 중복 확인 상태 초기화
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
  };

  // 성별 선택 핸들러
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  // 프로필 저장 핸들러
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // 닉네임이 입력된 경우에만 중복 확인 필수
    if (nickname.trim()) {
      if (nickname.trim().length > 20) {
        alert('닉네임은 20자 이내로 입력해주세요.');
        return;
      }

      if (!isNicknameChecked) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
      }
    }

    if (!birthDate) {
      alert('생년월일을 선택해주세요.');
      return;
    }

    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

             // FormData를 사용하여 이미지와 텍스트 데이터 함께 전송
       const formData = new FormData();
       formData.append('userNick', nickname.trim());
       formData.append('userAge', birthDate + 'T00:00:00'); // YYYY-MM-DD를 LocalDateTime 형식으로 변환
       formData.append('userGender', gender);

       // 선택된 파일이 있는 경우에만 추가
       if (selectedFile) {
         formData.append('profileImg', selectedFile);
         console.log('프로필 이미지 파일 추가:', selectedFile.name);
       } else {
         // 이미지를 선택하지 않았으면 기존 이미지 URL을 전송
         const currentImageUrl = profileImage;
         if (currentImageUrl && !currentImageUrl.includes('data:')) {
           // 기존 이미지가 있고, 새로 선택한 이미지가 아닌 경우
           formData.append('existingProfileImg', currentImageUrl);
           console.log('기존 프로필 이미지 URL 유지:', currentImageUrl);
         }
       }

      console.log('프로필 저장 요청 데이터:', {
        userNick: nickname.trim(),
        userAge: birthDate + 'T00:00:00',
        userGender: gender,
        hasImage: !!selectedFile
      });

      const response = await apiClient.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('프로필 저장 응답:', response.data);

      if (response.data.success) {
        alert('프로필이 성공적으로 저장되었습니다!');
        setMessage('프로필이 성공적으로 저장되었습니다!');
        setSelectedFile(null); // 파일 선택 상태 초기화
        // 성공 후 페이지 새로고침
        window.location.reload();
      } else {
        setMessage('프로필 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      setMessage('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (window.confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
      navigate('/myPage');
    }
  };

  return (
    <div className="myinfo-outer">
      <div className="myinfo-inner">
        <div className="myinfo-box">
          <h1 className="myinfo-title">내 정보 관리</h1>
          <div className="myinfo-profile-block">
            <img 
              className="myinfo-profile-img" 
              src={profileImage} 
              alt="프로필" 
              onClick={handleProfileImageClick}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="myinfo-profile-label">프로필 사진 변경</div>
            <div className="myinfo-profile-desc">사진 클릭시 프로필 사진 수정</div>
            {selectedFile && (
                             <div className="myinfo-file-info" style={{ 
                 color: '#88C71F', 
                 fontSize: '12px', 
                 marginTop: '5px' 
               }}>
                선택된 파일: {selectedFile.name}
              </div>
            )}
          </div>
          <form className="myinfo-form" onSubmit={handleSaveProfile}>
            <div className="myinfo-row">
              <label className="myinfo-label">닉네임</label>
                             <input 
                 className="myinfo-input" 
                 type="text" 
                 value={nickname}
                 onChange={handleNicknameChange}
                 maxLength={20}
                                   placeholder="닉네임 입력 (선택사항, 20자 이내)"
                 style={{ 
                                       borderColor: nickname && !isNicknameChecked ? '#88C71F' : 
                               isNicknameChecked ? '#88C71F' : undefined 
                 }}
               />
              <button 
                type="button" 
                className="myinfo-check-btn"
                onClick={handleNicknameCheck}
                disabled={!nickname.trim()}
                style={{ 
                  marginLeft: '1px',
                  padding: '8px 12px',
                  backgroundColor: '#88C71F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: nickname.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
                               >
                                       {isNicknameChecked ? '확인됨' : '중복확인'}
                 </button>
            </div>
            <div className="myinfo-row">
              <label className="myinfo-label">생년월일</label>
              <input 
                className="myinfo-input" 
                type="text" 
                placeholder="YYYY-MM-DD" 
                value={birthDate}
                readOnly
                onClick={handleBirthDateClick}
                style={{ cursor: 'pointer' }}
              />
              <span 
                className="myinfo-calendar-icon" 
                onClick={handleBirthDateClick}
                style={{ cursor: 'pointer' }}
              >
                📅
              </span>
            </div>
            <div className="myinfo-row myinfo-gender-row">
              <button 
                type="button" 
                className="myinfo-gender-btn" 
                style={{ 
                  marginRight: '10px',
                  backgroundColor: gender === 'FEMALE' ? '#8dc63f' : '#e9ecef',
                  color: gender === 'FEMALE' ? 'white' : '#495057'
                }}
                onClick={() => handleGenderSelect('FEMALE')}
              >
                여성
              </button>
              <button 
                type="button" 
                className="myinfo-gender-btn" 
                style={{ 
                  marginLeft: '10px',
                  backgroundColor: gender === 'MALE' ? '#8dc63f' : '#e9ecef',
                  color: gender === 'MALE' ? 'white' : '#495057'
                }}
                onClick={() => handleGenderSelect('MALE')}
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
              disabled={isLoading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="myinfo-save-btn"
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
          {message && (
                         <div className="myinfo-message" style={{ 
               color: message.includes('성공') ? '#88C71F' : '#ff6b6b',
               marginTop: '10px',
               textAlign: 'center',
               fontWeight: 'bold'
             }}>
              {message}
            </div>
          )}
        </div>
      </div>
      
      {/* 생년월일 선택 모달 */}
      {showBirthDatePicker && (
        <BirthDatePicker
          onConfirm={handleBirthDateConfirm}
          onClose={handleBirthDateClose}
          initialDate={birthDate ? new Date(birthDate) : null}
        />
      )}
    </div>
  );
}

export default MyInfoManagement; 