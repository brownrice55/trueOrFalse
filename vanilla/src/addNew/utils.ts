import { displayList } from '../quizList/utils';
import { getCategoryInputHTML } from '../categorySettings/setup';
import { displayModalToSelectWhatToDoNextAfterSavingData } from '../common/modals/modal';
import {
  getHTMLForOptionInputsOfSelection,
  getNumberOfQuestionsOptionsAndSetValidation,
} from '../common/forms/form';
import {
  setDisabled,
  setValidationForDataEntry,
} from '../common/forms/validation';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { Inputs } from '../common/types/inputs.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';

export function switchType(
  aAddNewTypeSelectElm: HTMLElement,
  aAddNewTypeDivElms: NodeListOf<HTMLElement>,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aFormOptionInputsDivElm: HTMLElement
) {
  aAddNewTypeSelectElm.addEventListener('change', function (e) {
    const type = (e.currentTarget as HTMLInputElement).value;
    const indices: number[] = type === 'trueOrFalse' ? [0, 1] : [1, 0];
    aAddNewTypeDivElms[indices[0]].classList.remove('d-none');
    aAddNewTypeDivElms[indices[1]].classList.add('d-none');

    setValidationForDataEntry(
      type,
      aAddNewTextAreaElms,
      aButtonAddNewElm,
      aFormOptionInputsDivElm
    );
  });
}

export function setOptionInputs(
  aFormOptionNumberSelectElm: HTMLSelectElement,
  aFormOptionInputsDivElm: HTMLElement,
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aButtonAddNewElm: HTMLButtonElement
) {
  aFormOptionNumberSelectElm.addEventListener('change', function (e) {
    const number = parseInt((e.currentTarget as HTMLSelectElement).value, 10);
    aFormOptionInputsDivElm.innerHTML = getHTMLForOptionInputsOfSelection(
      number,
      aFormOptionInputsDivElm,
      'addnew',
      null
    );
    setDisabled(
      aAddNewTypeSelectElm,
      aAddNewTextAreaElms,
      aFormOptionInputsDivElm,
      aButtonAddNewElm,
      'textarea',
      'keyup',
      null,
      undefined
    );
    setDisabled(
      aAddNewTypeSelectElm,
      aAddNewTextAreaElms,
      aFormOptionInputsDivElm,
      aButtonAddNewElm,
      'checkbox',
      'click',
      null,
      undefined
    );
    setDisabled(
      aAddNewTypeSelectElm,
      aAddNewTextAreaElms,
      aFormOptionInputsDivElm,
      aButtonAddNewElm,
      'inputText',
      'keyup',
      null,
      undefined
    );
  });
}

export function saveQuizData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewCategoryElm: HTMLSelectElement,
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewPrioritySelectElm: HTMLSelectElement,
  aFormAnswerRadioElms: NodeListOf<HTMLInputElement>,
  aFormOptionNumberSelectElm: HTMLSelectElement,
  aFormOptionInputsDivElm: HTMLElement,
  aAddNewTypeDivElms: NodeListOf<HTMLElement>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  aButtonAddNewElm.addEventListener('click', function () {
    const newValue: Inputs = {
      id: 0,
      category: '',
      type: '',
      question: '',
      answer: 0,
      numberOfOptions: 0,
      options: [[false, '']],
      explanation: '',
      priority: '',
      notes: '',
      areCorrectAnswers: [],
    };
    newValue.category = aAddNewCategoryElm.value;
    newValue.type = aAddNewTypeSelectElm.value;
    newValue.question = aAddNewTextAreaElms[0].value;
    newValue.explanation = aAddNewTextAreaElms[1].value;
    newValue.priority = aAddNewPrioritySelectElm.value;

    const checkboxElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-formOptionsCheckbox'
    );
    const inputTextElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-formOptionsInputText'
    );

    if (newValue.type === 'trueOrFalse') {
      newValue.answer = aFormAnswerRadioElms[0].checked ? 0 : 1;
    } else {
      newValue.numberOfOptions = parseInt(aFormOptionNumberSelectElm.value, 10);

      let array: [boolean, string][] = [];
      checkboxElms.forEach((elm, idx) => {
        array.push([
          (elm as HTMLInputElement).checked,
          (inputTextElms[idx] as HTMLInputElement).value,
        ]);
      });
      newValue.options = array;
    }

    const keysArray: number[] = aQuizData.size
      ? Array.from(aQuizData.keys())
      : [];
    const newId: number = aQuizData.size
      ? keysArray[keysArray.length - 1] + 1
      : 0;
    newValue.id = newId;

    aQuizData.set(newId, newValue);
    localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

    const key = parseInt(newValue.category, 10);
    if (!Number.isNaN(key)) {
      const currentQuizCategoryVal = aQuizCategory.get(key);
      if (currentQuizCategoryVal) {
        currentQuizCategoryVal.isActive = true;
        localStorage.setItem(
          'quizCategory',
          JSON.stringify([...aQuizCategory])
        );
        // reset category inputs : start *******
        const inputCategoryAreaElm =
          document.querySelector<HTMLElement>('.js-inputCategory');
        if (inputCategoryAreaElm !== null) {
          inputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
        }
      }
    }

    // reset start
    aAddNewTextAreaElms.forEach((elm) => {
      (elm as HTMLTextAreaElement).value = '';
    });
    inputTextElms.forEach((elm) => {
      (elm as HTMLInputElement).value = '';
    });
    checkboxElms.forEach((elm) => {
      (elm as HTMLInputElement).checked = false;
    });

    aAddNewCategoryElm.value = 'unspecified';
    aFormAnswerRadioElms[0].checked = true;
    aFormAnswerRadioElms[1].checked = false;
    aFormOptionNumberSelectElm.value = '2';
    aFormOptionInputsDivElm.innerHTML = getHTMLForOptionInputsOfSelection(
      2,
      aFormOptionInputsDivElm,
      'addnew',
      null
    );
    aAddNewPrioritySelectElm.value = '2';

    if (newValue.type === 'selection') {
      aAddNewTypeSelectElm.value = 'trueOrFalse';
      aAddNewTypeDivElms[0].classList.remove('d-none');
      aAddNewTypeDivElms[1].classList.add('d-none');
    }

    this.disabled = true;
    // reset end

    const listDivElms = document.querySelectorAll('.js-listDiv');
    const listUlElm = document.querySelector('.js-listUl');
    displayList(
      aQuizData,
      aQuizCategory,
      listDivElms,
      listUlElm as HTMLElement,
      aModalForDeleteElms,
      aCurrentValKeys,
      aBsModal,
      aSectionElms,
      aButtonSaveElm,
      aButtonCancelElm,
      aListDtElms,
      aDivIdx3DivElms
    );

    displayModalToSelectWhatToDoNextAfterSavingData(
      'whatToDoNext',
      '新規登録',
      aQuizData.size,
      '問題',
      aSectionElms
    );

    // set the number of questions for the quiz start page
    const numberOfQuestionsSelectElm = document.querySelector(
      '.js-numberOfQuestionsSelect'
    );
    if (numberOfQuestionsSelectElm) {
      numberOfQuestionsSelectElm.innerHTML =
        getNumberOfQuestionsOptionsAndSetValidation(
          aQuizData.size,
          null,
          null,
          null,
          null,
          null,
          null
        );
    }
  });
}
