// src/diet/diet.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/community/communityPage.css';
import Paging from '../../components/common/Paging';
import axios from '../../utils/axios';

// Import community images in order
import image0 from '../../assets/images/community/image.png';
import image1 from '../../assets/images/community/image1.png';
import image2 from '../../assets/images/community/image2.png';
import image3 from '../../assets/images/community/image3.png';
import image4 from '../../assets/images/community/image4.png';
import image5 from '../../assets/images/community/image5.png';
import image6 from '../../assets/images/community/image6.png';
import image7 from '../../assets/images/community/image7.png';
import image8 from '../../assets/images/community/image8.png';
import image9 from '../../assets/images/community/image9.png';

const COMMUNITY_IMAGES = [
  image0,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];

const TABS = ['운동', '식단', '스트레스'];
const HEALTH_TYPES = {
  운동: 'EXERCISE',
  식단: 'DIET',
  스트레스: 'STRESS',
};

export default function CommunityPage() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async (
    page = 0,
    healthType = HEALTH_TYPES[activeTab],
    searchKeyword = keyword
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + 'community/page', {
        params: {
          page: page,
          size: 15,
          healthType: healthType,
          keyword: searchKeyword || undefined,
        },
      });

      const data = response.data;
      const postsData = data.content || [];

      // 각 게시글의 favorites 리스트에서 즐겨찾기 개수 계산
      const postsWithLikes = postsData.map((post, index) => {
        const favorites = post.favorites || [];
        return {
          ...post,
          likesCount: favorites.length,
          imageIndex: index % COMMUNITY_IMAGES.length,
        };
      });

      setPosts(postsWithLikes);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('커뮤니티 게시글 불러오기 실패:', error);
      setPosts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(0, HEALTH_TYPES[activeTab]);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    fetchPosts(page - 1, HEALTH_TYPES[activeTab]); // API는 0-based, UI는 1-based
  };

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    fetchPosts(0, HEALTH_TYPES[activeTab], searchKeyword);
  };

  return (
    <div className="communityPageContainer">
      <aside className="communitySidebar">
        <ul className="communityTabList">
          {TABS.map((tab) => (
            <li
              key={tab}
              className={`communityTabItem${activeTab === tab ? ' active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>
      <main className="communityMain">
        <div className="communityHeaderRow">
          <h1 className="communityBoardTitle">Community Board</h1>
          <button
            className="communityWriteBtn"
            onClick={() => navigate(`/communityCreate`)}
          >
            작성하기
          </button>
        </div>

        {loading ? (
          <div className="communityLoading">로딩 중...</div>
        ) : (
          <>
            <div className="communityBoardGrid">
              {posts.map((post) => (
                <div
                  className="communityPostCard"
                  key={post.id}
                  onClick={() => navigate(`/community/${post.communityId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="communityPostImage">
                    <img
                      src={COMMUNITY_IMAGES[post.imageIndex]}
                      alt={post.title}
                      className="communityPostImg"
                    />
                  </div>
                  <div className="communityPostContent">
                    <div className="communityPostTitle">{post.title}</div>
                    <div className="communityPostMeta">
                      <span className="communityPostLikes">
                        {post.likesCount} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 0 && (
              <Paging
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
