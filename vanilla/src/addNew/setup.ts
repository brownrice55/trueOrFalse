import { switchType, setOptionInputs, saveQuizData } from './utils';
import {
  getCategoryOptions,
  getTypeOptions,
  getPriorityOptions,
  getFormElements,
  getHTMLForOptionInputsOfSelection,
} from '../common/forms/form';
import {
  setValidation,
  setValidationForDataEntry,
} from '../common/forms/validation';
import { switchPage, goToCategoryToSetNewCategory } from '../common/utils';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';
import type { FormElementsIrregularIndex3Type } from '../common/types/formElementsIrregularIndex3.type';

export function setAddNew(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement,
  aListDivElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>,
  aListUlElm: HTMLElement
) {
  const addNewCategorySelectElm = document.querySelector(
    '.js-addNewCategorySelect'
  );
  const addNewTypeSelectElm = document.querySelector('.js-addNewTypeSelect');
  const addNewTypeDivElms = document.querySelectorAll('.js-addNewTypeDiv');
  const addNewPrioritySelectElm = document.querySelector(
    '.js-addNewPrioritySelect'
  );

  const setForm = () => {
    if (addNewCategorySelectElm) {
      addNewCategorySelectElm.innerHTML = getCategoryOptions(
        aQuizCategory,
        'unspecified',
        aButtonSaveElm,
        true
      );
    }
    if (addNewTypeSelectElm) {
      addNewTypeSelectElm.innerHTML = getTypeOptions('trueOrFalse', false);
    }
    if (addNewPrioritySelectElm) {
      addNewPrioritySelectElm.innerHTML = getPriorityOptions('2');
    }

    const formElementsArray = getFormElements(
      aQuizCategory,
      null,
      aButtonSaveElm,
      'addnew'
    );
    const formElementsIrregularIndex3 =
      formElementsArray[1] as FormElementsIrregularIndex3Type;
    addNewTypeDivElms[0].innerHTML = formElementsIrregularIndex3['trueOrFalse'];
    addNewTypeDivElms[1].innerHTML = formElementsIrregularIndex3['selection'];
  };
  setForm();

  const buttonAddNewElm = document.querySelector('.js-addNew .js-buttonAddNew');
  const addNewTextAreaElms = document.querySelectorAll(
    '.js-addNew .js-addNewTextArea'
  );
  const formAnswerRadioElms = document.querySelectorAll(
    '.js-addNew .js-formAnswerRadio'
  );

  const formOptionInputsDivElm = document.querySelector(
    '.js-addNew .js-formOptionInputsDiv'
  );
  const formOptionNumberSelectElm = document.querySelector(
    '.js-addNew .js-formOptionNumberSelect'
  );

  const setFormForTypeSelection = () => {
    switchType(
      addNewTypeSelectElm as HTMLElement,
      addNewTypeDivElms as NodeListOf<HTMLElement>,
      buttonAddNewElm as HTMLButtonElement,
      addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
      formOptionInputsDivElm as HTMLElement
    );
    setOptionInputs(
      formOptionNumberSelectElm as HTMLSelectElement,
      formOptionInputsDivElm as HTMLElement,
      addNewTypeSelectElm as HTMLSelectElement,
      addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
      buttonAddNewElm as HTMLButtonElement
    );
  };
  setFormForTypeSelection();

  if (formOptionInputsDivElm) {
    formOptionInputsDivElm.innerHTML = getHTMLForOptionInputsOfSelection(
      2,
      formOptionInputsDivElm as HTMLElement,
      'addnew',
      null
    );
  }

  setValidation(
    addNewTypeSelectElm as HTMLSelectElement,
    buttonAddNewElm as HTMLButtonElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    formOptionInputsDivElm as HTMLElement
  );

  saveQuizData(
    aQuizData,
    aQuizCategory,
    buttonAddNewElm as HTMLButtonElement,
    addNewCategorySelectElm as HTMLSelectElement,
    addNewTypeSelectElm as HTMLSelectElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    addNewPrioritySelectElm as HTMLSelectElement,
    formAnswerRadioElms as NodeListOf<HTMLInputElement>,
    formOptionNumberSelectElm as HTMLSelectElement,
    formOptionInputsDivElm as HTMLElement,
    addNewTypeDivElms as NodeListOf<HTMLElement>,
    aModalForDeleteElms,
    aButtonCancelElm,
    aSectionElms,
    aBsModal,
    aButtonSaveElm,
    aInputCategoryAreaElm,
    aButtonAddInputElm,
    aListDivElms,
    aCurrentValKeys,
    aListDdElms,
    aListDtElms,
    aDivIdx3DivElms,
    aButtonBackToListElms,
    aListUlElm
  );

  const buttonBackToListFromAddNewElm = document.querySelector(
    '.js-buttonBackToListFromAddNew'
  );
  buttonBackToListFromAddNewElm?.addEventListener('click', function () {
    switchPage(1, false, {}, null, aSectionElms, aListDivElms);
  });

  addNewCategorySelectElm?.addEventListener('change', function (e) {
    const targetValue = (e.currentTarget as HTMLSelectElement).value;
    if (targetValue === 'add') {
      goToCategoryToSetNewCategory(
        aSectionElms,
        'addNew',
        aButtonSaveElm,
        aButtonCancelElm,
        aListDivElms
      );
    }
  });

  formOptionNumberSelectElm?.addEventListener('change', function () {
    setValidationForDataEntry(
      'selection',
      addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
      buttonAddNewElm as HTMLButtonElement,
      formOptionInputsDivElm as HTMLElement
    );
  });
}
