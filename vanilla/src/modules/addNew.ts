import { displayList } from './quizList';
import {
  getInputValues,
  setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices,
} from './inputValidation';
import { setCategoryInputs } from './display';
import { displayModalToSelectWhatToDoNextAfterSavingData } from './common/modal';
import {
  getHTMLForOptionInputsOfSelection,
  setAlertForInputField,
} from './common/form';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { Inputs } from '../types/inputs.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';

const setValidationForDataEntry = (
  aType: string,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aButtonAddNewElm: HTMLButtonElement,
  aFormOptionInputsDivElm: HTMLElement
) => {
  const isInputed = [...aAddNewTextAreaElms].every((elm) => elm.value);
  setAlertForInputField(
    aAddNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    isInputed,
    'textarea'
  );
  aButtonAddNewElm.disabled = isInputed ? false : true;

  if (aType === 'selection') {
    const checkboxElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-addNewOptionsCheckbox'
    );
    const inputTextElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-addNewOptionsInputText'
    );
    const isChecked = [...checkboxElms].some(
      (elm) => (elm as HTMLInputElement).checked
    );
    const isInputed2 = [...inputTextElms].every(
      (elm) => (elm as HTMLInputElement).value
    );

    setAlertForInputField(
      checkboxElms as NodeListOf<HTMLInputElement>,
      isChecked,
      'checkbox'
    );

    const inputValues: string[] = getInputValues(
      inputTextElms as NodeListOf<HTMLInputElement>,
      true
    );
    const duplicateValuesIndices =
      setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices(
        inputValues,
        inputTextElms as NodeListOf<HTMLInputElement>
      );
    if (!duplicateValuesIndices.length) {
      setAlertForInputField(
        inputTextElms as NodeListOf<HTMLInputElement>,
        isInputed2,
        'inputText'
      );
    }

    aButtonAddNewElm.disabled =
      isInputed && isChecked && isInputed2 && !duplicateValuesIndices.length
        ? false
        : true;
  }
};

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
      'keyup'
    );
    setDisabled(
      aAddNewTypeSelectElm,
      aAddNewTextAreaElms,
      aFormOptionInputsDivElm,
      aButtonAddNewElm,
      'checkbox',
      'click'
    );
    setDisabled(
      aAddNewTypeSelectElm,
      aAddNewTextAreaElms,
      aFormOptionInputsDivElm,
      aButtonAddNewElm,
      'inputText',
      'keyup'
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
  aListDtElms: NodeListOf<HTMLElement>
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

    const checkboxElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-addNewOptionsCheckbox'
    );
    const inputTextElms = aFormOptionInputsDivElm.querySelectorAll(
      '.js-addNewOptionsInputText'
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
      : 1;

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
        setCategoryInputs(
          aQuizCategory,
          aQuizData,
          aModalForDeleteElms,
          aButtonCancelElm,
          aSectionElms,
          aBsModal,
          aButtonSaveElm
        );
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
    aAddNewPrioritySelectElm.value = 'high';

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
      aListDtElms
    );

    displayModalToSelectWhatToDoNextAfterSavingData(
      'whatToDoNext',
      '新規登録',
      aQuizData.size,
      '問題',
      aSectionElms
    );
  });
}

const setValidationForQuizDetailOfIdx3 = () => {
  // *******
};

export function setDisabled(
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement> | null,
  aFormOptionInputsDivElm: HTMLElement,
  aButtonAddNewElm: HTMLButtonElement | null,
  aElms: string,
  aEvent: string
) {
  const checkboxElms = aFormOptionInputsDivElm.querySelectorAll(
    '.js-addNewOptionsCheckbox'
  );
  const inputTextElms = aFormOptionInputsDivElm.querySelectorAll(
    '.js-addNewOptionsInputText'
  );

  const elms: NodeListOf<Element> | null =
    aElms === 'textarea'
      ? aAddNewTextAreaElms
      : aElms === 'checkbox'
        ? checkboxElms
        : inputTextElms;

  if (elms) {
    for (const elm of elms) {
      elm.addEventListener(aEvent, function () {
        const type = aAddNewTypeSelectElm.value;

        if (aButtonAddNewElm && aAddNewTextAreaElms) {
          setValidationForDataEntry(
            type,
            aAddNewTextAreaElms,
            aButtonAddNewElm,
            aFormOptionInputsDivElm
          );
        } else {
          setValidationForQuizDetailOfIdx3();
        }

        if (aElms === 'checkbox') {
          (elm as HTMLInputElement).dataset.checktemporary = String(
            (elm as HTMLInputElement).checked
          );
        } else if (aElms === 'inputText') {
          (elm as HTMLInputElement).dataset.texttemporary = (
            elm as HTMLInputElement
          ).value;
        }
      });
    }
  }
}

export function setValidation(
  aAddNewTypeSelectElm: HTMLSelectElement,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aFormOptionInputsDivElm: HTMLElement
) {
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'textarea',
    'keyup'
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'checkbox',
    'click'
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'inputText',
    'keyup'
  );
}
