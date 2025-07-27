import React, { useState, useEffect } from 'react';
import '../../styles/diet/recipe.css';
import SearchModal from '../../components/common/SearchModal';
import starIcon from '../../assets/icons/star.png';
import starFilledIcon from '../../assets/icons/starFilled.png';
import axios from '../../utils/axios';

export default function RecipePage() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedFridge, setSelectedFridge] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // recipe id array
  const [favoriteLoading, setFavoriteLoading] = useState({}); // { [id]: boolean }
  const [selectedRecipe, setSelectedRecipe] = useState(null); // recipe object or null

  const handleFoodSelect = (item) => {
    setShowFoodModal(false);
    setSelectedFoods((prev) =>
      prev.find((f) => f.foodId === item.foodId) ? prev : [...prev, item]
    );
  };
  const handleAllergySelect = (item) => {
    setShowAllergyModal(false);
    setSelectedAllergies((prev) =>
      prev.find((f) => f.allergyId === item.allergyId) ? prev : [...prev, item]
    );
  };
  const handleFridgeSelect = (item) => {
    setShowFridgeModal(false);
    setSelectedFridge((prev) =>
      prev.find((f) => f.foodId === item.foodId) ? prev : [...prev, item]
    );
  };
  const handleFoodRemove = (item) => {
    setSelectedFoods((prev) => prev.filter((f) => f.foodId !== item.foodId));
  };
  const handleAllergyRemove = (item) => {
    setSelectedAllergies((prev) =>
      prev.filter((f) => f.allergyId !== item.allergyId)
    );
  };
  const handleFridgeRemove = (item) => {
    setSelectedFridge((prev) => prev.filter((f) => f.foodId !== item.foodId));
  };

  // Example recommended recipes (replace with API data as needed)
  const recommendedRecipes = [
    {
      id: 1,
      title: '레몬 허브 로스트 치킨',
      description:
        '부드러운 닭고기와 구운 야채로 영양과 맛있고 건강한 요리입니다.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      detail:
        '레몬과 허브로 마리네이드한 닭고기를 오븐에 구워낸 건강한 요리입니다. 감자, 당근 등 다양한 야채와 함께 곁들여 드세요.',
    },
    {
      id: 2,
      title: '병아리콩과 페타 치즈를 곁들인 퀴노아 샐러드',
      description:
        '퀴노아, 병아리콩, 페타 치즈로 만든 신선하고 단백질이 풍부한 샐러드입니다.',
      image:
        'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
      detail:
        '퀴노아와 병아리콩, 페타 치즈, 각종 채소를 곁들여 만든 샐러드로, 올리브오일 드레싱과 함께 즐기세요.',
    },
    {
      id: 3,
      title: '수란을 곁들인 아보카도 토스트',
      description:
        '크리미한 아보카도와 완숙하게 삶은 계란을 곁들인 간단하면서도 영양가 있는 아침 식사.',
      image:
        'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
      detail:
        '통밀빵 위에 으깬 아보카도와 수란을 올려 소금, 후추, 올리브오일로 마무리합니다.',
    },
    {
      id: 4,
      title: '수란을 곁들인 아보카도 토스트',
      description:
        '크리미한 아보카도와 완숙하게 삶은 계란을 곁들인 간단하면서도 영양가 있는 아침 식사.',
      image:
        'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
      detail:
        '통밀빵 위에 으깬 아보카도와 수란을 올려 소금, 후추, 올리브오일로 마무리합니다.',
    },
  ];

  const toggleFavorite = async (id) => {
    if (favoriteLoading[id]) return;
    setFavoriteLoading((prev) => ({ ...prev, [id]: true }));
    try {
      if (!favoriteRecipes.includes(id)) {
        // 즐겨찾기 추가
        await axios.post(baseUrl + 'favorites/create', { recipeId: id });
        setFavoriteRecipes((prev) => [...prev, id]);
      } else {
        // 즐겨찾기 해제
        await axios.delete(baseUrl + `favorites/${id}`);
        setFavoriteRecipes((prev) => prev.filter((fid) => fid !== id));
      }
    } catch (e) {
      // 에러 처리 필요시 추가
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="recipePage">
      <h2 className="recipeTitle">Recipes for you</h2>
      <div className="filterBox">
        <div className="filterLabel">Filters</div>
        <div className="filterRow">
          <span>선호 음식 :</span>
          {selectedFoods.map((item) => (
            <span className="filterPill" key={item.foodId}>
              {item.foodName}
              <button
                className="filterPillRemove"
                onClick={() => handleFoodRemove(item)}
              >
                &times;
              </button>
            </span>
          ))}
          <button className="addBtn" onClick={() => setShowFoodModal(true)}>
            추가 <span className="addBtnPlus">+</span>
          </button>
        </div>
        <div className="filterRow">
          <span>알러지 :</span>
          {selectedAllergies.map((item) => (
            <span className="filterPill" key={item.allergyId}>
              {item.allergyName}
              <button
                className="filterPillRemove"
                onClick={() => handleAllergyRemove(item)}
              >
                &times;
              </button>
            </span>
          ))}
          <button className="addBtn" onClick={() => setShowAllergyModal(true)}>
            추가 <span className="addBtnPlus">+</span>
          </button>
        </div>
        <div className="filterRow">
          <span>냉장고 재료</span>
          <button className="uploadBtn">Upload Photo</button>
        </div>
        <div className="filterRow">
          {selectedFridge.map((item) => (
            <span className="filterPill" key={item.foodId}>
              {item.foodName}
              <button
                className="filterPillRemove"
                onClick={() => handleFridgeRemove(item)}
              >
                &times;
              </button>
            </span>
          ))}
          {selectedFridge.length > 0 && (
            <button className="addBtn" onClick={() => setShowFridgeModal(true)}>
              추가 <span className="addBtnPlus">+</span>
            </button>
          )}
        </div>
        <div className="filterRow filterRowRight">
          <button className="recommendBtn">추천</button>
        </div>
      </div>
      <div className="recommendTitle">추천 레시피</div>
      <div className="recommendRecipeList">
        {recommendedRecipes.map((recipe) => (
          <div className="recommendRecipeItem" key={recipe.id}>
            <div
              className="recommendRecipeInfo"
              onClick={() => setSelectedRecipe(recipe)}
              style={{ cursor: 'pointer' }}
            >
              <div className="recommendRecipeTitle">
                <button
                  className="recommendRecipeStarBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  aria-label="즐겨찾기"
                  disabled={favoriteLoading[recipe.id]}
                >
                  {favoriteLoading[recipe.id] ? (
                    <span className="starLoadingSpinner" />
                  ) : (
                    <img
                      src={
                        favoriteRecipes.includes(recipe.id)
                          ? starFilledIcon
                          : starIcon
                      }
                      alt="star"
                      className="recommendRecipeStarImg"
                    />
                  )}
                </button>
                {recipe.title}
              </div>
              <div className="recommendRecipeDesc">{recipe.description}</div>
            </div>
            <div
              className="recommendRecipeImgWrap"
              onClick={() => setSelectedRecipe(recipe)}
              style={{ cursor: 'pointer' }}
            >
              <img
                className="recommendRecipeImg"
                src={recipe.image}
                alt={recipe.title}
              />
            </div>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Search Modals */}
      <SearchModal
        open={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        api="diet/food"
        onSelect={handleFoodSelect}
        selected={selectedFoods}
        onRemove={handleFoodRemove}
        placeholder="Search for foods"
        itemKey="foodId"
        itemLabel="foodName"
      />
      <SearchModal
        open={showAllergyModal}
        onClose={() => setShowAllergyModal(false)}
        api="diet/allergy"
        onSelect={handleAllergySelect}
        selected={selectedAllergies}
        onRemove={handleAllergyRemove}
        placeholder="Search for allergies"
        itemKey="allergyId"
        itemLabel="allergyName"
      />
      <SearchModal
        open={showFridgeModal}
        onClose={() => setShowFridgeModal(false)}
        api="diet/food"
        onSelect={handleFridgeSelect}
        selected={selectedFridge}
        onRemove={handleFridgeRemove}
        placeholder="Search for fridge items"
        itemKey="foodId"
        itemLabel="foodName"
      />
    </div>
  );
}

function RecipeDetailModal({ recipe, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(baseUrl + `diet/food/1`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [recipe.foodId, baseUrl]);

  if (loading || !data) {
    return (
      <div className="recipeDetailModalOverlay">
        <div className="recipeDetailModalBox recipeDetailModalBoxWide">
          <button className="recipeDetailModalClose" onClick={onClose}>
            &times;
          </button>
          <div style={{ textAlign: 'center', margin: '60px 0' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Group ingredients by category
  const ingredByCategory = {};
  data.ingredList.forEach((ing) => {
    if (!ingredByCategory[ing.ingredCategory])
      ingredByCategory[ing.ingredCategory] = [];
    ingredByCategory[ing.ingredCategory].push(ing);
  });
  const categories = Object.keys(ingredByCategory);
  const maxRows = Math.max(
    ...Object.values(ingredByCategory).map((list) => list.length)
  );

  return (
    <div className="recipeDetailModalOverlay">
      <div className="recipeDetailModalBox recipeDetailModalBoxWide">
        <button className="recipeDetailModalClose" onClick={onClose}>
          &times;
        </button>
        <div className="recipeDetailModalContentRow">
          <div className="recipeDetailModalLeft">
            <div className="recipeDetailModalTitle">{data.foodName}</div>
            <img
              className="recipeDetailModalImg"
              src={require('../../assets/images/food/GrilledChicken.jpeg')}
              alt={data.foodName}
            />
          </div>
          <div className="recipeDetailModalRight">
            <div className="recipeDetailModalSectionTitle">
              재료{' '}
              <span className="recipeDetailModalSectionSub">Ingredients</span>
            </div>
            <div className="recipeDetailIngredListWrap">
              <div className="recipeDetailIngredList">
                {data.ingredList.map((ing, idx) => (
                  <div className="recipeDetailIngredItem" key={ing.ingredId}>
                    <span className="ingredNameCell">{ing.ingredName}</span>
                    {ing.ingredSub && (
                      <span className="ingredSubLabel">{ing.ingredSub}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="recipeDetailModalSectionTitle recipeDetailStepTitleLeft">
          조리순서 <span className="recipeDetailModalSectionSub">Steps</span>
        </div>
        <ol className="recipeDetailStepList recipeDetailStepListLeft">
          {data.recipeList
            .sort((a, b) => a.order - b.order)
            .map((step, idx) => (
              <li key={step.recipeId}>
                <span className="recipeDetailStepNum">{idx + 1}</span>
                <span className="recipeDetailStepContent">
                  {step.recipeContent}
                </span>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
