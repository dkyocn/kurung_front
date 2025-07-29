import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/community/communityCreate.css';
import axios from '../../utils/axios';
import CreateButton from '../../components/buttons/CreateButton';
import CancleButton from '../../components/buttons/CancleButton';
import WarningModal from '../../components/common/WarningModal';

export default function CommunityCreate() {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Dynamically load jQuery and Summernote
    const loadSummernote = async () => {
      try {
        // Load jQuery
        const jQuery = await import('jquery');
        window.$ = window.jQuery = jQuery.default;

        // Load Bootstrap CSS
        await import('bootstrap/dist/css/bootstrap.min.css');

        // Load Summernote CSS and JS
        await import('summernote/dist/summernote-bs4.css');
        await import('summernote/dist/summernote-bs4');

        // Initialize Summernote after everything is loaded
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
                console.log('Summernote initialized successfully');
              },
            },
          });
        } else {
          console.error('Summernote dependencies not loaded properly');
        }
      } catch (error) {
        console.error('Summernote 로딩 실패:', error);
        // Fallback to textarea
        alert(
          '리치 텍스트 에디터 로딩에 실패했습니다. 기본 텍스트 에디터를 사용합니다.'
        );
      }
    };

    // Wait a bit for DOM to be ready
    const timer = setTimeout(() => {
      loadSummernote();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (editorRef.current && window.$ && editorReady) {
        try {
          window.$(editorRef.current).summernote('destroy');
        } catch (error) {
          console.error('Summernote 정리 실패:', error);
        }
      }
    };
  }, []);

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
      await axios.post(baseUrl + 'community/create', {
        title: title.trim(),
        content: content.trim(),
        category: category,
      });

      setModalMessage('게시글이 성공적으로 작성되었습니다.');
      setModalType('success');
      setShowModal(true);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      setModalMessage('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || (content.trim() && content !== '<p><br></p>')) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/communityPage');
      }
    } else {
      navigate('/communityPage');
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalType === 'success') {
      navigate('/communityPage');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="communityCreateContainer">
      <div className="communityCreateContent">
        <h1 className="communityCreateTitle">게시글 작성</h1>

        <div className="communityCreateForm">
          <div className="communityCreateSection">
            <label className="communityCreateLabel">Category</label>
            <select
              className="communityCreateCategorySelect"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
                defaultValue=""
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
              label={loading ? '작성 중...' : '작성 완료'}
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
    </div>
  );
}
