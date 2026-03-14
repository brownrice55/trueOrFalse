import type { InputsCategory } from '../../types/inputsCategory.type';
export function getCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aValue: string
) {
  let optionHTML2 = '';
  let isSelected = false;
  let selected = '';
  [...aQuizCategory].forEach(([idx, obj]) => {
    if (parseInt(aValue, 10) === idx) {
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

export function getHTMLForOptionInputsOfSelection(
  aNumber: number,
  aIsDefault: boolean,
  aElm: HTMLElement
) {
  const checkboxElms = aElm.querySelectorAll('.js-addNewOptionsCheckbox');
  const inputTextElms = aElm.querySelectorAll('.js-addNewOptionsInputText');
  let temporaryValues: [boolean, string][] = [];
  if (!aIsDefault) {
    temporaryValues = [
      [false, ''],
      [false, ''],
    ];
  } else {
    checkboxElms.forEach((elm, idx) => {
      temporaryValues.push([
        (elm as HTMLInputElement).dataset.checktemporary === 'true'
          ? true
          : false,
        (inputTextElms[idx] as HTMLInputElement).dataset.texttemporary!,
      ]);
    });
  }

  let html = '';
  let checked = '';
  Array(aNumber)
    .fill('')
    .forEach((_, idx) => {
      if (!temporaryValues[idx]) {
        temporaryValues[idx] = [false, ''];
      }
      checked =
        temporaryValues[idx] && temporaryValues[idx][0] ? 'checked' : '';
      html += `<div class="input-group mb-3">
                <div class="input-group-text">
                  <input id="option${idx + 1}" 
                    class="js-addNewOptionsCheckbox form-check-input mt-0"
                    type="checkbox" ${checked} data-checktemporary="${temporaryValues[idx][0] ?? ''}"
                  />
                </div>
                <input id="option${idx + 1}-2"  type="text" class="js-addNewOptionsInputText form-control"
                    value="${temporaryValues[idx][1] ?? ''}" data-texttemporary="${temporaryValues[idx][1] ?? ''}" />
              </div>`;
    });
  return html;
}

export function setAlertForInputField(
  aElms: NodeListOf<Element>,
  aIsInputed: boolean,
  aType: string
) {
  aElms.forEach((elm) => {
    const targetValue =
      aType === 'checkbox'
        ? (elm as HTMLInputElement).checked
        : (elm as HTMLInputElement | HTMLTextAreaElement).value;
    elm.classList.remove('border', 'border-danger', 'border-3');
    if (!targetValue && !aIsInputed) {
      elm.classList.add('border', 'border-danger', 'border-3');
    }
  });
}
