import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/community/getCommunity.css';
import axios from '../../utils/axios';
import WarningModal from '../../components/common/WarningModal';
import Modal from '../../components/common/Modal';
import ListButton from '../../components/buttons/ListButton';
import UpdateButton from '../../components/buttons/UpdateButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import starIcon from '../../assets/icons/star.png';
import starFilledIcon from '../../assets/icons/starFilled.png';
import enterIcon from '../../assets/icons/enter.png';

export default function GetCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [favoritesId, setFavoritesId] = useState(null);

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      const response = await axios.get(`${baseUrl}community/${id}`);
      const data = response.data;
      setPost(data);
      setIsAuthor(data.user.userUuid === localStorage.getItem('userId'));

      // favorites 리스트에서 즐겨찾기 개수 계산
      const favorites = data.favorites || [];
      setLikesCount(favorites.length);

      // comments 리스트에서 댓글 설정
      const comments = data.comment || [];
      setComments(comments);

      // 현재 사용자의 즐겨찾기 목록 조회하여 즐겨찾기 여부 확인
      await checkUserFavoriteStatus();

      setLoading(false);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
      setLoading(false);
    }
  };

  const checkUserFavoriteStatus = async () => {
    try {
      const response = await axios.get(`${baseUrl}favorites/list`, {
        params: { favoritesType: 'COMMUNITY' },
      });
      const userFavorites = response.data || [];

      // 현재 게시글 ID와 일치하는 즐겨찾기가 있는지 확인
      const currentPostFavorite = userFavorites.find(
        (fav) => fav.communityId === parseInt(id)
      );
      if (currentPostFavorite) {
        setIsLiked(true);
        setFavoritesId(currentPostFavorite.favoritesId);
      } else {
        setIsLiked(false);
        setFavoritesId(null);
      }
    } catch (error) {
      console.error('사용자 즐겨찾기 상태 확인 실패:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (!isLiked) {
        // 즐겨찾기 추가
        const response = await axios.post(`${baseUrl}favorites/create`, {
          communityId: parseInt(id),
        });
        setIsLiked(true);
        setFavoritesId(response.data.favoritesId);
        setLikesCount((prev) => prev + 1);
      } else {
        // 즐겨찾기 해제
        await axios.delete(`${baseUrl}favorites/${favoritesId}`);
        setIsLiked(false);
        setFavoritesId(null);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  // 댓글 추가
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${baseUrl}community/${id}/comment/create`, {
        content: newComment.trim(),
      });
      setNewComment('');
      fetchPostDetail();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`${baseUrl}community/comment/${commentId}`);
      fetchPostDetail();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}community/${id}`);
      setShowDeleteModal(false);
      navigate('/communityPage');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      setShowDeleteModal(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;

    try {
      await axios.post(`${baseUrl}community/${id}/report`, {
        reason: reportReason,
      });
      setShowReportModal(false);
      setReportReason('');
      alert('신고가 접수되었습니다.');
    } catch (error) {
      console.error('신고 실패:', error);
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      EXERCISE: '운동',
      DIET: '식단',
      STRESS: '스트레스',
    };
    return categories[category] || category;
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!post) {
    return <div className="error">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="communityDetailContainer">
      {/* Header */}
      <div className="communityDetailHeader">
        <div className="breadcrumb">
          <span>Community</span>
          <span className="separator">/</span>
          <span>{getCategoryName(post.category)}</span>
        </div>
        <div className="headerActions">
          <ListButton onClick={() => navigate('/communityPage')} />
          <button
            className="reportButton"
            onClick={() => setShowReportModal(true)}
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="postContent">
        <h1 className="postTitle">{post.title}</h1>
        <div className="postDate">
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </div>

        {post.imageUrl && (
          <div className="postImage">
            <img src={post.imageUrl} alt="게시글 이미지" />
          </div>
        )}

        <div
          className="postText"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="postEngagement">
          <div className="engagementStats">
            <button className="likeButton" onClick={handleLike}>
              <img
                src={isLiked ? starFilledIcon : starIcon}
                alt="즐겨찾기"
                className="starIcon"
              />
              <span>{likesCount}</span>
            </button>
            <div className="commentCount">
              <span className="commentIcon">💬</span>
              <span>{comments.length}</span>
            </div>
          </div>

          <div className="postActions">
            <UpdateButton onClick={() => navigate(`/updateCommunity/${id}`)} />
            <DeleteButton onClick={handleDelete} />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="commentsSection">
        <h2 className="commentsTitle">댓글</h2>

        <div className="commentsList">
          {comments.map((comment) => (
            <div key={comment.id} className="commentItem">
              <img
                src={require('../../assets/icons/profile.png')}
                alt="프로필"
                className="commentAvatar"
              />
              <div className="commentHeader">
                <div>
                  <span className="commentAuthor">
                    {comment.user?.userNick || 'Unknown'}
                  </span>
                  <div className="commentContent">{comment.content}</div>
                </div>
                {/* {comment.user?.userUuid === localStorage.getItem('userId') && (
                  <DeleteButton
                    onClick={() => handleCommentDelete(comment.id)}
                    label="삭제"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  />
                )} */}
                <DeleteButton
                  onClick={() => handleCommentDelete(comment.commentId)}
                  label="삭제"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="commentInput">
          <img
            src={require('../../assets/icons/profile.png')}
            alt="프로필"
            className="commentInputAvatar"
          />
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="commentSubmit" onClick={handleCommentSubmit}>
            <img src={enterIcon} alt="전송" className="enterIcon" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          message="정말 삭제하시겠습니까?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <WarningModal
          message={
            <div className="reportModal">
              <h3>신고하기</h3>
              <div className="reportOptions">
                <label>
                  <input
                    type="radio"
                    name="reportReason"
                    value="재미없어요"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  재미없어요
                </label>
                <label>
                  <input
                    type="radio"
                    name="reportReason"
                    value="우우 노잼"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  우우 노잼
                </label>
                <label>
                  <input
                    type="radio"
                    name="reportReason"
                    value="으엑"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  으엑
                </label>
              </div>
              <div className="reportActions">
                <button onClick={() => setShowReportModal(false)}>취소</button>
                <button onClick={handleReport}>확인</button>
              </div>
            </div>
          }
          onConfirm={handleReport}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
