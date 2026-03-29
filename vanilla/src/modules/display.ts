import { Collapse } from 'bootstrap';
import { displayList } from './quizList';
import {
  saveCategoryData,
  setButtonDisabledForCategory,
  editOrDeleteCategoryName,
  addCategoryInput,
} from './categorySettings';
import {
  switchType,
  setOptionInputs,
  saveQuizData,
  setValidation,
} from './addNew';
import {
  setQuizStartForm,
  getQuizDataForPractice,
  displayQuizQuestionAndAnswers,
} from './quizStart';
import { goToCategoryToSetNewCategory } from './common/utils';
import { getInputValues } from './inputValidation';
import {
  getCategoryOptions,
  getTypeOptions,
  getPriorityOptions,
  getFormElements,
  getHTMLForOptionInputsOfSelection,
} from './common/form';
import { displayModalForPageTransition } from './common/modal';
import type { Inputs } from '../types/inputs.type';
import type { FormElementsIrregularIndex3Type } from '../types/formElementsIrregularIndex3.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';
import type { modalForPageTransitionElmsType } from '../types/modalForPageTransitionElms.type';

export function displayPage(
  aIndex: number,
  aSectionElms: NodeListOf<HTMLElement>
) {
  aSectionElms.forEach((elm) => {
    elm.classList.add('d-none');
  });
  aSectionElms[aIndex].classList.remove('d-none');
}

export function switchPage(
  aIndex: number,
  aIsCategorySettingsUnderEdit: boolean,
  aModalForPageTransitionElms: Partial<modalForPageTransitionElmsType>,
  aButtonCancelElm: HTMLButtonElement | null,
  aSectionElms: NodeListOf<HTMLElement>
) {
  const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;

  const hasDnoneArray = Array.from(sectionElms).map((elm) =>
    elm.classList.contains('d-none')
  );

  let isContinued = true;
  if (!hasDnoneArray[1]) {
    //when leaving quizlist
    // reset quizlist
    // setQuizList(aQuizData, aQuizCategory);
    displayPage(aIndex, sectionElms);
  } else if (!hasDnoneArray[3]) {
    //when leaving the category settings
    const buttons = (
      aButtonCancelElm?.parentNode as HTMLElement
    ).querySelectorAll('button');
    const isQuestionUnderEdit = buttons[1].classList.contains(
      'js-quizDataIsUnderEdit'
    );
    const isNewDataUnderEdit = buttons[1].classList.contains(
      'js-newDataIsUnderEdit'
    );

    const setModalFunction = (
      aIndex: number,
      aPageTransitionPatternIndex: number
    ) => {
      displayModalForPageTransition(
        aIndex,
        aButtonCancelElm as HTMLButtonElement,
        aPageTransitionPatternIndex,
        aModalForPageTransitionElms as modalForPageTransitionElmsType,
        aSectionElms
      );
    };

    if (aIsCategorySettingsUnderEdit) {
      isContinued = false;
      let pageTransitionPatternIndex = 0;
      if (isQuestionUnderEdit) {
        pageTransitionPatternIndex = aIndex === 1 ? 5 : 2;
      } else if (isNewDataUnderEdit) {
        pageTransitionPatternIndex = aIndex === 2 ? 6 : 4;
      }
      setModalFunction(aIndex, pageTransitionPatternIndex);
    } else if (isQuestionUnderEdit) {
      if (aIndex !== 1 && aIndex !== 3) {
        isContinued = false;
        setModalFunction(aIndex, 1);
      }
    } else if (isNewDataUnderEdit) {
      if (aIndex !== 2 && aIndex !== 3) {
        isContinued = false;
        setModalFunction(aIndex, 3);
      }
    }
  }
  if (isContinued) {
    displayPage(aIndex, sectionElms);
  }
}

export function setupDisplay(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aIsCategorySettingsUnderEdit: boolean,
  aModalForPageTransitionElms: modalForPageTransitionElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>
) {
  const pageIndex = !aQuizCategory.size ? 3 : !aQuizData.size ? 2 : 0;
  switchPage(
    pageIndex,
    aIsCategorySettingsUnderEdit,
    aModalForPageTransitionElms as modalForPageTransitionElmsType,
    aButtonCancelElm,
    aSectionElms
  );
}

export function closeGlobalMenu(aGlobalNavElm: HTMLElement) {
  const bsCollapse = new Collapse(aGlobalNavElm, { toggle: false });
  const mediaQueryList = window.matchMedia('(max-width: 992px)');
  const hideMenus = (matches: boolean) => {
    if (matches) {
      document.addEventListener('click', function (e: MouseEvent) {
        if (aGlobalNavElm.classList.contains('show')) {
          const target = e.target;
          if (target instanceof Node) {
            bsCollapse.hide();
          }
        }
      });
    }
  };

  const listener = (e: MediaQueryListEvent) => {
    hideMenus(e.matches);
  };

  mediaQueryList.addEventListener('change', listener);
  hideMenus(mediaQueryList.matches);
}

export function setQuizList(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  const listDivElms = document.querySelectorAll('.js-listDiv');
  const listUlElm = document.querySelector('.js-listUl');
  displayList(
    aQuizData,
    aQuizCategory,
    listDivElms as NodeListOf<Element>,
    listUlElm as HTMLElement,
    aModalForDeleteElms,
    aCurrentValKeys,
    aBsModal,
    aSectionElms,
    aButtonSaveElm as HTMLButtonElement,
    aButtonCancelElm,
    aListDtElms,
    aDivIdx3DivElms as NodeListOf<HTMLElement>
  );

  const buttonGoToAddNewElm = document.querySelector('.js-buttonGoToAddNew');
  buttonGoToAddNewElm?.addEventListener('click', function () {
    switchPage(2, false, {}, null, aSectionElms);
  });
}

export function getCategoryInputHTML(
  aQuizCategory: Map<number, InputsCategory>
) {
  let inputsData = '';

  if (aQuizCategory.size) {
    [...aQuizCategory].forEach(([key, val]) => {
      let isDisabled = '';
      inputsData += '<div class="my-3 position-relative">';
      if (val?.isActive) {
        inputsData += `<span>問題に設定済みのカテゴリー名</span>`;
        inputsData += `<div class="position-absolute bottom-0 end-0">
                      <button class="btn btn-primary me-1 js-categoryEditBtn" type="button">編集する</button>
                      <button class="btn btn-primary js-categoryDeleteBtn" type="button">削除する</button>
                    </div>`;
        isDisabled = ' disabled';
      }
      inputsData += `<input type="text" class="form-control" id="input-${key}" value="${val?.categoryName || ''}" data-is-active="${val?.isActive || false}" data-index="${key}" ${isDisabled} />
    </div>`;
    });
  } else {
    Array(3)
      .fill('')
      .forEach((_, index) => {
        inputsData += `<div class="my-3">
        <input type="text" class="form-control" id="input-${index}" value="" data-is-active="false" data-index="${index}" />
        </div>`;
      });
  }
  return inputsData;
}

export function setCategoryInputs(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement
) {
  const inputCategoryAreaElm =
    document.querySelector<HTMLElement>('.js-inputCategory');

  if (inputCategoryAreaElm !== null) {
    inputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }

  const inputCategoryElms =
    inputCategoryAreaElm?.querySelectorAll<HTMLInputElement>('input');

  const initialInputValues: string[] = getInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>,
    true
  );

  const buttonAddInputElm =
    document.querySelector<HTMLButtonElement>('.js-buttonAddInput');

  aButtonSaveElm?.addEventListener('click', function (e) {
    e.preventDefault();
    saveCategoryData(
      aButtonSaveElm as HTMLButtonElement,
      inputCategoryAreaElm as HTMLElement,
      aSectionElms,
      aQuizData,
      aQuizCategory,
      aModalForDeleteElms,
      aButtonCancelElm,
      aBsModal
    );
  });

  addCategoryInput(
    inputCategoryAreaElm as HTMLElement,
    buttonAddInputElm as HTMLButtonElement,
    aQuizCategory
  );

  editOrDeleteCategoryName(
    inputCategoryAreaElm as HTMLElement,
    initialInputValues,
    aButtonSaveElm as HTMLButtonElement,
    aButtonCancelElm as HTMLButtonElement,
    buttonAddInputElm as HTMLButtonElement,
    aModalForDeleteElms,
    aBsModal
  );

  let isUnderEdit = false;

  setButtonDisabledForCategory(
    aButtonSaveElm as HTMLButtonElement,
    initialInputValues as string[],
    inputCategoryAreaElm as HTMLElement,
    isUnderEdit as boolean,
    aButtonCancelElm as HTMLButtonElement,
    buttonAddInputElm as HTMLButtonElement
  );
}

export function setAddNew(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
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
      addNewPrioritySelectElm.innerHTML = getPriorityOptions('high');
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
    aCurrentValKeys as (keyof Inputs)[],
    aBsModal,
    aButtonSaveElm,
    aListDtElms,
    aDivIdx3DivElms
  );

  const buttonBackToListFromAddNewElm = document.querySelector(
    '.js-buttonBackToListFromAddNew'
  );
  buttonBackToListFromAddNewElm?.addEventListener('click', function () {
    switchPage(1, false, {}, null, aSectionElms);
  });

  addNewCategorySelectElm?.addEventListener('change', function (e) {
    const targetValue = (e.currentTarget as HTMLSelectElement).value;
    if (targetValue === 'add') {
      goToCategoryToSetNewCategory(
        aSectionElms,
        'addNew',
        aButtonSaveElm,
        aButtonCancelElm
      );
    }
  });
}

export function setQuizStart(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement
) {
  const quizStartFormCategorySelectElm = document.querySelector(
    '.js-quizStartFormCategorySelect'
  );
  const quizStartFormTypeSelectElm = document.querySelector(
    '.js-quizStartFormTypeSelect'
  );
  setQuizStartForm(
    aQuizCategory,
    aButtonSaveElm,
    quizStartFormCategorySelectElm as HTMLElement,
    quizStartFormTypeSelectElm as HTMLElement
  );

  let quizDataForPractice: Inputs[];
  const quizStartFormStartButtonElm = document.querySelector(
    '.js-quizStartFormStartButton'
  );
  const quizDivElms = document.querySelectorAll('.js-quizDiv');
  if (quizStartFormStartButtonElm) {
    quizStartFormStartButtonElm.addEventListener('click', function (e) {
      const targetElm = e.currentTarget as HTMLButtonElement;
      let quizIndex: number = parseInt(targetElm.dataset.index ?? '0');
      if (!quizIndex) {
        quizDataForPractice = getQuizDataForPractice(
          aQuizData,
          (quizStartFormTypeSelectElm as HTMLSelectElement).value,
          'random'
        ) as Inputs[];
      }

      displayQuizQuestionAndAnswers(quizDataForPractice, quizIndex);
      if (targetElm) {
        targetElm.dataset.index = String(quizIndex + 1);
      }
      quizDivElms[0].classList.add('d-none');
      quizDivElms[1].classList.remove('d-none');
    });
  }
}
