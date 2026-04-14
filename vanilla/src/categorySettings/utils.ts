import { setQuizStart } from '../quizStart/setup';
import {
  getInputValues,
  setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices,
} from '../common/forms/validation';
import {
  displayModalToSelectWhatToDoNextAfterSavingData,
  displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData,
  showModalForDelete,
} from '../common/modals/modal';
import {
  getCategoryOptions,
  setDivIndex1FormForQuizDetailIdx0Category,
} from '../common/forms/form';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';

export function editOrDeleteCategoryNamesAndSetValidationForInput(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement,
  aInitialInputValues: string[],
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>
) {
  // edit or delete --- start
  const editBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryEditBtn'
  );
  const deleteBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryDeleteBtn'
  );
  let isUnderEdit: boolean = false;
  let targetInputElm: HTMLInputElement;
  let originalValue: string = '';
  // edit or save data
  editBtnElms.forEach((elm, idx) => {
    elm.addEventListener('click', function (e) {
      isUnderEdit = !isUnderEdit;
      targetInputElm = this.parentNode?.nextSibling as HTMLInputElement;
      const targetEditBtnElm = e.currentTarget as HTMLButtonElement;
      if (targetEditBtnElm) {
        targetEditBtnElm.disabled = isUnderEdit;
        targetEditBtnElm.textContent = isUnderEdit ? '上書きする' : '編集する';
        targetEditBtnElm.classList.add('js-targetEditBtn');
      }
      if (targetInputElm) {
        targetInputElm.disabled = !isUnderEdit;
        targetInputElm.classList.add('js-targetInput');
        targetInputElm.dataset.originalvalue = targetInputElm.value;
      }
      deleteBtnElms[idx].textContent = isUnderEdit ? 'キャンセル' : '削除する';
      setDisabledStatusForEditAndDeleteButtonsOfCategoryNames(
        aInputCategoryAreaElm,
        targetInputElm,
        isUnderEdit
      );
      aButtonAddInputElm.disabled = isUnderEdit;

      if (isUnderEdit) {
        targetInputElm.focus();
        originalValue = targetInputElm.value;
      } else {
        //when saving the target category name
        aButtonSaveElm.dataset.iscategorynameupdated = 'true';
        aButtonCancelElm.dataset.iscategorynameedited = 'true';
        const key = parseInt(targetInputElm.dataset.index ?? '10000');
        const currentVal = aQuizCategory.get(key);
        aQuizCategory.set(key, {
          categoryName: targetInputElm.value,
          isActive: currentVal?.isActive ?? false,
        });
        localStorage.setItem(
          'quizCategory',
          JSON.stringify([...aQuizCategory])
        );
        targetEditBtnElm.classList.remove('js-targetEditBtn');
        targetInputElm.classList.remove('js-targetInput');

        resetCategoryNamesInOtherPages(
          aQuizData,
          aQuizCategory,
          aSectionElms,
          aButtonSaveElm,
          aButtonCancelElm,
          aListDivElms
        );
      }
    });
  });

  // delete data or cancel change
  deleteBtnElms.forEach((elm, idx) => {
    elm.addEventListener('click', function (e) {
      const targetCancelOrDeleteBtnElm = e.currentTarget as HTMLButtonElement;
      if (isUnderEdit) {
        //when clicking a cancel button
        isUnderEdit = false;
        targetCancelOrDeleteBtnElm.textContent = '削除する';
        editBtnElms[idx].textContent = '編集する';
        editBtnElms[idx].disabled = false;
        targetInputElm.disabled = true;
        targetInputElm.value = originalValue;

        setDisabledStatusForEditAndDeleteButtonsOfCategoryNames(
          aInputCategoryAreaElm,
          targetInputElm,
          isUnderEdit
        );
        aButtonAddInputElm.disabled = isUnderEdit;
        setInputValidationForCategory(
          aInitialInputValues,
          aButtonCancelElm,
          aButtonSaveElm,
          isUnderEdit,
          aInputCategoryAreaElm as HTMLElement
        );
      } else if (!isUnderEdit) {
        // when deleting data
        const targetInputElm = this?.parentNode?.nextSibling;

        showModalForDelete(
          targetInputElm as HTMLInputElement,
          aModalForDeleteElms,
          null,
          aBsModal
        );
      }
    });
  });

  // edit or delete --- end

  // set validation for input fields
  aInputCategoryAreaElm.addEventListener('keyup', function () {
    setInputValidationForCategory(
      aInitialInputValues,
      aButtonCancelElm,
      aButtonSaveElm,
      isUnderEdit,
      aInputCategoryAreaElm as HTMLElement
    );
  });
}

export function saveCategoryData(
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonCancelElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aListDivElms: NodeListOf<HTMLElement>
) {
  aButtonSaveElm.dataset.iscategorynameupdated = 'true';

  let inputCategoryElms =
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

  resetCategoryNamesInOtherPages(
    aQuizData,
    aQuizCategory,
    aSectionElms,
    aButtonSaveElm,
    aButtonCancelElm,
    aListDivElms
  );

  // reset category inputs : start
  if (aInputCategoryAreaElm !== null) {
    aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }
  inputCategoryElms = aInputCategoryAreaElm?.querySelectorAll('input');

  const initialInputValues: string[] = getInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>,
    true
  );
  editOrDeleteCategoryNamesAndSetValidationForInput(
    aQuizData,
    aQuizCategory,
    aInputCategoryAreaElm,
    aButtonAddInputElm as HTMLButtonElement,
    initialInputValues,
    aButtonCancelElm,
    aButtonSaveElm,
    aModalForDeleteElms as modalForDeleteElmsType,
    aBsModal as bootstrap.Modal,
    aSectionElms,
    aListDivElms
  );
  // reset category inputs : end

  const buttonSaveAndCancelElms =
    aButtonSaveElm?.parentNode?.querySelectorAll('button');
  buttonSaveAndCancelElms?.forEach((elm) => {
    elm.disabled = true;
  });

  if (
    aButtonSaveElm.dataset.isquizdataunderedit === 'true' &&
    aButtonSaveElm.dataset.iscategorynameupdated === 'true'
  ) {
    displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData(
      aButtonSaveElm,
      'カテゴリー設定を保存しました。<br />編集中のクイズ詳細ページに戻りますか？',
      '※「ページを移動しない」を選択した場合は<br />クイズ詳細の編集中の内容はキャンセルされます。',
      aSectionElms,
      aListDivElms
    );
  } else if (
    aButtonSaveElm.dataset.isnewdataunderedit === 'true' &&
    aButtonSaveElm.dataset.iscategorynameupdated === 'true'
  ) {
    displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData(
      aButtonSaveElm,
      'カテゴリー設定を保存しました。<br />編集中の新規登録ページに戻りますか？',
      '',
      aSectionElms,
      aListDivElms
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

const resetCategoryNamesInOtherPages = (
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aListDivElms: NodeListOf<HTMLElement>
) => {
  // set updated category names in the registration page
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
        aButtonCancelElm,
        aListDivElms
      );
    }
  }
};

const setInputValidationForCategory = (
  aInitialInputValues: string[],
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement,
  aIsUnderEdit: boolean,
  aInputCategoryAreaElm: HTMLElement
) => {
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
};

export function resetCategoryForm(
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement
) {
  const formElm = document.querySelector('form');
  formElm?.reset();
  aButtonCancelElm.disabled = true;
  aButtonSaveElm.disabled = true;
}

const setDisabledStatusForEditAndDeleteButtonsOfCategoryNames = (
  aInputCategoryAreaElm: HTMLElement,
  aTargetInputElm: HTMLInputElement,
  aIsUnderEdit: boolean
) => {
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
};

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
