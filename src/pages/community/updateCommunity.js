import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/community/updateCommunity.css';
import axios from '../../utils/axios';
import CreateButton from '../../components/buttons/CreateButton';
import CancleButton from '../../components/buttons/CancleButton';
import WarningModal from '../../components/common/WarningModal';

export default function UpdateCommunity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('DIET');
  const [loading, setLoading] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' or 'error'
  const editorRef = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // 게시글 데이터 불러오기
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}community/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCategory(response.data.category || 'DIET');
      } catch (error) {
        setModalMessage('게시글 정보를 불러오지 못했습니다.');
        setModalType('error');
        setShowModal(true);
      }
    };
    fetchData();
  }, [id, baseUrl]);

  useEffect(() => {
    // Summernote 초기화
    const loadSummernote = async () => {
      try {
        const jQuery = await import('jquery');
        window.$ = window.jQuery = jQuery.default;
        await import('bootstrap/dist/css/bootstrap.min.css');
        await import('summernote/dist/summernote-bs4.css');
        await import('summernote/dist/summernote-bs4');
        if (editorRef.current && window.$ && window.$.fn.summernote) {
          window.$(editorRef.current).summernote({
            height: 400,
            lang: 'ko-KR',
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'underline', 'italic', 'clear']],
              ['fontname', ['fontname']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']],
              ['insert', ['picture', 'link', 'video']],
              ['view', ['fullscreen', 'codeview', 'help']],
            ],
            callbacks: {
              onChange: function (contents, $editable) {
                setContent(contents);
              },
              onInit: function () {
                setEditorReady(true);
                window.$(editorRef.current).summernote('code', content);
              },
            },
          });
        }
      } catch (error) {
        setModalMessage('에디터 로딩에 실패했습니다.');
        setModalType('error');
        setShowModal(true);
      }
    };
    // DOM 준비 후 에디터 로딩
    const timer = setTimeout(() => {
      loadSummernote();
    }, 200);
    return () => {
      clearTimeout(timer);
      if (editorRef.current && window.$ && editorReady) {
        try {
          window.$(editorRef.current).summernote('destroy');
        } catch (error) {}
      }
    };
    // eslint-disable-next-line
  }, [content]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setModalMessage('제목을 입력해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      setModalMessage('내용을 입력해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${baseUrl}community/update`, {
        communityId: id,
        title: title.trim(),
        content: content.trim(),
        category: category,
      });
      setModalMessage('게시글이 성공적으로 수정되었습니다.');
      setModalType('success');
      setShowModal(true);
    } catch (error) {
      setModalMessage('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate(`/community/${id}`);
  };

  const handleCancelClose = () => {
    setShowCancelModal(false);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalType === 'success') {
      navigate(`/community/${id}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="communityCreateContainer">
      <div className="communityCreateContent">
        <h1 className="communityCreateTitle">게시글 수정</h1>
        <div className="communityCreateForm">
          <div className="communityCreateSection">
            <label className="communityCreateLabel">Category</label>
            <select
              className="communityCreateCategorySelect"
              value={category}
              disabled
            >
              <option value="EXERCISE">운동</option>
              <option value="DIET">식단</option>
              <option value="STRESS">스트레스</option>
            </select>
          </div>
          <div className="communityCreateSection">
            <label className="communityCreateLabel">Title</label>
            <input
              type="text"
              className="communityCreateTitleInput"
              placeholder="제목을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="communityCreateSection">
            <label className="communityCreateLabel">Content</label>
            <div className="communityCreateEditor">
              <textarea
                ref={editorRef}
                className="communityCreateTextarea"
                placeholder="내용을 입력하세요."
                defaultValue={content}
              />
            </div>
          </div>
          <div className="communityCreateActions">
            <CancleButton
              label="작성 취소"
              onClick={handleCancel}
              disabled={loading}
            />
            <CreateButton
              label={loading ? '수정 중...' : '수정 완료'}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <WarningModal
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onClose={handleModalClose}
        />
      )}
      {showCancelModal && (
        <WarningModal
          message="작성 중인 내용이 있습니다. 정말 취소하시겠습니까?"
          onConfirm={handleCancelConfirm}
          onClose={handleCancelClose}
        />
      )}
    </div>
  );
}
