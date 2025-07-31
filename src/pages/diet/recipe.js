import React, { useState, useEffect } from 'react';
import '../../styles/diet/recipe.css';
import SearchModal from '../../components/common/SearchModal';
import starIcon from '../../assets/icons/star.png';
import starFilledIcon from '../../assets/icons/starFilled.png';
import axios from '../../utils/axios';
import aiAxios from 'axios';

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
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

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

  // accessToken에서 userUuid 추출 (JWT 전용)
  const getUserUuidFromToken = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
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
        return payload.userUuid;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const aiApi = aiAxios.create({
    baseURL: 'http://localhost:8000', // FastAPI 서버
    // headers 제거 (FormData는 자동으로 설정됨)
  });

  // Fetch recommended recipes from FastAPI
  const handleRecommend = async () => {
    try {
      setRecipesLoading(true);
      const userUuid = getUserUuidFromToken();

      // Call FastAPI to get recommended meal indices
      const response = await aiApi.get('/recipe', {
        params: { user_uuid: userUuid },
      });

      const { selected_meal_indices } = response.data;

      // Fetch food details for each meal index
      const recipePromises = selected_meal_indices.map(async (mealId) => {
        try {
          const foodResponse = await axios.get(`diet/food/${mealId}`);
          const foodData = foodResponse.data;

          return {
            id: mealId,
            title: foodData.foodName || `추천 레시피 ${mealId}`,
            description:
              `총 kcal :  ${foodData.nutrition.kcal}` ||
              `추천된 레시피입니다. (ID: ${mealId})`,
            image:
              foodData.foodPhoto ||
              `https://images.unsplash.com/photo-${1500000000000 + mealId}?auto=format&fit=crop&w=400&q=80`,
          };
        } catch (error) {
          console.error(`음식 정보 조회 실패 (ID: ${mealId}):`, error);
          return {
            id: mealId,
            title: `추천 레시피 ${mealId}`,
            description: `추천된 레시피입니다. (ID: ${mealId})`,
            image: `https://images.unsplash.com/photo-${1500000000000 + mealId}?auto=format&fit=crop&w=400&q=80`,
            detail: `추천된 레시피의 상세 정보입니다. (ID: ${mealId})`,
            foodData: null,
          };
        }
      });

      const recipes = await Promise.all(recipePromises);
      setRecommendedRecipes(recipes);
    } catch (error) {
      console.error('추천 레시피 불러오기 실패:', error);
      setRecommendedRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  };

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
        {/* <div className="filterRow">
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
        </div> */}
        <div className="filterRow filterRowRight">
          <button
            className="recommendBtn"
            onClick={handleRecommend}
            disabled={recipesLoading}
          >
            {recipesLoading ? '추천 중...' : '추천'}
          </button>
        </div>
      </div>
      <div className="recommendTitle">추천 레시피</div>
      <div className="recommendRecipeList">
        {recipesLoading ? (
          <div className="loadingMessage">추천 레시피를 불러오는 중...</div>
        ) : recommendedRecipes.length > 0 ? (
          recommendedRecipes.map((recipe) => (
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
                  src={require('../../assets/images/food/PestoPasta.webp')}
                  alt={recipe.title}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="noRecipesMessage">
            추천 버튼을 눌러 레시피를 받아보세요.
          </div>
        )}
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
