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
const openModalButton = document.getElementById("open-modal"); // 새 레시피 추가 버튼
const closeModalButton = document.getElementById("close-recipe-modal");
const recipeModal = document.getElementById("modalAdd");
const modalIngredientsList = document.getElementById("modal-ingredients-list");
const modalAddIngredientButton = document.getElementById("modal-add-ingredient");
const recipeNameInput = document.getElementById("recipe-name");
const closeResultModalButton = document.getElementById("close-result-modal"); // 모달 닫기 버튼

// ** 공통된 닫기 버튼 관리 **
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("c-btn__close")) {
    // 모든 모달을 닫음
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

// ** 모달에서 재료 추가 기능 **
modalAddIngredientButton.addEventListener("click", () => {
  addIngredient(modalIngredientsList); // 재료 추가 함수 호출
});

// ** 중복되는 재료 추가 함수 **
function addIngredient(ingredientList) {
  const newGroup = document.createElement("div");
  newGroup.className = "p-main__item-input";
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="c-input__item name">
    <input type="text" placeholder="양" class="c-input__item amount">
    <button class="c-btn__delete"></button>
  `;
  ingredientList.appendChild(newGroup);

  newGroup.querySelector(".c-btn__delete").addEventListener("click", () => {
    // 삭제 시 최소 하나는 남도록 조건 추가
    if (ingredientList.children.length > 1) {
      newGroup.remove(); // 재료 삭제
    } else {
      alert("최소한 하나의 재료는 남겨야 합니다.");
    }
  });
}

// ** 레시피 저장 시, 단위 포함하여 저장 **
saveNewRecipeButton.addEventListener("click", () => {
  const recipeName = recipeNameInput.value.trim();
  if (!recipeName) {
    alert("레시피 이름을 입력해 주세요!");
    return;
  }

  const ingredients = Array.from(modalIngredientsList.querySelectorAll(".p-main__item-input"))
    .map((group) => {
      const name = group.querySelector(".name").value.trim();
      const amountText = group.querySelector(".amount").value.trim();
      const unit = amountText.replace(/[0-9.]/g, "").trim(); // 단위 추출
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, "")); // 숫자만 추출
      return { name, amount, unit };
    })
    .filter((ingredient) => ingredient.name && !isNaN(ingredient.amount));

  if (ingredients.length === 0) {
    alert("재료를 최소 하나 이상 입력해 주세요!");
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
  savedRecipes[recipeName] = { ingredients };
  localStorage.setItem("recipes", JSON.stringify(savedRecipes));
  alert(`${recipeName} 레시피가 저장되었습니다!`);
  updateRecipeList(); // 드롭다운 업데이트
  recipeModal.style.display = "none"; // 모달 닫기
});

// ** 레시피 목록 업데이트 함수 **
function updateRecipeList() {
  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};

  // 기존 레시피를 다 지우지 않고 새 레시피만 추가
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
    // '레시피를 선택하세요'를 선택하면 초기 상태로 리셋
    resetIngredients();
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem("recipes"));
  const recipe = savedRecipes[selectedRecipeName];

  ingredientsList.innerHTML = ""; // 기존 재료 삭제 후 새로 추가
  recipe.ingredients.forEach((ingredient) => {
    const newGroup = document.createElement("div");
    newGroup.className = "p-main__item-input";
    newGroup.innerHTML = `
      <input type="text" value="${ingredient.name}" class="c-input__item name">
      <input type="text" value="${ingredient.amount}${ingredient.unit}" class="c-input__item amount">
      <button class="c-btn__delete"></button>
    `;
    ingredientsList.appendChild(newGroup);

    newGroup.querySelector(".c-btn__delete").addEventListener("click", () => {
      // 삭제 시 최소 하나는 남도록 조건 추가
      if (ingredientsList.children.length > 1) {
        newGroup.remove(); // 재료 삭제
      } else {
        alert("최소한 하나의 재료는 남겨야 합니다.");
      }
    });
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

  // 기본 항목 삭제 버튼 추가 및 동작 처리
  const deleteButtons = document.querySelectorAll(".c-btn__delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (ingredientsList.children.length > 1) {
        button.parentElement.remove(); // 재료 삭제
      } else {
        alert("최소한 하나의 재료는 남겨야 합니다.");
      }
    });
  });
}

// ** 재료 추가 기능 **
addIngredientButton.addEventListener("click", () => {
  addIngredient(ingredientsList); // 재료 추가 함수 호출
});

// ** 레시피 계산 기능 **
calculateButton.addEventListener("click", () => {
  const reduceRatio = parseFloat(document.getElementById("reduce-ratio").value); // 비율 가져오기
  const ingredients = Array.from(ingredientsList.querySelectorAll(".p-main__item-input"))
    .map((group) => {
      const name = group.querySelector(".name").value.trim(); // 재료명 가져오기
      const amountText = group.querySelector(".amount").value.trim(); // 양 가져오기 (예: 100g, 200ml)
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, "")); // 숫자만 추출
      const unit = amountText.replace(/[0-9.]/g, "").trim(); // 단위 추출 (g, ml 등)

      return { name, amount, unit };
    })
    .filter((ingredient) => ingredient.name && !isNaN(ingredient.amount)); // 유효성 검사

  // if (ingredients.length === 0) {
  //   resultModalContent.innerHTML = "<p>재료를 입력해 주세요!</p>";
  //   return;
  // }
  // ** 재료가 없으면 메시지 표시하고 계산하지 않음 **
  const errorMessage = document.getElementById("error-message");
  if (ingredients.length === 0) {
    errorMessage.style.display = "block"; // 메시지 표시
    return;
  }

  let resultHTML = "";
  ingredients.forEach((ingredient) => {
    // 계산 후 결과
    const newAmount = ingredient.amount * reduceRatio;
    // 소수점 처리: 계산 결과가 정수라면 소수점 없이, 아니면 소수점 한 자리까지
    let displayAmount = newAmount;
    if (!Number.isInteger(newAmount)) {
      displayAmount = newAmount.toFixed(1); // 소수점 한자리까지 표시
    }

    resultHTML += `<p>${ingredient.name}: ${displayAmount}${ingredient.unit}</p>`;
  });

  resultModalContent.innerHTML = resultHTML; // 모달에 결과 출력
  resultModal.style.display = "block"; // 모달 열기
});

// ** 레시피 이름을 입력하고 저장하기 기능 **
saveDirectRecipeButton.addEventListener("click", () => {
  const recipeName = document.querySelector(".c-input__recipe").value.trim();
  if (!recipeName) {
    alert("레시피 이름을 입력해 주세요!");
    return;
  }

  const ingredients = Array.from(ingredientsList.querySelectorAll(".p-main__item-input"))
    .map((group) => {
      const name = group.querySelector(".name").value.trim();
      const amountText = group.querySelector(".amount").value.trim();
      const unit = amountText.replace(/[0-9.]/g, "").trim(); // 단위 추출
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, "")); // 숫자만 추출
      return { name, amount, unit };
    })
    .filter((ingredient) => ingredient.name && !isNaN(ingredient.amount));

  if (ingredients.length === 0) {
    alert("재료를 최소 하나 이상 입력해 주세요!");
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || {};
  savedRecipes[recipeName] = { ingredients };
  localStorage.setItem("recipes", JSON.stringify(savedRecipes));
  alert(`${recipeName} 레시피가 저장되었습니다!`);
  updateRecipeList(); // 드롭다운 업데이트
});
