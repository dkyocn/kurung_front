import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/myPage/withdrawal.css';
import WithdrawalModal from '../../components/common/WithdrawalModal';

function Withdrawal() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('사용 빈도가 낮음');
  const [customReason, setCustomReason] = useState('');
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('로그인되지 않은 상태 - 로그인 페이지로 이동');
      navigate('/loginSelect');
      return;
    }
    console.log('로그인된 상태 - 회원탈퇴 페이지 접근 허용');
  }, [navigate]);

  const reasons = [
    '사용 빈도가 낮음',
    '불편한 UI/기능 부족',
    '원하는 기능이 없음',
    '다른 앱 사용 예정',
    '기타',
  ];

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="withdrawal-box">
          <h1 className="withdrawal-title">회원 탈퇴</h1>
          <div className="withdrawal-warning-block">
            <div className="withdrawal-warning-main">
              <span className="withdrawal-warning-ask">정말 탈퇴하시겠어요? <span className="withdrawal-emoji">🥺</span></span>
              <div className="withdrawal-warning-desc">
                <strong>탈퇴 처리 전 <span className="withdrawal-warning-must">반드시</span> 확인해 주세요.</strong>
              </div>
            </div>
            <ul className="withdrawal-warning-list">
              <li>탈퇴와 함께 회원님의 모든 개인정보 및 서비스 이용 기록이 <span className="withdrawal-warning-red">즉시 삭제</span>되며,</li>
              <li>삭제된 정보는 <span className="withdrawal-warning-red">복구가 불가능</span>합니다.</li>
              <li>작성하신 게시글, 댓글 등 일부 콘텐츠는 탈퇴 이후에도 <span className="withdrawal-warning-red">삭제되지 않을 수 있습니다.</span></li>
              <li>추후 동일한 이메일(ID)로 재가입하셔도 <span className="withdrawal-warning-red">기존 정보는 복구되지 않습니다.</span></li>
            </ul>
          </div>
          <div className="withdrawal-delete-list-block">
            <div className="withdrawal-delete-title">탈퇴 시 삭제되는 항목</div>
            <ul className="withdrawal-delete-list">
              <li>마이페이지 개인 정보</li>
              <li>운동 기록 전체 (루틴, 이력, 추천 반영 포함)</li>
              <li>건강 목표 설정값</li>
              <li>감정 기록 및 요약</li>
              <li>즐겨찾기 저장 항목</li>
            </ul>
          </div>
          <form className="withdrawal-form">
            <div className="withdrawal-reason-title">탈퇴 사유를 선택해 주세요</div>
            <div className="withdrawal-reason-list">
              {reasons.map((r) => (
                <label key={r} className={`withdrawal-reason-option${reason === r ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="withdrawal-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <textarea
              className="withdrawal-reason-textarea"
              placeholder="(선택) 탈퇴 사유를 입력해 주세요."
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
            />
            <div className="withdrawal-agree-block">
              <label className="withdrawal-agree-label">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                />
                <span>위 내용을 모두 확인하였으며, 탈퇴 후 모든 정보가 삭제되는 것에 동의합니다.</span>
              </label>
            </div>
            <div className="withdrawal-password-block">
              <label className="withdrawal-password-label">현재 비밀번호 입력</label>
              <input
                className="withdrawal-password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요."
              />
            </div>
            <div className="withdrawal-btn-row">
              <button 
                className="withdrawal-cancel-btn" 
                type="button"
                onClick={() => navigate('/myInfoManagement')}
              >
                취소
              </button>
              <button 
                className="withdrawal-submit-btn" 
                type="button"
                onClick={() => setShowWithdrawalModal(true)}
              >
                회원 탈퇴
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawalModal && (
        <WithdrawalModal
          onConfirm={() => {
            // 여기에 실제 탈퇴 로직 추가
            console.log('회원탈퇴 처리:', { reason, customReason, password });
            setShowWithdrawalModal(false);
            // API 호출 후 페이지 이동 등
          }}
          onCancel={() => setShowWithdrawalModal(false)}
          onClose={() => setShowWithdrawalModal(false)}
        />
      )}
    </div>
  );
}

export default Withdrawal; 