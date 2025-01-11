// 모달 열기 및 닫기
const openModalButton = document.getElementById('open-modal');
const closeModalButton = document.getElementById('close-modal');
const recipeModal = document.getElementById('recipe-modal');

openModalButton.addEventListener('click', () => {
  recipeModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
  recipeModal.style.display = 'none';
});

// 모달 내 재료 추가 기능
const modalIngredientsList = document.getElementById('modal-ingredients-list');
const modalAddIngredientButton = document.getElementById('modal-add-ingredient');

modalAddIngredientButton.addEventListener('click', () => {
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="modal-ingredient-name">
    <input type="number" placeholder="양 (g, ml 등)" class="modal-ingredient-amount">
    <button class="delete-btn">❌</button>
  `;
  modalIngredientsList.appendChild(newGroup);

  newGroup.querySelector('.delete-btn').addEventListener('click', () => {
    newGroup.remove(); // 재료 삭제
  });
});

// 모달 내 레시피 저장 기능
const saveNewRecipeButton = document.getElementById('save-new-recipe');
const recipeSelect = document.getElementById('recipe-select');

saveNewRecipeButton.addEventListener('click', () => {
  const recipeName = document.getElementById('recipe-name').value.trim();
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
  updateRecipeList();
  recipeModal.style.display = 'none'; // 모달 닫기
});

// 레시피 목록 업데이트 함수
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

window.onload = updateRecipeList;
