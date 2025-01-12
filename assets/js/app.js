// HTML 요소 가져오기
const ingredientsList = document.getElementById("ingredients-list");
const addIngredientButton = document.getElementById("add-ingredient");
const calculateButton = document.getElementById("calculate-recipe");
const saveNewRecipeButton = document.getElementById("save-new-recipe");
const saveDirectRecipeButton = document.getElementById("save-btn"); // 새 저장 버튼
const recipeSelect = document.getElementById("recipe-select");
const resultModal = document.getElementById("modalResult");
const resultModalContent = document.getElementById("calculated-result"); // 모달 내 결과 컨텐츠를 담을 div

// 모달 관련 요소 가져오기
const openModalButton = document.getElementById("open-modal");
const closeModalButton = document.getElementById("close-recipe-modal");
const recipeModal = document.getElementById("modalAdd");
const modalIngredientsList = document.getElementById("modal-ingredients-list");
const modalAddIngredientButton = document.getElementById("modal-add-ingredient");
const recipeNameInput = document.getElementById("recipe-name");
const closeResultModalButton = document.getElementById("close-result-modal"); // 모달 닫기 버튼

// ** 공통된 닫기 버튼 관리 **
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("c-btn__close")) {
    const modals = document.querySelectorAll(".modal-wrap");
    modals.forEach((modal) => {
      modal.style.display = "none"; // 모든 모달 닫기
    });
  }
});

// ** 새 레시피 추가 모달 열기 **
openModalButton.addEventListener("click", () => {
  recipeModal.style.display = "block"; // 새 레시피 모달 열기
});

// ** 공통된 재료 삭제 함수 **
function handleDeleteButton(button, ingredientList) {
  button.addEventListener("click", () => {
    if (ingredientList.children.length > 1) {
      button.parentElement.remove(); // 재료 삭제
    } else {
      // alert("최소한 하나의 재료는 남겨야 합니다.");
    }
  });
}

// ** 공통된 재료 추가 및 삭제 함수 **
function handleIngredient(ingredientList) {
  const newGroup = document.createElement("div");
  newGroup.className = "p-main__item-input";
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="c-input__item name">
    <input type="text" placeholder="양" class="c-input__item amount">
    <button class="c-btn__delete"></button>
  `;
  ingredientList.appendChild(newGroup);

  const deleteButton = newGroup.querySelector(".c-btn__delete");
  handleDeleteButton(deleteButton, ingredientList); // 삭제 버튼에 이벤트 리스너 추가
}

// ** 공통된 재료 데이터 추출 함수 **
function extractIngredients(ingredientList) {
  return Array.from(ingredientList.querySelectorAll(".p-main__item-input"))
    .map((group) => {
      const name = group.querySelector(".name").value.trim();
      const amountText = group.querySelector(".amount").value.trim();
      const unit = amountText.replace(/[0-9.]/g, "").trim();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ""));
      return { name, amount, unit };
    })
    .filter((ingredient) => ingredient.name && !isNaN(ingredient.amount));
}

// ** 공통된 레시피 저장 함수 **
function saveRecipe(recipeName, ingredients) {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
  savedRecipes[recipeName] = { ingredients };
  localStorage.setItem("recipes", JSON.stringify(savedRecipes));
  alert(`${recipeName} 레시피가 저장되었습니다!`);
  updateRecipeList();
}

// ** 레시피 목록 업데이트 함수 **
function updateRecipeList() {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
  const options = recipeSelect.querySelectorAll("option");

  options.forEach((option) => {
    if (option.value !== "") option.remove(); // 기존 레시피 옵션 삭제
  });

  for (const recipeName in savedRecipes) {
    const option = document.createElement("option");
    option.value = recipeName;
    option.textContent = recipeName;
    recipeSelect.appendChild(option);
  }
}

// 페이지 로드 시 레시피 목록 업데이트
window.onload = updateRecipeList;

// ** 레시피 선택 시 재료 불러오기 **
recipeSelect.addEventListener("change", () => {
  const selectedRecipeName = recipeSelect.value;
  if (!selectedRecipeName) {
    resetIngredients();
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem("recipes"));
  const recipe = savedRecipes[selectedRecipeName];

  ingredientsList.innerHTML = "";
  recipe.ingredients.forEach((ingredient) => {
    const newGroup = document.createElement("div");
    newGroup.className = "p-main__item-input";
    newGroup.innerHTML = `
      <input type="text" value="${ingredient.name}" class="c-input__item name">
      <input type="text" value="${ingredient.amount}${ingredient.unit}" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    `;
    ingredientsList.appendChild(newGroup);

    const deleteButton = newGroup.querySelector(".c-btn__delete");
    handleDeleteButton(deleteButton, ingredientsList); // 삭제 버튼에 이벤트 리스너 추가
  });
});

// ** 초기 상태로 리셋하는 함수 (재료 입력창 4개) **
function resetIngredients() {
  ingredientsList.innerHTML = `
    <div class="p-main__item-input">
      <input type="text" placeholder="밀가루" class="c-input__item name">
      <input type="text" placeholder="100g" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    </div>
    <div class="p-main__item-input">
      <input type="text" placeholder="우유" class="c-input__item name">
      <input type="text" placeholder="100ml" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    </div>
    <div class="p-main__item-input">
      <input type="text" placeholder="설탕" class="c-input__item name">
      <input type="text" placeholder="100g" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    </div>
    <div class="p-main__item-input">
      <input type="text" placeholder="계란" class="c-input__item name">
      <input type="text" placeholder="100g" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    </div>
  `;

  const deleteButtons = document.querySelectorAll(".c-btn__delete");
  deleteButtons.forEach((button) => {
    handleDeleteButton(button, ingredientsList); // 삭제 버튼에 이벤트 리스너 추가
  });
}

// ** 재료 추가 기능 **
addIngredientButton.addEventListener("click", () => {
  handleIngredient(ingredientsList); // 재료 추가 함수 호출
});

// ** 레시피 계산 기능 **
calculateButton.addEventListener("click", () => {
  const reduceRatio = parseFloat(document.getElementById("reduce-ratio").value);
  const ingredients = extractIngredients(ingredientsList);

  const errorMessage = document.getElementById("error-message");
  if (ingredients.length === 0) {
    errorMessage.style.display = "block";
    return;
  }

  let resultHTML = "";
  ingredients.forEach((ingredient) => {
    const newAmount = ingredient.amount * reduceRatio;
    let displayAmount = newAmount;
    if (!Number.isInteger(newAmount)) {
      displayAmount = newAmount.toFixed(1);
    }

    resultHTML += `<p>${ingredient.name}: ${displayAmount}${ingredient.unit}</p>`;
  });

  resultModalContent.innerHTML = resultHTML;
  resultModal.style.display = "block";
});

// ** 레시피 이름을 입력하고 저장하기 기능 **
saveDirectRecipeButton.addEventListener("click", () => {
  const recipeName = document.querySelector(".c-input__recipe").value.trim();
  if (!recipeName) {
    alert("레시피 이름을 입력해 주세요!");
    return;
  }

  const ingredients = extractIngredients(ingredientsList);
  if (ingredients.length === 0) {
    alert("재료를 최소 하나 이상 입력해 주세요!");
    return;
  }

  saveRecipe(recipeName, ingredients);
});
