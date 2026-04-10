import { setQuizStart } from '../quizStart/setup';
import {
  getInputValues,
  setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices,
} from '../common/forms/validation';
import {
  displayModalToSelectWhatToDoNextAfterSavingData,
  displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData,
} from '../common/modals/modal';
import {
  getCategoryOptions,
  setDivIndex1FormForQuizDetailIdx0Category,
} from '../common/forms/form';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';

export function saveCategoryData(
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonCancelElm: HTMLButtonElement
) {
  const inputCategoryElms =
    aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');

  let newMap = new Map<number, InputsCategory>();
  let empty = 0;
  inputCategoryElms.forEach((elm) => {
    if (!elm.value) {
      ++empty;
    }
    let values: InputsCategory = {
      categoryName: '',
      isActive: false,
    };
    if (elm.value) {
      values.categoryName = elm.value;
      values.isActive = elm?.dataset?.isActive?.toLowerCase() === 'true';
      const key = parseInt(elm?.dataset?.index ?? '0', 10);
      newMap.set(key, values);
    }
  });
  if (empty === inputCategoryElms.length) {
    return;
  }

  localStorage.setItem('quizCategory', JSON.stringify([...newMap]));
  aQuizCategory = newMap;

  // set updated category names in the registration page
  aButtonSaveElm?.classList.add('js-categoryNameIsUpdated');
  const addNewCategorySelectElm = document.querySelector(
    '.js-addNewCategorySelect'
  );
  if (addNewCategorySelectElm) {
    addNewCategorySelectElm.innerHTML = getCategoryOptions(
      aQuizCategory,
      'unspecified',
      aButtonSaveElm,
      true
    );
  }

  // set updated category names in the quiz start page
  setQuizStart(aQuizData, aQuizCategory, aButtonSaveElm as HTMLButtonElement);

  // set updated category names in the quiz detail page : start
  if (aButtonSaveElm.dataset.key) {
    const key = parseInt(aButtonSaveElm.dataset.key, 10);
    const currentVal = aQuizData.get(key);
    if (currentVal) {
      const listDdElms = document.querySelectorAll('.js-listDd');
      const divElms = listDdElms[0].querySelectorAll('div');
      setDivIndex1FormForQuizDetailIdx0Category(
        aQuizCategory,
        currentVal as Inputs,
        aSectionElms,
        listDdElms as NodeListOf<HTMLElement>,
        divElms[1],
        aButtonSaveElm,
        aButtonCancelElm
      );
    }
    aButtonSaveElm.dataset.key = '';
  }

  // reset category inputs : start
  if (aInputCategoryAreaElm !== null) {
    aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }
  // reset category inputs : end

  const buttonSaveAndCancelElms =
    aButtonSaveElm?.parentNode?.querySelectorAll('button');
  buttonSaveAndCancelElms?.forEach((elm) => {
    elm.disabled = true;
  });

  if (
    aButtonSaveElm.classList.contains('js-quizDataIsUnderEdit') &&
    aButtonSaveElm.classList.contains('js-categoryNameIsUpdated')
  ) {
    displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData(
      aButtonSaveElm,
      'カテゴリー設定を保存しました。<br />編集中のクイズ詳細ページに戻りますか？',
      '※「ページを移動しない」を選択した場合は<br />クイズ詳細の編集中の内容はキャンセルされます。',
      aSectionElms
    );
  } else if (
    aButtonSaveElm.classList.contains('js-newDataIsUnderEdit') &&
    aButtonSaveElm.classList.contains('js-categoryNameIsUpdated')
  ) {
    displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData(
      aButtonSaveElm,
      'カテゴリー設定を保存しました。<br />編集中の新規登録ページに戻りますか？',
      '',
      aSectionElms
    );
  } else {
    displayModalToSelectWhatToDoNextAfterSavingData(
      'whatToDoNext',
      'カテゴリー設定の保存',
      newMap.size,
      'カテゴリー',
      aSectionElms
    );
  }
}

export function setInputValidationForCategory(
  aInitialInputValues: string[],
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement,
  aIsUnderEdit: boolean,
  aInputCategoryAreaElm: HTMLElement
) {
  const inputCategoryElms =
    aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');
  let inputValues: string[] = getInputValues(inputCategoryElms, true);

  let isSame =
    JSON.stringify(aInitialInputValues) ===
    JSON.stringify(inputValues.filter(Boolean));
  aButtonCancelElm.disabled = aIsUnderEdit ? true : isSame;

  const duplicateValuesIndices =
    setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices(
      inputValues,
      inputCategoryElms
    );

  if (aIsUnderEdit) {
    aButtonSaveElm.disabled = true;
  } else {
    let inputValues: string[] = getInputValues(inputCategoryElms, false);
    isSame =
      JSON.stringify(aInitialInputValues) ===
      JSON.stringify(inputValues.filter(Boolean));
    aButtonSaveElm.disabled =
      !duplicateValuesIndices.length && !isSame ? false : true;
  }

  if (aIsUnderEdit) {
    const targetEditBtnElm = document.querySelector(
      '.js-targetEditBtn'
    ) as HTMLButtonElement;
    const targetInputElm = document.querySelector(
      '.js-targetInput'
    ) as HTMLInputElement;
    if (targetInputElm) {
      const originalValue = targetInputElm.dataset.originalvalue;

      if (targetEditBtnElm) {
        targetEditBtnElm.disabled =
          targetInputElm.value &&
          originalValue !== targetInputElm.value &&
          !duplicateValuesIndices.length &&
          !isSame
            ? false
            : true;
      }
    }
  }
}

export function resetCategoryForm(
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement
) {
  const formElm = document.querySelector('form');
  formElm?.reset();
  aButtonCancelElm.disabled = true;
  aButtonSaveElm.disabled = true;
}

export function setButtonDisabledForCategory(
  aButtonSaveElm: HTMLButtonElement,
  aInitialInputValues: string[],
  aInputCategoryAreaElm: HTMLElement,
  aIsUnderEdit: boolean,
  aButtonCancelElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement
) {
  aButtonCancelElm?.addEventListener('click', function () {
    resetCategoryForm(aButtonCancelElm, aButtonSaveElm);
    setInputValidationForCategory(
      aInitialInputValues,
      aButtonCancelElm,
      aButtonSaveElm,
      aIsUnderEdit,
      aInputCategoryAreaElm as HTMLElement
    );
  });

  if (aButtonAddInputElm) {
    aButtonAddInputElm.disabled = aIsUnderEdit ? true : false;
  }
}

export function setDisabledStatusForEditAndDeleteButtonsOfCategoryNames(
  aInputCategoryAreaElm: HTMLElement,
  aTargetInputElm: HTMLInputElement,
  aIsUnderEdit: boolean
) {
  const inputCategoryElms =
    aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');
  inputCategoryElms.forEach((elm) => {
    if (aTargetInputElm !== elm) {
      if (elm?.dataset?.isActive?.toLowerCase() === 'true') {
        const btnElms =
          elm?.parentNode?.querySelectorAll<HTMLButtonElement>('button');
        btnElms?.forEach((elm2) => {
          elm2.disabled = aIsUnderEdit;
        });
      } else {
        elm.disabled = aIsUnderEdit;
      }
    }
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
