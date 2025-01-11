const recipeSelect = document.getElementById('recipe-select');
const saveRecipeButton = document.getElementById('save-recipe');
const deleteRecipeButton = document.getElementById('delete-recipe');
const addIngredientButton = document.getElementById('add-ingredient');
const convertButton = document.getElementById('convert-recipe');
const newRecipeButton = document.getElementById('new-recipe');
const ingredientList = document.getElementById('ingredients-list');

let savedRecipes = JSON.parse(localStorage.getItem('recipes')) || {};

// 레시피 목록 업데이트
function updateRecipeList() {
  recipeSelect.innerHTML = '<option value="">저장된 레시피를 선택하세요</option>';
  for (const recipeName in savedRecipes) {
    const option = document.createElement('option');
    option.value = recipeName;
    option.textContent = recipeName;
    recipeSelect.appendChild(option);
  }
}

// 새 레시피 추가 기능
newRecipeButton.addEventListener('click', () => {
  document.getElementById('base-servings').value = '';
  document.getElementById('target-servings').value = '';
  ingredientList.innerHTML = ''; // 기존 재료 목록 초기화
  for (let i = 0; i < 5; i++) {
    const newGroup = document.createElement('div');
    newGroup.className = 'input-group';
    newGroup.innerHTML = `
      <input type="text" placeholder="재료명" class="ingredient-name">
      <input type="number" placeholder="양" class="ingredient-amount">
      <select class="ingredient-unit">
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="개">개</option>
      </select>
    `;
    ingredientList.appendChild(newGroup);
  }
  alert('새 레시피를 추가할 준비가 되었습니다!');
});

// 레시피 저장
saveRecipeButton.addEventListener('click', () => {
  const newRecipeName = prompt('저장할 레시피 이름을 입력하세요:');
  if (newRecipeName) {
    const ingredients = [];
    document.querySelectorAll('.input-group').forEach(group => {
      const name = group.querySelector('.ingredient-name')?.value;
      const amount = parseFloat(group.querySelector('.ingredient-amount')?.value);
      const unit = group.querySelector('.ingredient-unit')?.value;
      if (name && !isNaN(amount)) ingredients.push({ name, amount, unit });
    });
    const baseServings = parseInt(document.getElementById('base-servings').value);
    savedRecipes[newRecipeName] = { ingredients, baseServings };
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));
    updateRecipeList();
    alert(`${newRecipeName} 레시피가 저장되었습니다.`);
  }
});

// 레시피 삭제
deleteRecipeButton.addEventListener('click', () => {
  const selectedRecipe = recipeSelect.value;
  if (selectedRecipe) {
    delete savedRecipes[selectedRecipe];
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));
    updateRecipeList();
    alert(`${selectedRecipe} 레시피가 삭제되었습니다.`);
  }
});

// 재료 추가
addIngredientButton.addEventListener('click', () => {
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `
    <input type="text" placeholder="재료명" class="ingredient-name">
    <input type="number" placeholder="양" class="ingredient-amount">
    <select class="ingredient-unit">
      <option value="g">g</option>
      <option value="ml">ml</option>
      <option value="개">개</option>
    </select>
  `;
  ingredientList.appendChild(newGroup);
});

// 레시피 변환
convertButton.addEventListener('click', () => {
  const baseServings = parseInt(document.getElementById('base-servings').value);
  const targetServings = parseInt(document.getElementById('target-servings').value);
  if (isNaN(baseServings) || isNaN(targetServings)) {
    alert('기준 인분과 변환할 인분을 모두 입력해 주세요.');
    return;
  }

  document.querySelectorAll('.input-group').forEach(group => {
    const amountInput = group.querySelector('.ingredient-amount');
    const originalAmount = parseFloat(amountInput.dataset.originalAmount || amountInput.value);
    const convertedAmount = (originalAmount * targetServings) / baseServings;
    amountInput.value = convertedAmount.toFixed(2);
    amountInput.dataset.originalAmount = originalAmount; // 원래 값 저장
  });

  alert('레시피가 변환되었습니다!');
});

updateRecipeList();