import type { InputsCategory } from '../types/inputsCategory.type';
export function getCategoryOptions(aQuizCategory: Map<number, InputsCategory>) {
  let optionHTML = `<option value="unspecified" selected>指定しない</option>`;
  [...aQuizCategory].forEach(([idx, obj]) => {
    optionHTML += `<option value="${idx}">${obj.categoryName}</option>`;
  });
  optionHTML += `<option value="add">カテゴリーを追加する</option>`;

  return optionHTML;
}
