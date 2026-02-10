import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { Listener } from '../types/listener.type';
import {
  setupDisplay,
  setCategoryInputs,
  getCategoryInputHTML,
} from '../modules/display';

export function saveCategoryData(
  aQuizData: Map<number, Inputs>,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement
) {
  aButtonSaveElm?.addEventListener('click', function () {
    const inputCategoryElms =
      aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');

    let newMap = new Map<number, InputsCategory>();
    let empty = 0;
    let cnt = 0;
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
        newMap.set(cnt, values);
        ++cnt;
      }
    });
    if (empty === inputCategoryElms.length) {
      return;
    }

    localStorage.setItem('quizCategory', JSON.stringify([...newMap]));

    setupDisplay(
      newMap as Map<number, InputsCategory>,
      aQuizData as Map<number, Inputs>
    );

    setCategoryInputs(
      newMap as Map<number, InputsCategory>,
      aQuizData as Map<number, Inputs>
    );
  });
}

export function addCategoryInput(
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement
) {
  aButtonAddInputElm?.addEventListener('click', function () {
    const div = document.createElement('div');
    div.classList.add('my-3');

    div.innerHTML = `<input type="text" class="form-control" value="" data-isActive="false" />`;
    aInputCategoryAreaElm?.appendChild(div);
  });
}

export function getCategoryInputValues(
  aInputCategoryElms: NodeListOf<HTMLInputElement>,
  aIsReset: boolean
) {
  let inputValues: string[] = [];
  aInputCategoryElms.forEach((elm) => {
    if (aIsReset) {
      elm.classList.remove('border', 'border-danger', 'border-3');
    }
    inputValues.push(elm.value);
  });
  return inputValues;
}

export function setInputValidationForCategory(
  aInitialInputValues: string[],
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement,
  aIsUnderEdit: boolean,
  aInputCategoryAreaElm: HTMLInputElement
) {
  const inputCategoryElms =
    aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');
  let inputValues: string[] = getCategoryInputValues(inputCategoryElms, true);

  let isSame =
    JSON.stringify(aInitialInputValues) ===
    JSON.stringify(inputValues.filter(Boolean));
  aButtonCancelElm.disabled = aIsUnderEdit ? true : isSame;
  const getDuplicateValuesIndices = (
    aInputValues: string[],
    aIndex: number
  ) => {
    let result: number[] = [];
    aInputValues.forEach((val, cnt) => {
      if (val === aInputValues[aIndex] && aInputValues[aIndex]) {
        result.push(cnt);
      }
    });
    return result;
  };

  const getNextIndex = (
    aInputValues: string[],
    aDuplicateValuesIndices: number[],
    aNextIndex: number
  ) => {
    if (!aInputValues[aNextIndex]) {
      return ++aNextIndex;
    }
    for (let cnt = 0, len = aDuplicateValuesIndices.length; cnt < len; ++cnt) {
      if (aNextIndex === aDuplicateValuesIndices[cnt]) {
        getNextIndex(aInputValues, aDuplicateValuesIndices, ++aNextIndex);
      }
    }
    return aNextIndex;
  };

  let duplicateValuesIndices: number[] = [];
  let nextIndex: number = getNextIndex(inputValues, duplicateValuesIndices, 0);

  const inputValuesLength = inputValues.length;
  inputValues.forEach((_, cnt) => {
    if (nextIndex < inputValuesLength) {
      nextIndex = getNextIndex(inputValues, duplicateValuesIndices, cnt);
      let tempIndices = getDuplicateValuesIndices(inputValues, cnt);
      if (duplicateValuesIndices.length > 1 && tempIndices.length > 1) {
        if (duplicateValuesIndices.every((i) => i !== tempIndices[0])) {
          duplicateValuesIndices = duplicateValuesIndices.concat(tempIndices);
        }
      } else if (tempIndices.length > 1) {
        duplicateValuesIndices = tempIndices;
      }
    }
  });
  duplicateValuesIndices.forEach((index) => {
    inputCategoryElms[index].classList.add(
      'border',
      'border-danger',
      'border-3'
    );
  });

  if (aIsUnderEdit) {
    aButtonSaveElm.disabled = true;
  } else {
    let inputValues: string[] = getCategoryInputValues(
      inputCategoryElms,
      false
    );
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

export function setButtonDisabledForCategory(
  aButtonSaveElm: HTMLButtonElement,
  aInitialInputValues: string[],
  aQuizCategory: Map<number, InputsCategory>,
  aInputCategoryAreaElm: HTMLElement,
  aIsUnderEdit: boolean,
  aButtonCancelElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement
) {
  aButtonCancelElm?.addEventListener('click', function () {
    if (aInputCategoryAreaElm !== null) {
      aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
    }

    editOrDeleteCategoryName(
      aInputCategoryAreaElm as HTMLElement,
      aInitialInputValues,
      aButtonSaveElm as HTMLButtonElement,
      aButtonCancelElm as HTMLButtonElement,
      aButtonAddInputElm as HTMLButtonElement
    );

    aButtonSaveElm.disabled = true;
    this.disabled = true;
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

const getButtonStatus = (
  aButtonCancelElm: HTMLButtonElement,
  aButtonSaveElm: HTMLButtonElement
) => {
  return [aButtonCancelElm.disabled, aButtonSaveElm.disabled];
};

export function editOrDeleteCategoryName(
  aInputCategoryAreaElm: HTMLElement,
  aInitialInputValues: string[],
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement
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

  let originalButtonStatus: boolean[] = Array(false);
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
        originalButtonStatus = getButtonStatus(
          aButtonCancelElm!,
          aButtonSaveElm!
        );
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
          aInputCategoryAreaElm as HTMLInputElement
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
        if (aButtonAddInputElm) {
          aButtonAddInputElm.disabled = false;
        }
        aButtonCancelElm.disabled = originalButtonStatus[0];
        aButtonSaveElm.disabled = originalButtonStatus[1];
      } else if (!isUnderEdit) {
        console.log('display a delete panel');
      }
    });
  });
}
