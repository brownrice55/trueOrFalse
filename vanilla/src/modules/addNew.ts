import type { InputsCategory } from '../types/inputsCategory.type';

export function setCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aAddNewCategoryElm: HTMLElement
) {
  let optionHTML = `<option selected>選択してください</option>`;
  [...aQuizCategory].forEach(([idx, obj]) => {
    optionHTML += `<option value="${idx}">${obj.categoryName}</option>`;
  });
  optionHTML += `<option value="add">カテゴリーを追加する</option>`;

  aAddNewCategoryElm.innerHTML = optionHTML;
}

export function switchType(
  aAddNewTypeSelectElm: HTMLElement,
  aAddNewTypeDivElms: NodeListOf<HTMLElement>
) {
  aAddNewTypeSelectElm.addEventListener('change', function (e) {
    const type = (e.currentTarget as HTMLInputElement).value;
    const indices: number[] = type === 'trueOrFalse' ? [0, 1] : [1, 0];
    aAddNewTypeDivElms[indices[0]].classList.remove('d-none');
    aAddNewTypeDivElms[indices[1]].classList.add('d-none');
    // ******** need form validation
  });
}
