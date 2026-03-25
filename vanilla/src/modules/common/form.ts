import { getDataFromLocalStorage } from '../dataManagement';
import type { Inputs } from '../../types/inputs.type';
import type { InputsCategory } from '../../types/inputsCategory.type';
import type {
  labelForTypeType,
  labelForPriorityType,
} from '../../types/labels.type';
import type { FormElementsIrregularIndex3Type } from '../../types/formElementsIrregularIndex3.type';
import {
  labelForType,
  labelForPriority,
  labelForQuestionAnswer,
} from './labels';
import { goToCategoryToSetNewCategory } from './utils';
export function getCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aValue: string,
  aButtonSaveElm: HTMLButtonElement
) {
  if (aButtonSaveElm?.classList.contains('js-categoryNameIsUpdated')) {
    aQuizCategory = getDataFromLocalStorage('quizCategory');
  }
  let optionHTML2 = '';
  let isSelected = false;
  let selected = '';
  [...aQuizCategory].forEach(([idx, obj]) => {
    if (obj && obj.categoryName) {
      selected = '';
      if (aValue !== 'unspecified' && parseInt(aValue, 10) === idx) {
        selected = ' selected';
        isSelected = true;
      }
      optionHTML2 += `<option value="${idx}"${selected}>${obj.categoryName}</option>`;
    }
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
    aValue === 'medium'
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
  aElm: HTMLElement,
  aPrefix: string,
  aCurrentVal: Inputs | null
) {
  const className = aPrefix === 'addnew' ? '.js-addNew' : '.js-listDl';
  const checkboxElms = aElm.querySelectorAll(
    className + ' .js-addNewOptionsCheckbox'
  );
  const inputTextElms = aElm.querySelectorAll(
    className + ' .js-addNewOptionsInputText'
  );
  let temporaryValues: [boolean, string][] = [];

  if (aCurrentVal) {
    aCurrentVal.options.forEach((arr) => {
      temporaryValues.push([arr[0] === true ? true : false, arr[1]]);
    });
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
                  <input id="${aPrefix}-option${idx + 1}" 
                    class="js-addNewOptionsCheckbox form-check-input mt-0"
                    type="checkbox" ${checked} data-checktemporary="${temporaryValues[idx][0] ?? ''}"
                  />
                </div>
                <input id="${aPrefix}-option${idx + 1}-2"  type="text" class="js-addNewOptionsInputText form-control"
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

export function getEachValueForDivIndex0(
  aIdx: number,
  aCurrentVal: Inputs,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aQuizCategory: Map<number, InputsCategory>
) {
  const currentValKey = aCurrentValKeys[aIdx];
  let selctionAnswer = '';
  if (aIdx === 1 || aIdx === 3) {
    let answerForSelection = '';
    if (aCurrentVal.type === 'selection') {
      aCurrentVal.options.forEach((arr) => {
        if (arr[0]) {
          if (answerForSelection) {
            answerForSelection += '、';
          }
          answerForSelection += arr[1];
        }
      });
    }
    selctionAnswer = String(
      aCurrentVal.type === 'trueOrFalse'
        ? labelForQuestionAnswer[aCurrentVal.answer]
        : answerForSelection
    );
    if (aIdx === 3) {
      return selctionAnswer;
    }
  }
  if (!aIdx || aIdx === 1 || aIdx === 5) {
    let text = '';
    if (aIdx === 0) {
      // category
      const key = aCurrentVal[currentValKey];
      if (key === 'unspecified') {
        text = '指定しない';
        aListDdElms[0].dataset.text = '指定しない';
      } else if (
        typeof key === 'string' &&
        typeof parseInt(key, 10) === 'number'
      ) {
        const currentCategory = aQuizCategory.get(parseInt(key, 10));
        if (currentCategory) {
          text = String(currentCategory.categoryName);
          aListDdElms[0].dataset.text = String(currentCategory.categoryName);
        }
      }
    } else if (aIdx === 1) {
      // type
      text = String(
        labelForType[aCurrentVal[currentValKey] as keyof labelForTypeType]
      );
      if (aCurrentVal.type === 'selection') {
        const divIdx3Elms = document.querySelectorAll('.js-listDd__divIdx3');
        divIdx3Elms[0].innerHTML = selctionAnswer;
      }
    } else if (aIdx === 5) {
      // question
      text = String(
        labelForPriority[
          String(aCurrentVal[currentValKey]) as keyof labelForPriorityType
        ]
      );
    }
    return String(text);
  } else {
    return String((aCurrentVal as Inputs)[currentValKey]);
  }
}

export function setDivIndex1FormForQuizDetailIdx0Category(
  aQuizCategory: Map<number, InputsCategory>,
  aCurrentVal: Inputs,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDdElms: NodeListOf<HTMLElement>,
  aDivElmsIndex1: HTMLElement,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement
) {
  const formElementsArray = getFormElements(
    aQuizCategory,
    aCurrentVal,
    aButtonSaveElm,
    'quizlist'
  );
  const formElements = formElementsArray[0] as string[];
  aDivElmsIndex1.innerHTML = String(formElements[0]);
  const categorySelectElm = aListDdElms[0].querySelector('select');
  categorySelectElm?.addEventListener('change', function (e) {
    const targetValue = (e.currentTarget as HTMLSelectElement).value;
    if (targetValue === 'add') {
      goToCategoryToSetNewCategory(
        aSectionElms,
        'quizList',
        aButtonSaveElm,
        aButtonCancelElm
      );
    }
  });
}

export function getFormElements(
  aQuizCategory: Map<number, InputsCategory>,
  aCurrentVal: Inputs | null,
  aButtonSaveElm: HTMLButtonElement,
  aPrefix: string
) {
  const formElements: string[] = aCurrentVal
    ? [
        `<select class="form-select" aria-label="category" id="detailCategory">${getCategoryOptions(aQuizCategory, aCurrentVal.category, aButtonSaveElm)}</select>`,
        `<select class="form-select js-detailType" aria-label="type" id="detailType" value="${aCurrentVal.type}">${getTypeOptions(aCurrentVal.type)}</select>`,
        getTextArea(aCurrentVal.question, 'detailQuestion'),
        '',
        getTextArea(aCurrentVal.explanation, 'detailExplanation'),
        `<select class="form-select" aria-label="priority" id="detailPriority" value="${aCurrentVal.priority}">${getPriorityOptions(aCurrentVal.priority)}</select>`,
        getTextArea(aCurrentVal.notes, 'detailNotes'),
      ]
    : [''];

  const formElementsIrregularIndex3: FormElementsIrregularIndex3Type = {
    trueOrFalse: `<div class="form-check form-check-inline cursor-pointer my-3">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="${aPrefix}-answer0"
            value="0"
            checked
          />
          <label class="form-check-label" for="${aPrefix}-answer0">まる</label>
        </div>
        <div class="form-check form-check-inline cursor-pointer">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="${aPrefix}-answer1"
            value="1"
          />
          <label class="form-check-label" for="${aPrefix}-answer1">ばつ</label>
        </div>`,
    selection: `<div class="my-3">
            <label for="${aPrefix}-numberOfOptions" class="form-label"
              >選択肢の数</label
            >
            <select
              class="form-select js-addNewOptionNumberSelect"
              aria-label="numberOfOptions"
              id="${aPrefix}-numberOfOptions"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <p>
            選択肢を入力して、正解の選択肢にチェックを入れてください。
          </p>
          <div class="my-3 js-addNewOptionInputsDiv"></div>
        </div>`,
  };

  return [
    formElements as string[],
    formElementsIrregularIndex3 as FormElementsIrregularIndex3Type,
  ];
}
