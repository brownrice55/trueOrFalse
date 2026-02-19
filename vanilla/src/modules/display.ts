import { Collapse } from 'bootstrap';
import { displayList } from './quizList';
import {
  saveCategoryData,
  setButtonDisabledForCategory,
  editOrDeleteCategoryName,
  addCategoryInput,
} from './categorySettings';
import {
  setCategoryOptions,
  switchType,
  setOptionInputs,
  saveQuizData,
  setValidation,
} from './addNew';
import { getInputValues } from './inputValidation';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';

const funcForDisplay = (aIndex: number) => {
  const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;
  sectionElms.forEach((elm) => {
    elm.classList.add('d-none');
  });
  sectionElms[aIndex].classList.remove('d-none');
};

export function setupDisplay(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>
) {
  const pageIndex = !aQuizCategory.size ? 3 : !aQuizData.size ? 2 : 0;
  funcForDisplay(pageIndex);
}

export function switchPage(aIndex: number) {
  funcForDisplay(aIndex);
}

export function closeGlobalMenu(aGlobalNavElm: HTMLElement) {
  const bsCollapse = new Collapse(aGlobalNavElm, { toggle: false });

  const mediaQueryList = window.matchMedia('(max-width: 992px)');
  const hideMenus = (matches: boolean) => {
    if (matches) {
      document.addEventListener('click', function (e: MouseEvent) {
        const target = e.target;
        if (target instanceof Node) {
          bsCollapse.hide();
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
  aQuizCategory: Map<number, InputsCategory>
) {
  const listDivElms = document.querySelectorAll('.js-listDiv');
  const listUlElm = document.querySelector('.js-listUl');
  displayList(
    aQuizData,
    aQuizCategory,
    listDivElms as NodeListOf<Element>,
    listUlElm as HTMLElement
  );
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
  aQuizData: Map<number, Inputs>
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

  const buttonSaveElm =
    document.querySelector<HTMLButtonElement>('.js-buttonSave');

  const buttonAddInputElm =
    document.querySelector<HTMLButtonElement>('.js-buttonAddInput');

  saveCategoryData(
    aQuizData as Map<number, Inputs>,
    buttonSaveElm as HTMLButtonElement,
    inputCategoryAreaElm as HTMLElement
  );

  addCategoryInput(
    inputCategoryAreaElm as HTMLElement,
    buttonAddInputElm as HTMLButtonElement
  );

  const buttonCancelElm =
    document.querySelector<HTMLButtonElement>('.js-buttonCancel');

  editOrDeleteCategoryName(
    aQuizCategory as Map<number, InputsCategory>,
    aQuizData as Map<number, Inputs>,
    inputCategoryAreaElm as HTMLElement,
    initialInputValues,
    buttonSaveElm as HTMLButtonElement,
    buttonCancelElm as HTMLButtonElement,
    buttonAddInputElm as HTMLButtonElement
  );

  let isUnderEdit = false;

  setButtonDisabledForCategory(
    buttonSaveElm as HTMLButtonElement,
    initialInputValues as string[],
    inputCategoryAreaElm as HTMLElement,
    isUnderEdit as boolean,
    buttonCancelElm as HTMLButtonElement,
    buttonAddInputElm as HTMLButtonElement
  );
}

export function setAddNew(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>
) {
  const addNewCategoryElm = document.querySelector('.js-addNewCategory');
  setCategoryOptions(aQuizCategory, addNewCategoryElm as HTMLElement);

  const addNewTypeSelectElm = document.querySelector('.js-addNewTypeSelect');
  const addNewTypeDivElms = document.querySelectorAll('.js-addNewTypeDiv');

  const buttonAddNewElm = document.querySelector('.js-buttonAddNew');
  const addNewTextAreaElms = document.querySelectorAll('.js-addNewTextArea');
  const addNewPrioritySelectElm = document.querySelector(
    '.js-addNewPrioritySelect'
  );
  const addNewAnswerRadioElms = document.querySelectorAll(
    '.js-addNewAnswerRadio'
  );
  const addNewOptionNumberSelectElm = document.querySelector(
    '.js-addNewOptionNumberSelect'
  );

  const addNewOptionInputsDivElm = document.querySelector(
    '.js-addNewOptionInputsDiv'
  );

  switchType(
    addNewTypeSelectElm as HTMLElement,
    addNewTypeDivElms as NodeListOf<HTMLElement>,
    buttonAddNewElm as HTMLButtonElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    addNewOptionInputsDivElm as HTMLElement
  );

  setOptionInputs(
    addNewOptionNumberSelectElm as HTMLSelectElement,
    addNewOptionInputsDivElm as HTMLElement,
    addNewTypeSelectElm as HTMLSelectElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    buttonAddNewElm as HTMLButtonElement
  );

  saveQuizData(
    aQuizData,
    aQuizCategory,
    buttonAddNewElm as HTMLButtonElement,
    addNewCategoryElm as HTMLSelectElement,
    addNewTypeSelectElm as HTMLSelectElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    addNewPrioritySelectElm as HTMLSelectElement,
    addNewAnswerRadioElms as NodeListOf<HTMLInputElement>,
    addNewOptionNumberSelectElm as HTMLSelectElement,
    addNewOptionInputsDivElm as HTMLElement,
    addNewTypeDivElms as NodeListOf<HTMLElement>
  );

  setValidation(
    addNewTypeSelectElm as HTMLSelectElement,
    buttonAddNewElm as HTMLButtonElement,
    addNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    addNewOptionInputsDivElm as HTMLElement
  );
}
