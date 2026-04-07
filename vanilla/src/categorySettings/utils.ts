import { getCategoryInputHTML } from '../categorySettings/setup';
import { setQuizStart } from '../quizStart/setup';
import type { Listener } from '../common/types/listener.type';
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
    let isSame =
      JSON.stringify(aInitialInputValues) ===
      JSON.stringify(inputValues.filter(Boolean));
    aButtonSaveElm.disabled =
      !duplicateValuesIndices.length && !isSame ? false : true;
  }
}

const handleEventForsetInputValidationForCategory: Listener['handleEvent'] =
  function (this, e) {
    if (e?.target instanceof HTMLInputElement) {
      (e.target as HTMLInputElement).value = e.target.value.trim();
    }

    const inputCategoryAreaElm = e.currentTarget;

    setInputValidationForCategory(
      this.initialInputValues,
      this.buttonCancelElm,
      this.buttonSaveElm,
      this.isUnderEdit,
      inputCategoryAreaElm as HTMLInputElement
    );
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

const getInputStatus = (
  aInputCategoryAreaElm: HTMLElement,
  aTargetInputElm: HTMLInputElement,
  aIsUnderEdit: boolean
) => {
  const inputCategoryElms =
    aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');
  inputCategoryElms.forEach((elm2) => {
    if (aTargetInputElm !== elm2) {
      if (elm2?.dataset?.isActive?.toLowerCase() === 'true') {
        const btnElms =
          elm2?.parentNode?.querySelectorAll<HTMLButtonElement>('button');
        btnElms?.forEach((elm3) => {
          elm3.disabled = aIsUnderEdit;
        });
      } else {
        elm2.disabled = aIsUnderEdit;
      }
    }
  });
};

export function editOrDeleteCategoryName(
  aInputCategoryAreaElm: HTMLElement,
  aInitialInputValues: string[],
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal
) {
  const editBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryEditBtn'
  );
  const deleteBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryDeleteBtn'
  );
  let isUnderEdit: boolean = false;
  let targetInputElm: HTMLInputElement;
  let originalValue: string = '';

  let targetIndex = 0;

  const listener = {
    initialInputValues: aInitialInputValues,
    buttonSaveElm: aButtonSaveElm,
    buttonCancelElm: aButtonCancelElm,
    isUnderEdit: isUnderEdit,
    handleEvent: handleEventForsetInputValidationForCategory,
  };

  aInputCategoryAreaElm?.addEventListener('keyup', listener, false);

  editBtnElms.forEach((elm, index) => {
    elm.addEventListener('click', function () {
      isUnderEdit = !isUnderEdit;
      targetIndex = index;
      const nextSibling = this.parentNode?.nextSibling;
      if (nextSibling instanceof HTMLInputElement) {
        targetInputElm = nextSibling;
      }
      this.disabled = isUnderEdit;
      targetInputElm.disabled = !isUnderEdit;
      this.textContent = isUnderEdit ? '上書きする' : '編集する';
      deleteBtnElms[index].textContent = isUnderEdit
        ? 'キャンセル'
        : '削除する';
      originalValue = targetInputElm.value;
      getInputStatus(aInputCategoryAreaElm, targetInputElm, isUnderEdit);

      if (isUnderEdit) {
        targetInputElm.focus();
        targetInputElm.addEventListener('keyup', function () {
          const isEditInputChanged = originalValue === this.value;
          editBtnElms[index].disabled = isEditInputChanged;
        });
        aButtonSaveElm.disabled = true;
        aButtonCancelElm.disabled = true;
      }

      if (isUnderEdit) {
        aInputCategoryAreaElm?.removeEventListener('keyup', listener, false);
      } else {
        aInputCategoryAreaElm?.addEventListener('keyup', listener, false);
        setInputValidationForCategory(
          aInitialInputValues,
          aButtonCancelElm,
          aButtonSaveElm,
          isUnderEdit,
          aInputCategoryAreaElm as HTMLElement
        );
      }
    });
  });

  deleteBtnElms.forEach((elm, index) => {
    elm.addEventListener('click', function () {
      if (targetIndex === index && isUnderEdit) {
        //when clicking a cancel button
        isUnderEdit = false;
        this.textContent = '削除する';
        editBtnElms[index].textContent = '編集する';
        editBtnElms[index].disabled = false;
        targetInputElm.disabled = true;
        targetInputElm.value = originalValue;
        getInputStatus(aInputCategoryAreaElm, targetInputElm, isUnderEdit);
        aInputCategoryAreaElm?.addEventListener('keyup', listener, false);
        setInputValidationForCategory(
          aInitialInputValues,
          aButtonCancelElm,
          aButtonSaveElm,
          isUnderEdit,
          aInputCategoryAreaElm as HTMLElement
        );
        if (aButtonAddInputElm) {
          aButtonAddInputElm.disabled = false;
        }
      } else if (!isUnderEdit) {
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
}
