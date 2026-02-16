import { switchPage } from './display';
import { displayList } from './quizList';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { Inputs } from '../types/inputs.type';

export function setCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aAddNewCategoryElm: HTMLElement
) {
  let optionHTML = `<option selected>指定しない</option>`;
  [...aQuizCategory].forEach(([idx, obj]) => {
    optionHTML += `<option value="${idx}">${obj.categoryName}</option>`;
  });
  optionHTML += `<option value="add">カテゴリーを追加する</option>`;

  aAddNewCategoryElm.innerHTML = optionHTML;
}

export function switchType(
  aAddNewTypeSelectElm: HTMLElement,
  aAddNewTypeDivElms: NodeListOf<HTMLElement>,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewOptionInputsDivElm: HTMLElement
) {
  aAddNewTypeSelectElm.addEventListener('change', function (e) {
    const type = (e.currentTarget as HTMLInputElement).value;
    const indices: number[] = type === 'trueOrFalse' ? [0, 1] : [1, 0];
    aAddNewTypeDivElms[indices[0]].classList.remove('d-none');
    aAddNewTypeDivElms[indices[1]].classList.add('d-none');

    let isInputed = [...aAddNewTextAreaElms].every((elm) => elm.value);
    setAlertForInputField(
      aAddNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
      isInputed
    );
    aButtonAddNewElm.disabled = isInputed ? false : true;

    if (type === 'selection') {
      const checkboxElms = aAddNewOptionInputsDivElm.querySelectorAll(
        '.js-addNewOptionsCheckbox'
      );
      const inputTextElms = aAddNewOptionInputsDivElm.querySelectorAll(
        '.js-addNewOptionsInputText'
      );
      let isChecked = [...checkboxElms].some(
        (elm) => (elm as HTMLInputElement).checked
      );
      let isInputed2 = [...inputTextElms].every(
        (elm) => (elm as HTMLInputElement).value
      );
      setAlertForInputField(
        inputTextElms as NodeListOf<HTMLInputElement>,
        isInputed2
      );
      setAlertForInputField(
        checkboxElms as NodeListOf<HTMLInputElement>,
        isChecked
      );
      aButtonAddNewElm.disabled =
        isInputed && isChecked && isInputed2 ? false : true;
    }
  });
}

const getHTMLForOptionInputs = (aNumber: number) => {
  let html = '';
  Array(aNumber)
    .fill('')
    .forEach((_, idx) => {
      html += `<div class="input-group mb-3">
                <div class="input-group-text">
                  <input id="option${idx + 1}" 
                    class="js-addNewOptionsCheckbox form-check-input mt-0"
                    type="checkbox"
                    value=""
                  />
                </div>
                <input id="option${idx + 1}-2"  type="text" class="js-addNewOptionsInputText form-control" />
              </div>`;
    });
  return html;
};

export function setOptionInputs(
  aAddNewOptionNumberSelectElm: HTMLSelectElement,
  aAddNewOptionInputsDivElm: HTMLElement
) {
  aAddNewOptionNumberSelectElm.addEventListener('change', function (e) {
    const number = parseInt((e.currentTarget as HTMLSelectElement).value);
    aAddNewOptionInputsDivElm.innerHTML = getHTMLForOptionInputs(number);
  });
}

export function saveQuizData(
  aQuizData: Map<number, Inputs>,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewCategoryElm: HTMLSelectElement,
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewPrioritySelectElm: HTMLSelectElement,
  aAddNewAnswerRadioElms: NodeListOf<HTMLInputElement>,
  aAddNewOptionNumberSelectElm: HTMLSelectElement
) {
  aButtonAddNewElm.addEventListener('click', function () {
    const newValue: Inputs = {
      category: '',
      type: '',
      question: '',
      answer: 0,
      numberOfOptions: 0,
      options: [[false, '']],
      explanation: '',
      priority: '',
      notes: '',
      numberOfCorrectAnswers: 0,
      numberOfAnswers: 0,
    };
    newValue.category = aAddNewCategoryElm.value;
    newValue.type = aAddNewTypeSelectElm.value;
    newValue.question = aAddNewTextAreaElms[0].value;
    newValue.explanation = aAddNewTextAreaElms[1].value;
    newValue.priority = aAddNewPrioritySelectElm.value;
    newValue.answer = aAddNewAnswerRadioElms[0].checked ? 1 : 2;
    newValue.numberOfOptions = parseInt(aAddNewOptionNumberSelectElm.value);

    const keysArray: number[] = aQuizData.size
      ? Array.from(aQuizData.keys())
      : [];
    const newId: number = aQuizData.size
      ? keysArray[keysArray.length - 1] + 1
      : 1;

    aQuizData.set(newId, newValue);
    localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
    switchPage(0);

    const listDivElms = document.querySelectorAll('.js-listDiv');
    const listUlElm = document.querySelector('.js-listUl');
    displayList(aQuizData, listDivElms, listUlElm as HTMLElement);
  });
}

const setAlertForInputField = (
  aElms: NodeListOf<Element>,
  aIsInputed: boolean
) => {
  aElms.forEach((elm2) => {
    elm2.classList.remove('border', 'border-danger', 'border-3');
    if (!(elm2 as HTMLInputElement).value && !aIsInputed) {
      elm2.classList.add('border', 'border-danger', 'border-3');
    }
  });
};

const setDisabled = (
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewOptionInputsDivElm: HTMLElement,
  aButtonAddNewElm: HTMLButtonElement,
  aElms: string,
  aEvent: string
) => {
  const checkboxElms = aAddNewOptionInputsDivElm.querySelectorAll(
    '.js-addNewOptionsCheckbox'
  );
  const inputTextElms = aAddNewOptionInputsDivElm.querySelectorAll(
    '.js-addNewOptionsInputText'
  );

  const elms: NodeListOf<Element> =
    aElms === 'textarea'
      ? aAddNewTextAreaElms
      : aElms === 'checkbox'
        ? checkboxElms
        : inputTextElms;

  let isInputed = false;
  let isChecked = false;
  let isInputed2 = false;

  for (const elm of elms) {
    elm.addEventListener(aEvent, function () {
      const type = aAddNewTypeSelectElm.value;

      isInputed = [...aAddNewTextAreaElms].every((elm) => elm.value);
      setAlertForInputField(
        aAddNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
        isInputed
      );
      aButtonAddNewElm.disabled = isInputed ? false : true;

      if (type === 'selection') {
        isChecked = [...checkboxElms].some(
          (elm) => (elm as HTMLInputElement).checked
        );
        isInputed2 = [...inputTextElms].every(
          (elm) => (elm as HTMLInputElement).value
        );
        setAlertForInputField(
          inputTextElms as NodeListOf<HTMLInputElement>,
          isInputed2
        );
        setAlertForInputField(
          checkboxElms as NodeListOf<HTMLInputElement>,
          isChecked
        );
        aButtonAddNewElm.disabled =
          isInputed && isChecked && isInputed2 ? false : true;
      }
    });
  }
};

export function setValidation(
  aAddNewTypeSelectElm: HTMLSelectElement,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewOptionInputsDivElm: HTMLElement
) {
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aAddNewOptionInputsDivElm,
    aButtonAddNewElm,
    'textarea',
    'keyup'
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aAddNewOptionInputsDivElm,
    aButtonAddNewElm,
    'checkbox',
    'click'
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aAddNewOptionInputsDivElm,
    aButtonAddNewElm,
    'inputText',
    'keyup'
  );
}
