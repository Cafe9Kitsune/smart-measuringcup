// HTML 요소 가져오기
const ingredientsList = document.getElementById('ingredients-list');
const addIngredientButton = document.getElementById('add-ingredient');
const calculateButton = document.getElementById('calculate-recipe');
const saveNewRecipeButton = document.getElementById('save-new-recipe');
const recipeSelect = document.getElementById('recipe-select');
const resultDiv = document.getElementById('calculated-result');

// 모달 관련 요소 가져오기
const openModalButton = document.getElementById('open-modal');
const closeModalButton = document.getElementById('close-modal');
const recipeModal = document.getElementById('recipe-modal');
const modalIngredientsList = document.getElementById('modal-ingredients-list');
const modalAddIngredientButton = document.getElementById('modal-add-ingredient');
const recipeNameInput = document.getElementById('recipe-name');

// ** 모달 열기/닫기 기능 **
openModalButton.addEventListener('click', () => {
  recipeModal.style.display = 'flex';
});
closeModalButton.addEventListener('click', () => {
  recipeModal.style.display = 'none';
});

// ** 모달에서 재료 추가 기능 **
modalAddIngredientButton.addEventListener('click', () => {
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="modal-ingredient-name">
    <input type="text" placeholder="양 (g, ml 등)" class="modal-ingredient-amount">
    <button class="delete-btn">❌</button>
  `;
  modalIngredientsList.appendChild(newGroup);

  newGroup.querySelector('.delete-btn').addEventListener('click', () => {
    newGroup.remove(); // 재료 삭제
  });
});

// ** 새 레시피 저장 기능 **
saveNewRecipeButton.addEventListener('click', () => {
  const recipeName = recipeNameInput.value.trim();
  if (!recipeName) {
    alert('레시피 이름을 입력해 주세요!');
    return;
  }

  const ingredients = Array.from(modalIngredientsList.querySelectorAll('.input-group')).map(group => {
    const name = group.querySelector('.modal-ingredient-name').value.trim();
    const amount = parseFloat(group.querySelector('.modal-ingredient-amount').value);
    return { name, amount };
  }).filter(ingredient => ingredient.name && !isNaN(ingredient.amount));

  if (ingredients.length === 0) {
    alert('재료를 최소 하나 이상 입력해 주세요!');
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || {};
  savedRecipes[recipeName] = { ingredients };
  localStorage.setItem('recipes', JSON.stringify(savedRecipes));
  alert(`${recipeName} 레시피가 저장되었습니다!`);
  updateRecipeList(); // 드롭다운 업데이트
  recipeModal.style.display = 'none'; // 모달 닫기
});

// ** 레시피 목록 업데이트 함수 **
function updateRecipeList() {
  recipeSelect.innerHTML = '<option value="">저장된 레시피를 선택하세요</option>';
  const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || {};

  for (const recipeName in savedRecipes) {
    const option = document.createElement('option');
    option.value = recipeName;
    option.textContent = recipeName;
    recipeSelect.appendChild(option);
  }
}
window.onload = updateRecipeList; // 페이지 로드 시 호출

// ** 재료 추가 기능 **
addIngredientButton.addEventListener('click', () => {
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="ingredient-name">
    <input type="text" placeholder="양 (g, ml 등)" class="ingredient-amount">
    <button class="delete-btn">❌</button>
  `;
  ingredientsList.appendChild(newGroup);

  newGroup.querySelector('.delete-btn').addEventListener('click', () => {
    newGroup.remove(); // 재료 삭제
  });
});

// ** 레시피 계산 기능 **
calculateButton.addEventListener('click', () => {
  const reduceRatio = parseFloat(document.getElementById('reduce-ratio').value); // 비율 가져오기
  const ingredients = Array.from(ingredientsList.querySelectorAll('.input-group')).map(group => {
    const name = group.querySelector('.ingredient-name').value.trim();
    const amount = parseFloat(group.querySelector('.ingredient-amount').value);
    return { name, amount };
  }).filter(ingredient => ingredient.name && !isNaN(ingredient.amount)); // 유효성 검사

  if (ingredients.length === 0) {
    resultDiv.innerHTML = '<p>재료를 입력해 주세요!</p>';
    return;
  }

  let resultHTML = '<h3>변환된 레시피</h3>';
  ingredients.forEach(ingredient => {
    const newAmount = ingredient.amount * reduceRatio; // 비율에 따라 양 계산
    resultHTML += `<p>${ingredient.name}: ${newAmount.toFixed(2)}</p>`;
  });

  resultDiv.innerHTML = resultHTML; // 결과 출력
});

// 레시피 선택 시 재료 불러오기
recipeSelect.addEventListener('change', () => {
  const selectedRecipeName = recipeSelect.value;
  if (!selectedRecipeName) return;

  const savedRecipes = JSON.parse(localStorage.getItem('recipes'));
  const recipe = savedRecipes[selectedRecipeName];

  ingredientsList.innerHTML = ''; // 기존 재료 삭제 후 새로 추가
  recipe.ingredients.forEach(ingredient => {
    const newGroup = document.createElement('div');
    newGroup.className = 'input-group';
    newGroup.innerHTML = `
      <input type="text" value="${ingredient.name}" class="ingredient-name">
      <input type="text" value="${ingredient.amount}" class="ingredient-amount">
      <button class="delete-btn">❌</button>
    `;
    ingredientsList.appendChild(newGroup);

    newGroup.querySelector('.delete-btn').addEventListener('click', () => {
      newGroup.remove(); // 재료 삭제 기능
    });
  });

  console.log("불러온 재료 리스트:", Array.from(ingredientsList.querySelectorAll('.ingredient-name')));
});

// 계산 기능
calculateButton.addEventListener('click', () => {
  const reduceRatio = parseFloat(document.getElementById('reduce-ratio').value); // 비율 가져오기
  const ingredients = Array.from(ingredientsList.querySelectorAll('.input-group')).map(group => {
    const name = group.querySelector('.ingredient-name').value.trim(); // 재료명
    const amount = parseFloat(group.querySelector('.ingredient-amount').value); // 양
    return { name, amount };
  }).filter(ingredient => ingredient.name && !isNaN(ingredient.amount)); // 유효성 검사

  console.log("계산할 재료 리스트:", ingredients); // 디버깅용

  if (ingredients.length === 0) {
    resultDiv.innerHTML = '<p>재료를 입력해 주세요!</p>';
    return;
  }

  // 결과 HTML 생성
  let resultHTML = '<h3>변환된 레시피</h3>';
  ingredients.forEach(ingredient => {
    const newAmount = ingredient.amount * reduceRatio; // 비율에 따른 변환
    resultHTML += `<p>${ingredient.name}: ${newAmount.toFixed(2)}</p>`;
  });

  resultDiv.innerHTML = resultHTML; // 결과 출력
});


// ** 재료 추가 기능 **
addIngredientButton.addEventListener('click', () => {
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명 (예: 밀가루)" class="ingredient-name">
    <input type="text" placeholder="양 (예: 100g, 200ml)" class="ingredient-amount">
    <button class="delete-btn">❌</button>
  `;
  ingredientsList.appendChild(newGroup);

  newGroup.querySelector('.delete-btn').addEventListener('click', () => {
    newGroup.remove(); // 재료 삭제
  });
});

// ** 레시피 계산 기능 **
calculateButton.addEventListener('click', () => {
  const reduceRatio = parseFloat(document.getElementById('reduce-ratio').value); // 비율 가져오기
  const ingredients = Array.from(ingredientsList.querySelectorAll('.input-group')).map(group => {
    const name = group.querySelector('.ingredient-name').value.trim(); // 재료명 가져오기
    const amountText = group.querySelector('.ingredient-amount').value.trim(); // 양 가져오기 (예: 100g, 200ml)
    const amount = parseFloat(amountText.replace(/[^0-9.]/g, '')); // 숫자만 추출
    const unit = amountText.replace(/[0-9.]/g, '').trim(); // 단위 추출 (g, ml 등)

    return { name, amount, unit };
  }).filter(ingredient => ingredient.name && !isNaN(ingredient.amount)); // 유효성 검사

  if (ingredients.length === 0) {
    resultDiv.innerHTML = '<p>재료를 입력해 주세요!</p>';
    return;
  }

  // 결과 HTML 생성
  let resultHTML = '<h3>변환된 레시피</h3>';
  ingredients.forEach(ingredient => {
    const newAmount = (ingredient.amount * reduceRatio).toFixed(1); // 소수점 1자리까지 표시
    resultHTML += `<p>${ingredient.name}: ${newAmount}${ingredient.unit}</p>`;
  });

  resultDiv.innerHTML = resultHTML; // 결과 출력
});