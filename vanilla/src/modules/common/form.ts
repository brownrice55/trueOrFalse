import type { InputsCategory } from '../../types/inputsCategory.type';
export function getCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aValue: string
) {
  let optionHTML2 = '';
  let isSelected = false;
  let selected = '';
  [...aQuizCategory].forEach(([idx, obj]) => {
    if (parseInt(aValue) === idx) {
      selected = ' selected';
      isSelected = true;
    } else {
      selected = '';
    }
    optionHTML2 += `<option value="${idx}"${selected}>${obj.categoryName}</option>`;
  });
  optionHTML2 += `<option value="add">カテゴリーを追加する</option>`;

  selected = isSelected ? '' : ' selected';
  let optionHTML = `<option value="unspecified"${selected}>指定しない</option>`;

  return optionHTML + optionHTML2;
}

export function getTypeOptions(aValue: string) {
  let selectedArray =
    aValue === 'selection' ? ['', ' selected'] : [' selected', ''];
  return `<option value="trueOrFalse"${selectedArray[0]}>まるばつクイズ</option>
          <option value="selection"${selectedArray[1]}>選択問題</option>`;
}

export function getTextArea(aValue: string, aId: string) {
  return `<textarea class="form-control" id="${aId}" rows="3">${aValue}</textarea>`;
}

export function getPriorityOptions(aValue: string) {
  let selectedArray =
    aValue === 'midium'
      ? ['', ' selected', '']
      : aValue === 'low'
        ? ['', '', ' selected']
        : [' selected', '', ''];
  return `<option value="high"${selectedArray[0]}>高い</option>
          <option value="medium"${selectedArray[1]}>普通</option>
          <option value="low"${selectedArray[2]}>低い</option>`;
}
